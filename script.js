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
    .then(s => { stream = s; video.srcObject = stream; })
    .catch(err => { alert("Camera access denied."); console.error(err); });
}
function stopCamera() {
  const video = document.getElementById("camera");
  if (stream) { stream.getTracks().forEach(track => track.stop()); video.srcObject = null; }
}

// 🌌 Main Galaxy Background
const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas(); window.addEventListener("resize", resizeCanvas);

const stars = Array.from({ length: 150 }, () => ({
  x: Math.random() * canvas.width, y: Math.random() * canvas.height,
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
    ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8; ctx.fill();
  });
  requestAnimationFrame(animateGalaxy);
}
animateGalaxy();

// 🌌 About Section Galaxy
const aboutCanvas = document.getElementById("aboutCanvas");
const aboutCtx = aboutCanvas.getContext("2d");
function resizeAboutCanvas() {
  aboutCanvas.width = document.querySelector(".about").offsetWidth;
  aboutCanvas.height = document.querySelector(".about").offsetHeight;
}
resizeAboutCanvas(); window.addEventListener("resize", resizeAboutCanvas);

const aboutStars = Array.from({ length: 120 }, () => ({
  x: Math.random() * aboutCanvas.width, y: Math.random() * aboutCanvas.height,
  radius: Math.random() * 1.5 + 0.5,
  angle: Math.random() * Math.PI * 2,
  speed: Math.random() * 0.002 + 0.001,
  opacity: Math.random() * 0.6 + 0.2
}));
function animateAboutGalaxy() {
  aboutCtx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
  aboutStars.forEach(star => {
    star.angle += star.speed;
    star.x += Math.cos(star.angle) * 0.5;
    star.y += Math.sin(star.angle) * 0.5;
    if (star.x < 0) star.x = aboutCanvas.width;
    if (star.x > aboutCanvas.width) star.x = 0;
    if (star.y < 0) star.y = aboutCanvas.height;
    if (star.y > aboutCanvas.height) star.y = 0;
    aboutCtx.beginPath();
    aboutCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    aboutCtx.fillStyle = `rgba(0, 255, 242, ${star.opacity})`;
    aboutCtx.shadowColor = aboutCtx.fillStyle; aboutCtx.shadowBlur = 8; aboutCtx.fill();
  });
  requestAnimationFrame(animateAboutGalaxy);
}
animateAboutGalaxy();
