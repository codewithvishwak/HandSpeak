/* OAuth Configuration */
const OAUTH_CONFIG = {
  GOOGLE_CLIENT_ID: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  GITHUB_CLIENT_ID: "YOUR_GITHUB_CLIENT_ID",
  GITHUB_REDIRECT_URI: "http://localhost:3000/auth/github/callback",
  FACEBOOK_APP_ID: "YOUR_FACEBOOK_APP_ID",
  LINKEDIN_CLIENT_ID: "YOUR_LINKEDIN_CLIENT_ID",
  LINKEDIN_REDIRECT_URI: "http://localhost:3000/auth/linkedin/callback"
};

/* ============ API Base ============ */
const API_BASE = "http://localhost:5000";

/* ============ GOOGLE OAuth ============ */
function handleCredentialResponse(response) {
  const token = response.credential;
  
  try {
    // Decode JWT (Google credential)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const userData = JSON.parse(jsonPayload);
    
    console.log("✅ Google Sign-In Success:", userData);
    
    // Send to backend
    oauthLogin({
      provider: 'google',
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      id: userData.sub
    });
  } catch (error) {
    console.error("❌ Google Sign-In Error:", error);
    alert("❌ Google Sign-In failed: " + error.message);
  }
}

function loginWithGoogle() {
  try {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      google.accounts.id.initialize({
        client_id: OAUTH_CONFIG.GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });
      
      google.accounts.id.renderButton(
        document.createElement('div'),
        { theme: "outline", size: "large" }
      );
      
      google.accounts.id.prompt();
    } else {
      console.error("❌ Google SDK not loaded");
      alert("❌ Google OAuth not available. Please check your configuration.");
    }
  } catch (error) {
    console.error("❌ Google Login Error:", error);
    alert("❌ Google login failed: " + error.message);
  }
}

/* ============ Facebook OAuth ============ */
function loginWithFacebook() {
  try {
    if (typeof FB !== 'undefined') {
      FB.init({
        appId: OAUTH_CONFIG.FACEBOOK_APP_ID,
        xfbml: true,
        version: 'v18.0'
      });

      FB.login(function(response) {
        if (response.authResponse) {
          FB.api('/me', { fields: 'id,name,email,picture' }, function(user) {
            console.log("✅ Facebook Sign-In Success:", user);
            
            oauthLogin({
              provider: 'facebook',
              email: user.email || user.name + '@facebook.com',
              name: user.name,
              picture: user.picture?.data?.url || '',
              id: user.id
            });
          });
        } else {
          alert("❌ Facebook login cancelled");
        }
      }, { scope: 'public_profile,email' });
    } else {
      console.error("❌ Facebook SDK not loaded");
      alert("❌ Facebook OAuth not available. Please check your configuration.");
    }
  } catch (error) {
    console.error("❌ Facebook Login Error:", error);
    alert("❌ Facebook login failed: " + error.message);
  }
}

/* ============ GitHub OAuth ============ */
function loginWithGitHub() {
  try {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${OAUTH_CONFIG.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(OAUTH_CONFIG.GITHUB_REDIRECT_URI)}&scope=user:email&state=github`;
    
    console.log("📍 Redirecting to GitHub OAuth:", authUrl);
    window.location.href = authUrl;
  } catch (error) {
    console.error("❌ GitHub Login Error:", error);
    alert("❌ GitHub login failed: " + error.message);
  }
}

/* ============ LinkedIn OAuth ============ */
function loginWithLinkedIn() {
  try {
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${OAUTH_CONFIG.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(OAUTH_CONFIG.LINKEDIN_REDIRECT_URI)}&scope=openid%20profile%20email&state=linkedin`;
    
    console.log("📍 Redirecting to LinkedIn OAuth:", authUrl);
    window.location.href = authUrl;
  } catch (error) {
    console.error("❌ LinkedIn Login Error:", error);
    alert("❌ LinkedIn login failed: " + error.message);
  }
}

/* ============ Send OAuth Data to Backend ============ */
function oauthLogin(userData) {
  console.log("📤 Sending OAuth data to backend:", userData);
  
  fetch(`${API_BASE}/auth/oauth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  .then(res => res.json())
  .then(data => {
    console.log("✅ OAuth Response:", data);
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isFirstLogin', 'true'); // ✅ Mark as new user for OAuth
      alert(`✅ Welcome, ${data.user.name}!`);
      
      // Redirect to home
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      alert('❌ ' + (data.message || 'OAuth login failed'));
    }
  })
  .catch(err => {
    console.error('❌ OAuth login error:', err);
    alert('❌ OAuth login failed: ' + err.message);
  });
}

/* ============ Handle OAuth Callbacks ============ */
window.addEventListener('load', () => {
  // Handle GitHub callback
  const githubCode = new URLSearchParams(window.location.search).get('code');
  const githubState = new URLSearchParams(window.location.search).get('state');
  
  if (githubCode && githubState === 'github') {
    console.log("🔐 Processing GitHub callback...");
    fetch(`${API_BASE}/auth/github/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: githubCode })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert(`✅ Welcome, ${data.user.name}!`);
        window.location.href = 'index.html';
      } else {
        alert('❌ GitHub login failed: ' + (data.message || 'Unknown error'));
        window.location.href = 'login.html';
      }
    })
    .catch(err => {
      console.error('❌ GitHub callback error:', err);
      alert('❌ GitHub login failed');
      window.location.href = 'login.html';
    });
  }

  // Handle LinkedIn callback
  const linkedinCode = new URLSearchParams(window.location.search).get('code');
  const linkedinState = new URLSearchParams(window.location.search).get('state');
  
  if (linkedinCode && linkedinState === 'linkedin') {
    console.log("🔐 Processing LinkedIn callback...");
    fetch(`${API_BASE}/auth/linkedin/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: linkedinCode })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert(`✅ Welcome, ${data.user.name}!`);
        window.location.href = 'index.html';
      } else {
        alert('❌ LinkedIn login failed: ' + (data.message || 'Unknown error'));
        window.location.href = 'login.html';
      }
    })
    .catch(err => {
      console.error('❌ LinkedIn callback error:', err);
      alert('❌ LinkedIn login failed');
      window.location.href = 'login.html';
    });
  }
});

/* ============ Existing UI Logic ============ */
const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const forgotPasswordLink = document.getElementById("forgotPassword");
const backToLoginLink = document.getElementById("backToLogin");

if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    container.classList.add("active");
    container.classList.remove("show-reset");
  });
}

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
    container.classList.remove("show-reset");
  });
}

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("show-reset");
  });
}

if (backToLoginLink) {
  backToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.remove("show-reset");
  });
}

/* ============ Sign Up ============ */
document.querySelector(".sign-up form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const name = e.target.querySelector('input[placeholder="Name"]').value.trim();
  const email = e.target.querySelector('input[placeholder="Email"]').value.trim();
  const password = e.target.querySelector('input[placeholder="Password"]').value;

  if (!name || !email || !password) {
    alert("❌ All fields are required");
    return;
  }

  if (password.length < 6) {
    alert("❌ Password must be at least 6 characters");
    return;
  }

  try {
    let res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    let data = await res.json();
    alert(data.message);
    
    if (res.ok) {
      e.target.reset();
      container.classList.remove("active");
    }
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    alert("❌ Error: Could not connect to server.");
  }
});

/* ============ Sign In ============ */
document.querySelector(".sign-in form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = e.target.querySelector('input[placeholder="Email"]').value.trim();
  const password = e.target.querySelector('input[placeholder="Password"]').value;

  if (!email || !password) {
    alert("❌ Email and password are required");
    return;
  }

  try {
    let res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let data = await res.json();
    
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isFirstLogin", "false"); // ✅ Mark as returning user
      alert(`✅ Welcome back, ${data.user.name}!`);
      e.target.reset();
      window.location.href = "index.html";
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error: Could not connect to server.");
  }
});

/* ============ Reset Password with OTP ============ */
async function handleResetSubmit(e) {
  e.preventDefault();
  
  const resetForm = document.querySelector(".reset-password form");
  const email = resetForm.querySelector('input[placeholder="Email"]').value.trim();

  if (!email) {
    alert("❌ Please enter your email");
    return;
  }

  try {
    // Step 1: Request OTP
    let res = await fetch(`${API_BASE}/reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    let data = await res.json();
    alert(data.message);
    
    if (res.ok) {
      // Step 2: Show OTP verification form
      showOTPVerification(email);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error: " + err.message);
  }
}

function showOTPVerification(email) {
  const resetForm = document.querySelector(".reset-password form");
  resetForm.innerHTML = `
    <h1>Verify OTP</h1>
    <span>Enter the 6-digit code sent to your email</span>
    <input type="text" id="otp" placeholder="000000" maxlength="6" pattern="[0-9]{6}" required />
    <input type="password" id="newPassword" placeholder="New Password" required />
    <input type="password" id="confirmPassword" placeholder="Confirm Password" required />
    <button type="submit">Reset Password</button>
    <a href="#" id="backToResetEmail" style="display: block; margin-top: 1rem;">← Back to Email</a>
  `;

  // ✅ Back button to return to email input
  const backBtn = document.getElementById("backToResetEmail");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("🔙 Back button clicked");
      
      // Reset form to email input
      resetForm.innerHTML = `
        <h1>Reset Password</h1>
        <span>Enter your email to reset password</span>
        <input type="email" placeholder="Email" />
        <button type="submit">Send OTP</button>
        <a href="#" id="backToLogin">Back to Login</a>
      `;
      
      // ✅ Re-attach the main form submit handler
      document.querySelector(".reset-password form")?.addEventListener("submit", handleResetSubmit);
      
      // ✅ Re-attach back to login handler
      const backToLoginBtn = document.getElementById("backToLogin");
      if (backToLoginBtn) {
        backToLoginBtn.addEventListener("click", (e) => {
          e.preventDefault();
          container.classList.remove("show-reset");
        });
      }
    });
  }

  // ✅ Handle OTP verification form submit
  resetForm.onsubmit = async (e) => {
    e.preventDefault();
    const otp = document.getElementById("otp").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      alert("❌ Passwords don't match");
      return;
    }

    if (otp.length !== 6) {
      alert("❌ OTP must be 6 digits");
      return;
    }

    try {
      let res = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      let data = await res.json();
      alert(data.message);
      
      if (res.ok) {
        container.classList.remove("show-reset");
        
        // ✅ IMPORTANT: Reset form to email input (fixes the "send only once" issue)
        resetForm.innerHTML = `
          <h1>Reset Password</h1>
          <span>Enter your email to reset password</span>
          <input type="email" placeholder="Email" />
          <button type="submit">Send OTP</button>
          <a href="#" id="backToLogin">Back to Login</a>
        `;
        
        // ✅ Re-attach handlers so it can be used again
        document.querySelector(".reset-password form")?.addEventListener("submit", handleResetSubmit);
        
        const backToLoginBtn = document.getElementById("backToLogin");
        if (backToLoginBtn) {
          backToLoginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            container.classList.remove("show-reset");
          });
        }
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    }
  };
}

// ✅ Attach initial handler
document.querySelector(".reset-password form")?.addEventListener("submit", handleResetSubmit);

/* ============ Background Animation ============ */
const canvas = document.getElementById("techCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let nodes = [];
const numNodes = 80;

for (let i = 0; i < numNodes; i++) {
  nodes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 1,
    vy: (Math.random() - 0.5) * 1,
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numNodes; i++) {
    for (let j = i + 1; j < numNodes; j++) {
      let dx = nodes[i].x - nodes[j].x;
      let dy = nodes[i].y - nodes[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.strokeStyle = `rgba(0, 195, 255, ${1 - dist / 150})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  for (let i = 0; i < numNodes; i++) {
    ctx.beginPath();
    ctx.arc(nodes[i].x, nodes[i].y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#00c3ff";
    ctx.fill();

    nodes[i].x += nodes[i].vx;
    nodes[i].y += nodes[i].vy;

    if (nodes[i].x < 0 || nodes[i].x > canvas.width) nodes[i].vx *= -1;
    if (nodes[i].y < 0 || nodes[i].y > canvas.height) nodes[i].vy *= -1;
  }

  requestAnimationFrame(animate);
}

animate();
