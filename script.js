document.getElementById("year").textContent = new Date().getFullYear();

let stream;

function startCamera() {
  const video = document.getElementById("camera");
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => {
      stream = s;
      video.srcObject = stream;
    })
    .catch(err => {
      alert("Camera access denied or unavailable.");
      console.error("Camera error:", err);
    });
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    document.getElementById("camera").srcObject = null;
  }
}
