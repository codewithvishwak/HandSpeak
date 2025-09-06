// ---------------- Footer Year ----------------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------------- Tutorial Modal Logic ----------------
const tutorialModal = document.getElementById("tutorialModal");
const tutorialLink = document.querySelector('nav a[href="#tutorial"]');
const slider = document.getElementById("slider");
const thumbnails = document.querySelectorAll("#thumbnails .item");
const carousel = document.querySelector(".carousel");

let currentIndex = 0;

// Open modal on page load
window.onload = function () {
  tutorialModal.style.display = "block";
  updateCarousel();
};

// Close modal
function closeTutorial() {
  tutorialModal.style.display = "none";
}

// ---------------- How to Use? Button ----------------
const howToUseBtn = document.querySelector(".how");

// When "How to Use?" is clicked, open the tutorial modal
howToUseBtn.addEventListener("click", function (e) {
  e.preventDefault();
  tutorialModal.style.display = "block";
  updateCarousel();
});

// Close when clicking outside modal content
window.addEventListener("click", function (e) {
  if (e.target === tutorialModal) {
    closeTutorial();
  }
});

// Update carousel
function updateCarousel() {
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Highlight active thumbnail
  thumbnails.forEach((thumb, idx) => {
    thumb.classList.toggle("active", idx === currentIndex);
  });

  // Adjust carousel height to match current image
  const currentImg = slider.querySelectorAll("img")[currentIndex];
  if (currentImg.complete) {
    resizeCarousel(currentImg);
  } else {
    currentImg.onload = () => resizeCarousel(currentImg);
  }
}

function resizeCarousel(img) {
  carousel.style.height = img.height + "px";
}

// Thumbnail click
thumbnails.forEach((thumb, idx) => {
  thumb.addEventListener("click", () => {
    currentIndex = idx;
    updateCarousel();
  });
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (tutorialModal.style.display === "block") {
    if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % thumbnails.length;
      updateCarousel();
    }
    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
      updateCarousel();
    }
  }
});

// ---------------- Camera Logic ----------------
let stream;
let usingBackCamera = false; // default to front camera
let cameraRunning = false;   // ✅ track if camera is running

async function startCamera() {
  const video = document.getElementById("camera");
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Your browser does not support camera access.");
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: usingBackCamera ? "environment" : "user" }
    });
    video.srcObject = stream;
    cameraRunning = true; // ✅ mark camera as running
  } catch (err) {
    console.error("Camera error:", err);
    alert("Unable to access camera: " + err.message);
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    document.getElementById("camera").srcObject = null;
  }
  cameraRunning = false; // ✅ mark as stopped
}

// Switch camera button (front <-> back)
const switchBtn = document.getElementById("switchCamera");
if (switchBtn) {
  switchBtn.addEventListener("click", async () => {
    if (!cameraRunning) {
      alert("⚠️ Please start the camera first using 'Start Translating'.");
      return;
    }

    // ✅ toggle between front & back
    usingBackCamera = !usingBackCamera;

    // restart camera with new facingMode
    stopCamera();
    await startCamera();
  });
}

// ---------------- Galaxy Background Animation ----------------
function initGalaxy() {
  const canvas = document.createElement("canvas");
  canvas.id = "galaxyCanvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "-1"; // behind everything
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    }));
  }
  window.addEventListener("resize", resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "cyan";
    for (let s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      s.x += s.dx;
      s.y += s.dy;

      // Wrap around edges
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height;
      if (s.y > canvas.height) s.y = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// Run galaxy animation once DOM is loaded
document.addEventListener("DOMContentLoaded", initGalaxy);
