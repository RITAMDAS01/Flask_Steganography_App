const baseURL = "https://flasksteganographyapp-production.up.railway.app"; // Deployed API base URL

function encrypt() {
    let image = document.getElementById("imageInput").files[0];
    let message = document.getElementById("messageInput").value;
    let password = document.getElementById("passwordInput").value;

    if (!image || !message || !password) {
        alert("Please fill in all fields and select an image.");
        return;
    }

    let formData = new FormData();
    formData.append("image", image);
    formData.append("message", message);
    formData.append("password", password);

    fetch(`${baseURL}/encrypt`, { 
        method: "POST", 
        body: formData 
    })
    .then(response => response.text()) // Get raw text instead of JSON
    .then(text => {
        try {
            let data = JSON.parse(text); // Try parsing JSON
            if (data.status === "Success") {
                alert("Image Encrypted! Click below to download.");
                document.getElementById("downloadLink").href = `${baseURL}/${data.image}`;
                document.getElementById("downloadLink").style.display = "block";
            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Invalid JSON Response:", text);
            alert("Server returned invalid JSON. Check console for details.");
        }
    })
    .catch(error => console.error("Fetch error:", error));
}

function decrypt() {
    let password = document.getElementById("decryptPassword").value;

    if (!password) {
        alert("Please enter a password to decrypt.");
        return;
    }

    let formData = new FormData();
    formData.append("password", password);

    fetch(`${baseURL}/decrypt`, { method: "POST", body: formData })
    .then(response => response.json())
    .then(data => {
        if (data.status === "Success") {
            document.getElementById("decryptedMessage").innerText = "Decrypted Message: " + data.message;
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => console.error("Error:", error));
}
