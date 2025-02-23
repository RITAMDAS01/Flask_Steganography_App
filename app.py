import os
import json
import cv2
import numpy as np
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)

# Mock Firebase using JSON file storage
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
    msg += "####"  # End delimiter to detect the end of the message
    binary_msg = ''.join(format(ord(c), '08b') for c in msg)  # Convert to binary

    data_idx = 0
    for row in img:
        for pixel in row:
            for i in range(3):  # RGB channels
                if data_idx < len(binary_msg):
                    pixel[i] = (pixel[i] & 0b11111110) | int(binary_msg[data_idx])  # Modify LSB
                    data_idx += 1
                else:
                    return img
    return img

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static', 'favicon.ico', mimetype='image/vnd.microsoft.icon')

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

    # Save image in "static/" to serve it properly
    OUTPUT_PATH = os.path.join("static", "encrypted_image.png")
    cv2.imwrite(OUTPUT_PATH, encrypted_img)

    # Store the message securely using password
    db = load_db()
    db[password] = {"message": msg}
    save_db(db)

    return jsonify({"status": "Success", "image": "static/encrypted_image.png"})

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

@app.route("/download/<filename>")
def download_file(filename):
    return send_from_directory("static", filename)

if __name__ == "__main__":
    print("Registered Routes:")
    for rule in app.url_map.iter_rules():
        print(rule)

    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=True)
