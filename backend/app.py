from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route("/")
def home():
    return "Face Recognition Backend Running"


@app.route("/verify", methods=["POST"])
def verify_face():
    try:
        img1 = request.files["img1"]
        img2 = request.files["img2"]

        path1 = os.path.join(
            UPLOAD_FOLDER,
            img1.filename
        )

        path2 = os.path.join(
            UPLOAD_FOLDER,
            img2.filename
        )

        img1.save(path1)
        img2.save(path2)

        result = DeepFace.verify(
            path1,
            path2,
            model_name="Facenet",
            enforce_detection=False
        )

        return jsonify({
            "verified": result["verified"]
        })

    except Exception as e:
        print(e)

        return jsonify({
            "error": str(e)
        }), 500


@app.route("/register_face", methods=["POST"])
def register_face():
    try:
        name = request.form.get("name")
        image = request.files.get("image")

        print("NAME:", name)
        print("IMAGE:", image)

        if not name or not image:
            return jsonify({
                "success": False,
                "message": "Missing name or image"
            }), 400

        save_path = os.path.join(
            UPLOAD_FOLDER,
            f"{name}.jpg"
        )

        image.save(save_path)

        return jsonify({
            "success": True,
            "message": f"{name} registered successfully"
        }), 200

    except Exception as e:
        print(e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/get_registered_faces")
def get_registered_faces():
    try:
        faces = []

        for file in os.listdir(UPLOAD_FOLDER):

            if (
                file.endswith(".jpg")
                and file != "temp.jpg"
            ):

                faces.append(
                    file.replace(".jpg", "")
                )

        return jsonify(faces)

    except Exception as e:
        print(e)

        return jsonify({
            "error": str(e)
        }), 500


@app.route("/recognize_face", methods=["POST"])
def recognize_face():
    try:
        image = request.files.get("image")

        if not image:
            return jsonify({
                "success": False,
                "message": "No image provided"
            }), 400

        temp_path = os.path.join(
            UPLOAD_FOLDER,
            "temp.jpg"
        )

        image.save(temp_path)

        registered_files = os.listdir(
            UPLOAD_FOLDER
        )

        for file in registered_files:

            if file == "temp.jpg":
                continue

            if not file.endswith(".jpg"):
                continue

            registered_path = os.path.join(
                UPLOAD_FOLDER,
                file
            )

            result = DeepFace.verify(
                temp_path,
                registered_path,
                model_name="Facenet",
                enforce_detection=False
            )

            print(
                file,
                result["verified"]
            )

            if result["verified"]:

                name = file.replace(
                    ".jpg",
                    ""
                )

                return jsonify({
                    "success": True,
                    "recognized": True,
                    "name": name,
                    "confidence": float(
                        result["distance"]
                    ),
                    "message": "Face recognized"
                })

        return jsonify({
            "success": True,
            "recognized": False,
            "message": "No matching face found"
        })

    except Exception as e:
        print(e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)