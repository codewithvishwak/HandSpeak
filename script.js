// ✅ Updated: Footer Year
document.getElementById("year").textContent = new Date().getFullYear();

// ✅ Updated: Display User Name in Navbar
function displayUserGreeting() {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (user && user.name) {
    const userGreeting = document.getElementById("userGreeting");
    userGreeting.textContent = `👤 ${user.name}`;
    userGreeting.style.display = "inline-block";
  }
}

// ✅ Updated: Check authentication on page load
function checkAuth() {
  const token = localStorage.getItem("token");
  const isAuthPage = window.location.pathname.includes("index.html");
  
  if (!token && isAuthPage) {
    alert("⚠️ Please login first");
    window.location.href = "login.html";
  } else {
    // Display user name in navbar
    displayUserGreeting();
  }
}

// Run auth check on page load
document.addEventListener("DOMContentLoaded", checkAuth);

// ✅ Updated: Logout function
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isFirstLogin");
  alert("✅ Logged out successfully");
  window.location.href = "login.html";
}

// ✅ Updated: Get auth token
function getAuthToken() {
  return localStorage.getItem("token");
}

// ✅ MediaPipe Hands Detection Variables
let hands = null;
let camera = null;
let videoElement = null;
let canvasElement = null;
let canvasCtx = null;
let isDetecting = false;
let lastGesture = null;
let gestureCount = 0;
const GESTURE_THRESHOLD = 3;
let lastSpokenGesture = null;
let currentAccuracy = 0;

// ✅ Start Camera Function
async function startCamera() {
  try {
    console.log("📹 Starting camera...");

    videoElement = document.getElementById("camera");
    
    if (!videoElement) {
      console.error("❌ Camera element not found");
      alert("❌ Error: Camera element not found");
      return;
    }

    // ✅ Request camera permission
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user"
      },
      audio: false
    });

    videoElement.srcObject = stream;
    isDetecting = true;

    console.log("✅ Camera started successfully");

    // ✅ Initialize hand detection
    if (!hands) {
      await initializeHandDetection();
    }

    alert("✅ Camera started! Begin making hand gestures...");
  } catch (error) {
    console.error("❌ Camera Error:", error);
    alert("❌ Camera Error: " + error.message);
    isDetecting = false;
  }
}

// ✅ Stop Camera Function
function stopCamera() {
  try {
    console.log("🛑 Stopping camera...");

    // ✅ Stop video stream
    if (videoElement && videoElement.srcObject) {
      videoElement.srcObject.getTracks().forEach(track => {
        track.stop();
      });
      videoElement.srcObject = null;
    }

    // ✅ Stop camera instance
    if (camera) {
      camera.stop();
      camera = null;
    }

    // ✅ Close hands detector
    if (hands) {
      hands.close();
      hands = null;
    }

    isDetecting = false;
    lastSpokenGesture = null;
    currentAccuracy = 0;

    // ✅ Stop speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    // ✅ Clear overlay canvas
    const overlayCanvas = document.getElementById("handOverlay");
    if (overlayCanvas) {
      const ctx = overlayCanvas.getContext("2d");
      ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }

    // ✅ Reset display
    document.getElementById("gesture").textContent = "🖐🏻 Gesture";
    document.getElementById("translatedText").textContent = "Hello";
    document.getElementById("speechOutput").textContent = "🔊 \"Hello\"";

    console.log("✅ Camera stopped");
    alert("✅ Camera and detection stopped!");
  } catch (error) {
    console.error("❌ Error stopping camera:", error);
  }
}

// ✅ Initialize Hand Detection
async function initializeHandDetection() {
  try {
    console.log("🔧 Initializing hand detection...");

    // ✅ Check if MediaPipe Hands is loaded
    if (typeof Hands === "undefined") {
      console.error("❌ MediaPipe Hands not loaded");
      alert("❌ Error: MediaPipe Hands library failed to load");
      return;
    }

    // ✅ Initialize Hands
    hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
      }
    });

    hands.setOptions({
      selfieMode: true,
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults(onHandsResults);

    console.log("✅ Hands initialized");

    // ✅ Initialize Camera Utils
    if (typeof Camera === "undefined") {
      console.error("❌ MediaPipe Camera Utils not loaded");
      alert("❌ Error: Camera utility library failed to load");
      return;
    }

    videoElement = document.getElementById("camera");

    camera = new Camera(videoElement, {
      onFrame: async () => {
        if (isDetecting && hands && videoElement) {
          await hands.send({ image: videoElement });
        }
      },
      width: 1280,
      height: 720
    });

    await camera.start();
    console.log("✅ Camera initialized and started");
  } catch (error) {
    console.error("❌ Error initializing hand detection:", error);
    alert("❌ Error: " + error.message);
  }
}

// ✅ Handle Hand Detection Results - FLIPPED BOX
function onHandsResults(results) {
  try {
    videoElement = document.getElementById("camera");

    if (!videoElement) return;

    // ✅ Create or get overlay canvas
    let overlayCanvas = document.getElementById("handOverlay");
    if (!overlayCanvas) {
      overlayCanvas = document.createElement("canvas");
      overlayCanvas.id = "handOverlay";
      overlayCanvas.style.position = "absolute";
      overlayCanvas.style.top = "0";
      overlayCanvas.style.left = "0";
      overlayCanvas.style.zIndex = "10";
      overlayCanvas.style.cursor = "pointer";
      
      const parentElement = videoElement.parentElement;
      if (parentElement) {
        parentElement.style.position = "relative";
        parentElement.style.overflow = "hidden";
        parentElement.appendChild(overlayCanvas);
      }
    }

    // ✅ Match canvas to video element display size and position
    overlayCanvas.width = videoElement.offsetWidth;
    overlayCanvas.height = videoElement.offsetHeight;
    
    // ✅ Position canvas absolutely over video
    overlayCanvas.style.width = videoElement.offsetWidth + "px";
    overlayCanvas.style.height = videoElement.offsetHeight + "px";

    canvasCtx = overlayCanvas.getContext("2d");

    // ✅ Clear canvas
    canvasCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const handedness = results.multiHandedness[0];
      
      // ✅ Get confidence score
      const confidence = handedness ? (handedness.score * 100).toFixed(1) : 0;
      currentAccuracy = confidence;

      // ✅ Calculate bounding box from normalized coordinates (0-1)
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

      for (let landmark of landmarks) {
        minX = Math.min(minX, landmark.x);
        maxX = Math.max(maxX, landmark.x);
        minY = Math.min(minY, landmark.y);
        maxY = Math.max(maxY, landmark.y);
      }

      // ✅ Add padding (in normalized coordinates)
      const padding = 0.05;
      const normalizedX = Math.max(0, minX - padding);
      const normalizedY = Math.max(0, minY - padding);
      const normalizedWidth = Math.min(1, maxX + padding) - normalizedX;
      const normalizedHeight = Math.min(1, maxY + padding) - normalizedY;

      // ✅ FLIP HORIZONTALLY - Mirror the X coordinate
      const flippedNormalizedX = 1 - (normalizedX + normalizedWidth);

      // ✅ Convert normalized coordinates to canvas pixel coordinates
      const boxX = flippedNormalizedX * overlayCanvas.width;
      const boxY = normalizedY * overlayCanvas.height;
      const boxWidth = normalizedWidth * overlayCanvas.width;
      const boxHeight = normalizedHeight * overlayCanvas.height;

      console.log(`Flipped Normalized: X=${flippedNormalizedX.toFixed(3)}, Y=${normalizedY.toFixed(3)}`);
      console.log(`Pixels: X=${boxX.toFixed(0)}, Y=${boxY.toFixed(0)}, W=${boxWidth.toFixed(0)}, H=${boxHeight.toFixed(0)}`);

      // ✅ Draw main bounding box
      canvasCtx.strokeStyle = "#00c3ff";
      canvasCtx.lineWidth = 3;
      canvasCtx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      // ✅ Draw corner accents for better visibility
      const cornerSize = 20;
      canvasCtx.strokeStyle = "#00FFF2";
      canvasCtx.lineWidth = 2;

      // Top-left corner
      canvasCtx.beginPath();
      canvasCtx.moveTo(boxX, boxY + cornerSize);
      canvasCtx.lineTo(boxX, boxY);
      canvasCtx.lineTo(boxX + cornerSize, boxY);
      canvasCtx.stroke();

      // Top-right corner
      canvasCtx.beginPath();
      canvasCtx.moveTo(boxX + boxWidth - cornerSize, boxY);
      canvasCtx.lineTo(boxX + boxWidth, boxY);
      canvasCtx.lineTo(boxX + boxWidth, boxY + cornerSize);
      canvasCtx.stroke();

      // Bottom-left corner
      canvasCtx.beginPath();
      canvasCtx.moveTo(boxX, boxY + boxHeight - cornerSize);
      canvasCtx.lineTo(boxX, boxY + boxHeight);
      canvasCtx.lineTo(boxX + cornerSize, boxY + boxHeight);
      canvasCtx.stroke();

      // Bottom-right corner
      canvasCtx.beginPath();
      canvasCtx.moveTo(boxX + boxWidth - cornerSize, boxY + boxHeight);
      canvasCtx.lineTo(boxX + boxWidth, boxY + boxHeight);
      canvasCtx.lineTo(boxX + boxWidth, boxY + boxHeight - cornerSize);
      canvasCtx.stroke();

      // ✅ Draw accuracy text on the box
      canvasCtx.fillStyle = "#00FFF2";
      canvasCtx.font = "bold 16px Arial";
      canvasCtx.textAlign = "center";
      canvasCtx.fillText(`Accuracy: ${confidence}%`, boxX + boxWidth / 2, boxY - 10);

      // ✅ Recognize gesture
      const gesture = recognizeGesture(landmarks);
      if (gesture) {
        updateGestureDisplay(gesture, confidence);
      }
    } else {
      // ✅ No hands detected
      updateGestureDisplay("None", 0);
    }
  } catch (error) {
    console.error("❌ Error in onHandsResults:", error);
  }
}

// ✅ Recognize Gesture from Landmarks
function recognizeGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return null;

  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  const thumbPIP = landmarks[3];
  const indexPIP = landmarks[6];
  const middlePIP = landmarks[10];
  const ringPIP = landmarks[14];
  const pinkyPIP = landmarks[18];

  // ✅ Determine if fingers are extended
  const thumbUp = thumbTip.y < thumbPIP.y;
  const indexUp = indexTip.y < indexPIP.y;
  const middleUp = middleTip.y < middlePIP.y;
  const ringUp = ringTip.y < ringPIP.y;
  const pinkyUp = pinkyTip.y < pinkyPIP.y;

  // ✅ Calculate finger distances
  const thumbIndexDistance = Math.sqrt(
    Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2)
  );

  // ✅ Gesture Recognition Logic
  if (thumbUp && indexUp && middleUp && ringUp && pinkyUp) {
    return "Thank you";
  }
  
  if (thumbUp && indexUp && !middleUp && !ringUp && pinkyUp) {
    return "I love you";
  }
  
  if (!thumbUp && indexUp && middleUp && !ringUp && !pinkyUp) {
    return "Peace";
  }
  
  if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
    return "Yes";
  }
  
  if (!thumbUp && !indexUp && !middleUp && !ringUp && pinkyUp) {
    return "Call me";
  }
  
  if (!thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp && thumbIndexDistance < 0.15) {
    return "Wait";
  }
  
  if (thumbUp && indexUp && middleUp && !ringUp && !pinkyUp) {
    return "OK";
  }
  
  if (!thumbUp && indexUp && middleUp && ringUp && pinkyUp) {
    return "Help";
  }
  
  if (thumbUp && !indexUp && middleUp && !ringUp && !pinkyUp) {
    return "Good luck";
  }
  
  if (thumbUp && indexUp && !middleUp && ringUp && !pinkyUp) {
    return "Spock sign";
  }

  // ✅ Medical/Communication Signs
  if (!thumbUp && indexUp && middleUp && !ringUp && pinkyUp) {
    return "Emergency";
  }

  if (thumbUp && !indexUp && !middleUp && ringUp && !pinkyUp) {
    return "Water";
  }

  if (!thumbUp && indexUp && !middleUp && ringUp && !pinkyUp) {
    return "Food";
  }

  if (thumbUp && !indexUp && middleUp && ringUp && !pinkyUp) {
    return "Medicine";
  }

  if (!thumbUp && !indexUp && middleUp && ringUp && pinkyUp) {
    return "Hospital";
  }

  if (thumbUp && indexUp && middleUp && !ringUp && pinkyUp) {
    return "Sick";
  }

  if (!thumbUp && indexUp && !middleUp && ringUp && pinkyUp) {
    return "Pain";
  }

  if (thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp) {
    return "Phone";
  }

  return null;
}

// ✅ Update Gesture Display with Accuracy
function updateGestureDisplay(gesture, accuracy = 0) {
  const gestureEl = document.getElementById("gesture");
  const translatedEl = document.getElementById("translatedText");
  const speechEl = document.getElementById("speechOutput");

  if (gesture !== "None" && gesture === lastGesture) {
    gestureCount++;
  } else {
    lastGesture = gesture;
    gestureCount = 1;
  }

  // ✅ Update display after threshold
  if (gestureCount >= GESTURE_THRESHOLD || gesture === "None") {
    if (gestureEl) {
      gestureEl.textContent = gesture ? `${gesture}` : "🖐🏻 Gesture";
    }

    if (translatedEl) {
      const accuracyText = accuracy > 0 ? ` (${accuracy}%)` : "";
      translatedEl.textContent = gesture ? `${gesture}${accuracyText}` : "Hello";
    }

    if (speechEl) {
      speechEl.textContent = gesture ? `🔊 "${gesture}"` : "🔊 \"Hello\"";
    }

    // ✅ Speak gesture only once per unique gesture
    if (gesture && gesture !== "None" && gesture !== lastSpokenGesture) {
      console.log("🔊 Speaking:", gesture);
      speakText(gesture);
      lastSpokenGesture = gesture;
    }
  }
}

// ✅ Text-to-Speech Function
function speakText(text) {
  if (!("speechSynthesis" in window)) {
    console.error("❌ Speech synthesis not supported");
    return;
  }

  try {
    // ✅ Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // ✅ Wait a moment before speaking
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      console.log("📢 TTS Engine speaking:", text);
      window.speechSynthesis.speak(utterance);
    }, 100);
  } catch (error) {
    console.error("❌ Speech synthesis error:", error);
  }
}

// ✅ Switch Camera Function
const switchBtn = document.getElementById("switchCamera");
if (switchBtn) {
  let usingBackCamera = false;
  
  switchBtn.addEventListener("click", async () => {
    if (!isDetecting) {
      alert("⚠️ Please start the camera first");
      return;
    }

    usingBackCamera = !usingBackCamera;
    stopCamera();
    
    // ✅ Update camera facing mode
    setTimeout(() => {
      startCamera();
    }, 500);
  });
}

// ✅ Galaxy Background Animation
function initBlueGalaxy() {
  const canvas = document.getElementById("backgroundCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let stars = [];
  const STAR_COUNT = 150;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateStars();
  }

  function generateStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5, // smaller radius for sharp stars
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.4,
      pulseSpeed: Math.random() * 0.015 + 0.005
    }));
  }

  function drawBackground() {
    // Deep black space
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawStars() {
    for (let s of stars) {
      // Pulse glow
      s.alpha += s.pulseSpeed * (Math.random() < 0.5 ? -1 : 1);
      s.alpha = Math.max(0.4, Math.min(1, s.alpha));

      // Create a glowing star effect
      const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
      gradient.addColorStop(0, `rgba(0, 255, 242, ${s.alpha})`);      // Full opacity with #00fff2
      gradient.addColorStop(0.3, `rgba(0, 255, 242, ${s.alpha * 0.8})`);  // 80% opacity
      gradient.addColorStop(1, "transparent"); 

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
      ctx.fill();

      // Small bright white dot at center
      ctx.beginPath();
      ctx.fillStyle = `rgba(200, 240, 255, ${s.alpha})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // Movement
      s.x += s.dx;
      s.y += s.dy;

      // Edge bounce
      if (s.x < 0 || s.x > canvas.width) s.dx *= -1;
      if (s.y < 0 || s.y > canvas.height) s.dy *= -1;
    }
  }

  function animate() {
    drawBackground();
    drawStars();
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  resize();
  animate();
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("✨ Blue Galaxy Starfield initialized");
  initBlueGalaxy();
})