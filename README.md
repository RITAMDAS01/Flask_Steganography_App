# Steganography Flask App

## Overview
This is a simple web application that allows users to hide (encrypt) a secret message inside an image using steganography and later retrieve (decrypt) the message using a password.

## Features
- Encrypt a message inside an image.
- Decrypt the message using the correct password.
- User-friendly web interface.

## Technologies Used
- Flask (Backend)
- OpenCV (Image Processing)
- HTML, CSS, JavaScript (Frontend)
- JSON (Database for password storage)

## Installation

### Prerequisites
Ensure you have the following installed:
- Python 3.x
- pip (Python package manager)

### Setup
1. Clone this repository:
   ```sh
   git clone https://github.com/yourusername/steganography-flask-app.git
   cd steganography-flask-app
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run the application:
   ```sh
   python app.py
   ```
4. Open your browser and visit:
   ```
   http://127.0.0.1:5000/
   ```

## Usage
### Encryption
1. Upload an image.
2. Enter a secret message.
3. Set a password.
4. Click the "Encrypt" button.
5. Download the encrypted image.

### Decryption
1. Enter the correct password.
2. Click the "Decrypt" button.
3. View the hidden message.

## Project Structure
```
📂 steganography-flask-app
├── 📂 static
│   ├── style.css
│   ├── script.js
├── 📂 templates
│   ├── index.html
├── app.py
├── database.json
├── requirements.txt
├── README.md
```

## License
This project is open-source and available under the [MIT License](LICENSE).

