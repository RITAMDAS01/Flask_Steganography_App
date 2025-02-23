const baseURL = "https://flasksteganographyapp-production.up.railway.app";  // Use this for deployed API

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
fetch(`${baseURL}/encrypt`, { 
    method: "POST", 
    body: formData 
})
.then(response => {
    return response.text(); // Get raw text instead of JSON
})
.then(text => {
    try {
        let data = JSON.parse(text); // Try parsing JSON
        if (data.status === "Success") {
            alert("Image Encrypted! Download: " + data.image);
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Invalid JSON Response:", text);
        alert("Server returned invalid JSON. Check console for details.");
    }
})
.catch(error => console.error("Fetch error:", error));


