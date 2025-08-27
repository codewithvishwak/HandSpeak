// Footer Year
document.getElementById("year").textContent = new Date().getFullYear();

// Camera Logic
let stream;
function startCamera() {
  const video = document.getElementById("camera");
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Your browser does not support camera access.");
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => { stream = s; video.srcObject = s; })
    .catch(err => { alert("Camera access denied: " + err); });
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
}

// 🌌 Main Galaxy Background
const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const stars = Array.from({ length: 150 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: Math.random() * 1.5 + 0.5,
  angle: Math.random() * Math.PI * 2,
  speed: Math.random() * 0.002 + 0.001,
  opacity: Math.random() * 0.6 + 0.2
}));

function animateGalaxy() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    star.angle += star.speed;
    star.x += Math.cos(star.angle) * 0.5;
    star.y += Math.sin(star.angle) * 0.5;
    if (star.x < 0) star.x = canvas.width;
    if (star.x > canvas.width) star.x = 0;
    if (star.y < 0) star.y = canvas.height;
    if (star.y > canvas.height) star.y = 0;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 255, 242, ${star.opacity})`;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 8;
    ctx.fill();
  });
  requestAnimationFrame(animateGalaxy);
}
animateGalaxy();

// Tutorial Carousel Logic
const slider = document.getElementById("slider");
const thumbnails = document.querySelectorAll("#thumbnails .item");

thumbnails.forEach((thumb, idx) => {
  thumb.addEventListener("click", () => {
    slider.style.transform = `translateX(-${idx * 100}%)`;
    thumbnails.forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");
  });
});

// Optional: Keyboard Navigation
document.addEventListener("keydown", (e) => {
  let index = Array.from(thumbnails).findIndex(t => t.classList.contains("active"));
  if(e.key === "ArrowRight") index++;
  if(e.key === "ArrowLeft") index--;
  if(index < 0) index = thumbnails.length - 1;
  if(index >= thumbnails.length) index = 0;
  slider.style.transform = `translateX(-${index * 100}%)`;
  thumbnails.forEach(t => t.classList.remove("active"));
  thumbnails[index].classList.add("active");
});
