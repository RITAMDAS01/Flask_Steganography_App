  // Use this for deployed API

function encrypt() {
    let image = document.getElementById("imageInput").files[0];
    let message = document.getElementById("messageInput").value;
    let password = document.getElementById("passwordInput").value;
    
    let formData = new FormData();
    formData.append("image", image);
    formData.append("message", message);
    formData.append("password", password);

    fetch(`${baseURL}/encrypt`, { method: "POST", body: formData })
    .then(response => response.json())
    .then(data => {
        if (data.status === "Success") {
            alert("Image Encrypted! Download: " + baseURL + "/" + data.image);
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => console.error("Error:", error));
}

function decrypt() {
    let password = document.getElementById("decryptPassword").value;
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

