function encrypt() {
    let image = document.getElementById("imageInput").files[0];
    let message = document.getElementById("messageInput").value;
    let password = document.getElementById("passwordInput").value;
    
    let formData = new FormData();
    formData.append("image", image);
    formData.append("message", message);
    formData.append("password", password);

    fetch("/encrypt", { method: "POST", body: formData })
    .then(response => response.json())
    .then(data => {
        if (data.status === "Success") {
            alert("Image Encrypted! Download: " + data.image);
        } else {
            alert("Error: " + data.error);
        }
    });
}

function decrypt() {
    let password = document.getElementById("decryptPassword").value;
    let formData = new FormData();
    formData.append("password", password);

    fetch("/decrypt", { method: "POST", body: formData })
    .then(response => response.json())
    .then(data => {
        if (data.status === "Success") {
            document.getElementById("decryptedMessage").innerText = "Decrypted Message: " + data.message;
        } else {
            alert("Error: " + data.error);
        }
    });
}
const baseURL = "https://flasksteganographyapp-production.up.railway.app";
fetch(`${baseURL}/encrypt`, {
    method: "POST",
    body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));

