document.getElementById('upload-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent the default form submission

    const imageInput = document.getElementById('imageInput');
    
    if (imageInput.files.length > 0) {
        const formData = new FormData();
        formData.append('image', imageInput.files[0]);

        // Replace with your server URL and endpoint
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (response.status === 200) {
            // Assuming the server returns the base64 encoded image data
            document.getElementById('uploadedImage').src = 'data:image/jpeg;base64,' + data.base64;
            document.getElementById('extractedText').innerText = data.extractedText;
        } else {
            alert('Error uploading image');
        }
    }
});
