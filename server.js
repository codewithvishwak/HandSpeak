const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ In-memory user storage
const users = [];

// ✅ JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// ✅ OAuth Endpoints

// Google OAuth
app.post("/auth/oauth", async (req, res) => {
  try {
    const { provider, email, name, picture, id } = req.body;

    // Check if user exists
    let user = users.find(u => u.email === email);
    
    if (!user) {
      // Create new user
      user = {
        id: Date.now(),
        name,
        email,
        picture,
        provider,
        oauthId: id,
        password: null // OAuth users don't have passwords
      };
      users.push(user);
      console.log(`✅ New ${provider} user created:`, user);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
      message: `✅ ${provider} login successful`,
      token,
      user: { id: user.id, name: user.name, email: user.email, picture: user.picture }
    });
  } catch (err) {
    console.error("❌ OAuth Error:", err);
    res.status(500).json({ message: "OAuth login failed: " + err.message });
  }
});

// GitHub OAuth Callback
app.post("/auth/github/callback", async (req, res) => {
  try {
    const { code } = req.body;
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get user info from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` }
    });

    const githubUser = userResponse.data;

    // Get email
    let email = githubUser.email;
    if (!email) {
      const emailResponse = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `token ${accessToken}` }
      });
      email = emailResponse.data.find(e => e.primary).email;
    }

    // Check if user exists
    let user = users.find(u => u.email === email);
    
    if (!user) {
      user = {
        id: Date.now(),
        name: githubUser.name || githubUser.login,
        email,
        picture: githubUser.avatar_url,
        provider: 'github',
        oauthId: githubUser.id
      };
      users.push(user);
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
      message: "✅ GitHub login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("❌ GitHub OAuth Error:", err);
    res.status(500).json({ message: "GitHub login failed" });
  }
});

// LinkedIn OAuth Callback
app.post("/auth/linkedin/callback", async (req, res) => {
  try {
    const { code } = req.body;
    const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
    const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get user info from LinkedIn
    const userResponse = await axios.get(
      "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage))",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const linkedinUser = userResponse.data;
    const name = `${linkedinUser.localizedFirstName} ${linkedinUser.localizedLastName}`;

    // Get email from LinkedIn
    const emailResponse = await axios.get(
      "https://api.linkedin.com/v2/emailAddress?q=primary&projection=(elements*(handle~))",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const email = emailResponse.data.elements[0]['handle~'].emailAddress;

    // Check if user exists
    let user = users.find(u => u.email === email);
    
    if (!user) {
      user = {
        id: Date.now(),
        name,
        email,
        provider: 'linkedin',
        oauthId: linkedinUser.id
      };
      users.push(user);
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
      message: "✅ LinkedIn login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("❌ LinkedIn OAuth Error:", err);
    res.status(500).json({ message: "LinkedIn login failed" });
  }
});

// ✅ Existing Routes
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "❌ Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ id: Date.now(), name, email, password: hashedPassword });

    res.status(201).json({ message: "✅ Signup successful! Please login." });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "❌ Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "❌ Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });

    res.json({ 
      message: "✅ Login successful",
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

app.post("/reset", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: "❌ Email not found" });
    }

    res.json({ message: "✅ Reset link sent to your email" });
  } catch (err) {
    console.error("❌ Reset Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ message: "✅ Server is running" });
});

app.post("/logout", (req, res) => {
  res.json({ message: "✅ Logout successful" });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Kill the process using it or set PORT env var.`);
        process.exit(1);
    } else {
        throw err;
    }
});