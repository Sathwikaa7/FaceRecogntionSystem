from flask import Flask, request, jsonify
from deepface import DeepFace
import os

app = Flask(__name__)

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

        path1 = os.path.join(UPLOAD_FOLDER, img1.filename)
        path2 = os.path.join(UPLOAD_FOLDER, img2.filename)

        img1.save(path1)
        img2.save(path2)

        result = DeepFace.verify(
    path1,
    path2,
    model_name="Facenet"
)

        return jsonify({
            "verified": result["verified"]
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        })

if __name__ == "__main__":
    app.run(debug=True)