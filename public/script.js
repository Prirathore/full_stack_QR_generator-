document.getElementById('qrForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const url = document.getElementById('url').value;
    const imageName = document.getElementById('imageName').value;
    const qrResult = document.getElementById('qrResult');
    const qrImage = document.getElementById('qrImage');
    const downloadLink = document.getElementById('downloadLink');
  
    // Send the request to the backend API
    fetch('/generate-qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, imageName }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.filePath) {
          const imagePath = data.filePath;
          qrImage.src = imagePath; // Set the image source to the QR code
          qrResult.style.display = 'block'; // Show the QR code
          downloadLink.href = imagePath; // Set the download link
          downloadLink.download = `${imageName}.png`; // Set the download name
        } else {
          alert('Error generating QR code');
        }
      })
      .catch(err => {
        alert('Error: ' + err);
      });
  });
  