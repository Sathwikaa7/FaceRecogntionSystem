from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import os
import json
import csv
from flask import send_file
from datetime import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

HISTORY_FILE = os.path.join(
    UPLOAD_FOLDER,
    "history.json"
)

if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w") as f:
        json.dump([], f)


@app.route("/")
def home():
    return "Face Recognition Backend Running"


@app.route("/verify", methods=["POST"])
def verify_face():
    try:
        img1 = request.files["img1"]
        img2 = request.files["img2"]

        path1 = os.path.join(UPLOAD_FOLDER, img1.filename)
        path2 = os.path.join(UPLOAD_FOLDER, img2.filename)

        img1.save(path1)
        img2.save(path2)

        result = DeepFace.verify(
            path1,
            path2,
            model_name="Facenet",
            enforce_detection=False
        )

        similarity = round((1 - result["distance"]) * 100, 2)

        return jsonify({
            "verified": result["verified"],
            "similarity": similarity
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/register_face", methods=["POST"])
def register_face():
    try:
        name = request.form.get("name")
        image = request.files.get("image")

        if not name or not image:
            return jsonify({
                "success": False,
                "message": "Missing name or image"
            }), 400

        save_path = os.path.join(UPLOAD_FOLDER, f"{name}.jpg")
        image.save(save_path)

        return jsonify({
            "success": True,
            "message": f"{name} registered successfully"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/get_registered_faces")
def get_registered_faces():
    try:
        faces = []

        for file in os.listdir(UPLOAD_FOLDER):
            if file.endswith(".jpg") and file != "temp.jpg":
                faces.append(file.replace(".jpg", ""))

        return jsonify(faces)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/delete_face/<name>", methods=["DELETE"])
def delete_face(name):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, f"{name}.jpg")

        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({
                "success": True,
                "message": f"{name} deleted"
            })

        return jsonify({
            "success": False,
            "message": "Face not found"
        }), 404

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
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

        temp_path = os.path.join(UPLOAD_FOLDER, "temp.jpg")
        image.save(temp_path)

        registered_files = os.listdir(UPLOAD_FOLDER)

        for file in registered_files:
            if file == "temp.jpg":
                continue
            if not file.endswith(".jpg"):
                continue

            registered_path = os.path.join(UPLOAD_FOLDER, file)

            result = DeepFace.verify(
                temp_path,
                registered_path,
                model_name="Facenet",
                enforce_detection=False
            )

            if result["verified"]:
                name = file.replace(".jpg", "")

                similarity = round(
                    (1 - result["distance"]) * 100,
                    2
                )

                with open(HISTORY_FILE, "r") as f:
                    history = json.load(f)

                history.append({
                    "name": name,
                    "similarity": similarity,
                    "time": datetime.now().strftime("%d-%m-%Y %H:%M:%S")
                })

                with open(HISTORY_FILE, "w") as f:
                    json.dump(history, f, indent=4)

                return jsonify({
                    "success": True,
                    "recognized": True,
                    "name": name,
                    "similarity": similarity,
                    "message": "Face recognized"
                })

        return jsonify({
            "success": True,
            "recognized": False,
            "message": "No matching face found"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/history")
def get_history():
    try:
        with open(HISTORY_FILE, "r") as f:
            history = json.load(f)

        return jsonify(history)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/clear_history", methods=["DELETE"])
def clear_history():
    try:
        with open(HISTORY_FILE, "w") as f:
            json.dump([], f)

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/stats")
def stats():
    try:
        with open(HISTORY_FILE, "r") as f:
            history = json.load(f)

        faces = len([
            file for file in os.listdir(UPLOAD_FOLDER)
            if file.endswith(".jpg") and file != "temp.jpg"
        ])

        return jsonify({
            "registered_faces": faces,
            "recognitions": len(history)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route("/export_history")
def export_history():

    try:

        csv_file = os.path.join(
            UPLOAD_FOLDER,
            "history.csv"
        )

        with open(
            HISTORY_FILE,
            "r"
        ) as f:

            history = json.load(f)

        with open(
            csv_file,
            "w",
            newline=""
        ) as file:

            writer = csv.writer(file)

            writer.writerow([
                "Name",
                "Similarity",
                "Time"
            ])

            for item in history:

                writer.writerow([
                    item["name"],
                    item["similarity"],
                    item["time"]
                ])

        return send_file(
            csv_file,
            as_attachment=True
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )