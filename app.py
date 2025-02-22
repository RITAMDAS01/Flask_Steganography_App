from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import json
import os

app = Flask(__name__)

# Mock Firebase database (use a JSON file for storage since firebase_admin isn't available)
DB_FILE = "database.json"

def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as f:
            content = f.read().strip()
            if not content:
                return {}
            return json.loads(content)
    return {}

def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f)

def encode_message(img, msg):
    d = {chr(i): i for i in range(255)}
    m, n, z = 0, 0, 0
    for char in msg:
        if n >= img.shape[0] or m >= img.shape[1]:
            return None  # Message too long
        img[n, m, z] = d[char]
        n += 1
        m = (m + 1) % img.shape[1]
        if m == 0:
            n += 1
        z = (z + 1) % 3
    return img

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/encrypt", methods=["POST"])
def encrypt():
    file = request.files.get("image")
    msg = request.form.get("message")
    password = request.form.get("password")
    
    if not file or not msg or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    img_array = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    
    if img is None:
        return jsonify({"error": "Invalid image file"}), 400
    
    encrypted_img = encode_message(img, msg)
    if encrypted_img is None:
        return jsonify({"error": "Message too long for this image!"}), 400
    
    db = load_db()
    db[password] = {"message": msg}
    save_db(db)
    
    cv2.imwrite("encrypted_image.png", encrypted_img)
    return jsonify({"status": "Success", "image": "encrypted_image.png"})

@app.route("/decrypt", methods=["POST"])
def decrypt():
    password = request.form.get("password")
    
    if not password:
        return jsonify({"error": "Missing password"}), 400
    
    db = load_db()
    
    if password in db:
        return jsonify({"status": "Success", "message": db[password]["message"]})
    else:
        return jsonify({"error": "Invalid passcode"}), 401

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
