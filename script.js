// Footer Year
document.getElementById("year").textContent = new Date().getFullYear();

// Camera Logic
let stream;

function startCamera() {
  const video = document.getElementById("camera");
  const status = document.getElementById("cameraStatus");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Your browser does not support camera access.");
    status.textContent = "🔴 Camera Unsupported";
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => {
      stream = s;
      video.srcObject = stream;
      status.textContent = "🟢 Camera On";
    })
    .catch(err => {
      alert("Camera access denied or unavailable.");
      console.error("Camera error:", err);
      status.textContent = "🔴 Camera Off";
    });
}

function stopCamera() {
  const video = document.getElementById("camera");
  const status = document.getElementById("cameraStatus");

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    status.textContent = "🔴 Camera Off";
  }
}

// Milky Way Galaxy Background
const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const stars = [];
const starCount = 150;

for (let i = 0; i < starCount; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 0.5,
    angle: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.002 + 0.001,
    opacity: Math.random() * 0.6 + 0.2
  });
}

function animateGalaxy() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    // Spiral motion
    star.angle += star.speed;
    star.x += Math.cos(star.angle) * 0.5;
    star.y += Math.sin(star.angle) * 0.5;

    // Wrap around edges
    if (star.x < 0) star.x = canvas.width;
    if (star.x > canvas.width) star.x = 0;
    if (star.y < 0) star.y = canvas.height;
    if (star.y > canvas.height) star.y = 0;

    // Draw star
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 255, 242, ${star.opacity})`;
    ctx.shadowColor = `rgba(0, 255, 242, ${star.opacity})`;
    ctx.shadowBlur = 8;
    ctx.fill();
  });

  requestAnimationFrame(animateGalaxy);
}
animateGalaxy();
