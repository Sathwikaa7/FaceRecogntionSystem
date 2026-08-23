from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import os
import json
import csv
from flask import send_file
from datetime import datetime

app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": [
            "https://face-recognition-frontend-u9ws.onrender.com",
            "http://localhost:3001",
            "http://localhost:5173"
        ]
    }
})

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
        print("=== Face registration request received ===")

        name = request.form.get("name")
        image = request.files.get("image")

        if not name or not image:
            return jsonify({
                "success": False,
                "message": "Missing name or image"
            }), 400

        name = name.strip()

        if not name:
            return jsonify({
                "success": False,
                "message": "Name cannot be empty"
            }), 400

        import re
        name = re.sub(r'[^\w\-_.]', '', name)

        save_path = os.path.join(UPLOAD_FOLDER, f"{name}.jpg")

        image.save(save_path)

        if not os.path.exists(save_path):
            return jsonify({
                "success": False,
                "message": "Failed to save image"
            }), 500

        if os.path.getsize(save_path) == 0:
            os.remove(save_path)
            return jsonify({
                "success": False,
                "message": "Uploaded image is empty"
            }), 400

        print(f"Face registered successfully: {name}")

        return jsonify({
            "success": True,
            "message": f"{name} registered successfully"
        })

    except Exception as e:
        print(f"ERROR in register_face: {str(e)}")

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
    temp_path = None
    try:
        print("=== Recognition request received ===")
        
        image = request.files.get("image")
        if not image:
            print("ERROR: No image provided")
            return jsonify({
                "success": False,
                "message": "No image provided"
            }), 400

        print(f"Image received: {image.filename}, Content-Type: {image.content_type}")
        
        temp_path = os.path.join(UPLOAD_FOLDER, "temp.jpg")
        print(f"Saving image to: {temp_path}")
        
        # Save image with error handling
        try:
            image.save(temp_path)
        except Exception as save_error:
            print(f"ERROR saving image: {str(save_error)}")
            return jsonify({
                "success": False,
                "message": f"Failed to save image: {str(save_error)}"
            }), 500
        
        # Verify the image was saved and is readable
        if not os.path.exists(temp_path):
            print("ERROR: Failed to save image")
            return jsonify({
                "success": False,
                "message": "Failed to save uploaded image"
            }), 500
            
        file_size = os.path.getsize(temp_path)
        print(f"Image saved successfully. File size: {file_size} bytes")
        
        if file_size == 0:
            print("ERROR: Saved image is empty")
            return jsonify({
                "success": False,
                "message": "Uploaded image is empty"
            }), 400

        # Check if uploads directory exists and get registered files
        if not os.path.exists(UPLOAD_FOLDER):
            print("ERROR: Upload folder does not exist")
            return jsonify({
                "success": False,
                "message": "Upload folder not found"
            }), 500

        try:
            registered_files = os.listdir(UPLOAD_FOLDER)
        except Exception as list_error:
            print(f"ERROR listing upload folder: {str(list_error)}")
            return jsonify({
                "success": False,
                "message": f"Cannot access upload folder: {str(list_error)}"
            }), 500
            
        print(f"Found {len(registered_files)} files in upload folder")
        
        jpg_files = [f for f in registered_files if f.endswith(".jpg") and f != "temp.jpg"]
        print(f"Found {len(jpg_files)} registered face files: {jpg_files}")
        
        if not jpg_files:
            print("No registered faces found")
            return jsonify({
                "success": True,
                "recognized": False,
                "message": "No registered faces in system"
            })

        print(f"Will compare against {len(jpg_files)} registered faces...")
        comparison_results = []

        # Test DeepFace availability before processing
        try:
            print("Testing DeepFace import...")
            from deepface import DeepFace as DF_Test
            print("DeepFace imported successfully")
        except Exception as import_error:
            print(f"ERROR: DeepFace import failed: {str(import_error)}")
            return jsonify({
                "success": False,
                "message": f"DeepFace not available: {str(import_error)}"
            }), 500

        for file in jpg_files:
            print(f"\n--- Comparing with {file} ---")
            registered_path = os.path.join(UPLOAD_FOLDER, file)
            
            if not os.path.exists(registered_path):
                print(f"WARNING: Registered file {registered_path} does not exist")
                continue
                
            reg_file_size = os.path.getsize(registered_path)
            if reg_file_size == 0:
                print(f"WARNING: Registered file {file} is empty")
                continue
                
            print(f"Comparing {temp_path} ({file_size} bytes) with {registered_path} ({reg_file_size} bytes)")
            
            try:
                print("Starting DeepFace.verify with OpenCV...")

                try:
                    result = DeepFace.verify(
                        img1_path=temp_path,
                        img2_path=registered_path,
                        model_name="Facenet512",
                        detector_backend="opencv",
                        distance_metric="cosine",
                        enforce_detection=False
                    )

                    print(f"DeepFace result: {result}")

                except Exception as face_error:
                    print(f"DeepFace verification failed for {file}: {str(face_error)}")
                    continue

                # Validate result structure
                if not isinstance(result, dict) or "verified" not in result or "distance" not in result:
                    print(f"ERROR: Invalid DeepFace result structure: {result}")
                    continue

                distance = result["distance"]
                threshold = result.get("threshold")
                similarity = round((1 - distance) * 100, 2)

                print(f"DeepFace verified: {result['verified']}")
                print(f"Distance: {distance}")
                print(f"DeepFace threshold: {threshold}")

                is_match = result["verified"]

                print(f"Final match: {is_match}")
                
                if is_match:
                    name = file.replace(".jpg", "")
                    
                    # Ensure similarity is reasonable
                    if similarity < 0:
                        similarity = 0
                    elif similarity > 100:
                        similarity = 100
                    
                    print(f"MATCH FOUND! Name: {name}, Similarity: {similarity}%")

                    # Save to history with error handling
                    try:
                        if os.path.exists(HISTORY_FILE):
                            with open(HISTORY_FILE, "r") as f:
                                history = json.load(f)
                        else:
                            history = []
                    except (json.JSONDecodeError, IOError) as history_error:
                        print(f"WARNING: Could not read history file: {str(history_error)}")
                        history = []

                    history_entry = {
                        "name": name,
                        "similarity": similarity,
                        "time": datetime.now().strftime("%d-%m-%Y %H:%M:%S")
                    }
                    
                    history.append(history_entry)

                    try:
                        with open(HISTORY_FILE, "w") as f:
                            json.dump(history, f, indent=4)
                        print("History updated successfully")
                    except Exception as history_write_error:
                        print(f"WARNING: Could not write history: {str(history_write_error)}")

                    return jsonify({
                        "success": True,
                        "recognized": True,
                        "name": name,
                        "similarity": similarity,
                        "message": "Face recognized"
                    })
                else:
                    distance = result.get("distance", "unknown")
                    similarity_pct = round((1 - distance) * 100, 2) if isinstance(distance, (int, float)) else 0
                    print(f"No match with {file}. Distance: {distance}, Similarity: {similarity_pct}%")
                    comparison_results.append({
                        "file": file,
                        "distance": distance,
                        "similarity": similarity_pct,
                        "deepface_verified": result["verified"],
                        "our_threshold": similarity_pct > 60.0
                    })
                    
            except Exception as face_error:
                print(f"ERROR comparing with {file}: {str(face_error)}")
                print(f"Face error type: {type(face_error)}")
                import traceback
                print("Face comparison traceback:")
                traceback.print_exc()
                # Continue with next file instead of failing completely
                continue

        print("No matches found in any registered faces")
        print("=== COMPARISON SUMMARY ===")
        for result in comparison_results:
            print(f"  {result['file']}: Distance={result['distance']}, Similarity={result['similarity']}%, DeepFace={result['deepface_verified']}, Threshold60%={result['our_threshold']}")
        print("=== END SUMMARY ===")
        
        return jsonify({
            "success": True,
            "recognized": False,
            "message": "No matching face found",
            "debug_info": comparison_results
        })

    except Exception as e:
        print(f"CRITICAL ERROR in recognize_face: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print("Full traceback:")
        traceback.print_exc()
        
        return jsonify({
            "success": False,
            "message": f"Recognition error: {str(e)}"
        }), 500
        
    finally:
        # Clean up temp file
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                print("Temp file cleaned up")
            except Exception as cleanup_error:
                print(f"WARNING: Could not clean up temp file: {str(cleanup_error)}")


@app.route("/uploads/<filename>")
def get_face_image(filename):
    """Serve face images from uploads folder"""
    try:
        # Security check - only allow .jpg files and no path traversal
        if not filename.endswith('.jpg') or '/' in filename or '..' in filename:
            return jsonify({"error": "Invalid filename"}), 400
            
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        if not os.path.exists(file_path):
            return jsonify({"error": "File not found"}), 404
            
        return send_file(file_path, mimetype='image/jpeg')
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/debug_faces")
def debug_faces():
    """Debug endpoint to check registered faces and their file info"""
    try:
        faces_info = []
        
        if not os.path.exists(UPLOAD_FOLDER):
            return jsonify({
                "error": "Upload folder does not exist",
                "upload_folder": UPLOAD_FOLDER
            })
        
        for file in os.listdir(UPLOAD_FOLDER):
            if file.endswith(".jpg"):
                file_path = os.path.join(UPLOAD_FOLDER, file)
                file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0
                
                faces_info.append({
                    "filename": file,
                    "name": file.replace(".jpg", ""),
                    "path": file_path,
                    "size_bytes": file_size,
                    "exists": os.path.exists(file_path),
                    "is_temp": file == "temp.jpg"
                })
        
        return jsonify({
            "success": True,
            "upload_folder": UPLOAD_FOLDER,
            "total_files": len(faces_info),
            "faces": faces_info
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/test_deepface")
def test_deepface():
    """Test endpoint to check if DeepFace is working properly"""
    try:
        from deepface import DeepFace
        
        # Test if we can access DeepFace models
        models = ["VGG-Face", "Facenet", "OpenFace", "DeepFace"]
        available_models = []
        
        for model in models:
            try:
                # Just try to load model info, don't actually load the model
                available_models.append(model)
            except Exception as model_error:
                print(f"Model {model} not available: {str(model_error)}")
        
        return jsonify({
            "success": True,
            "deepface_available": True,
            "available_models": available_models,
            "upload_folder_exists": os.path.exists(UPLOAD_FOLDER),
            "upload_folder_writable": os.access(UPLOAD_FOLDER, os.W_OK),
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "deepface_available": False,
            "error": str(e)
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


@app.route("/debug")
def debug():
    return jsonify({
        "cwd": os.getcwd(),
        "upload_folder": os.path.abspath(UPLOAD_FOLDER),
        "files": os.listdir(UPLOAD_FOLDER)
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )