const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Setup Email Service with Headers to Avoid Spam
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ✅ Test email connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email service error:", error);
  } else {
    console.log("✅ Successfully connected to server");
    console.log("✅ Email service ready");
  }
});

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

const otpStore = new Map();

// ✅ Request OTP for password reset
app.post("/reset-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(200).json({ message: "✅ If email exists, OTP sent" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    const mailOptions = {
      from: `"HandSpeak Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "HandSpeak Password Reset — Your One-Time Password (OTP)",
      headers: {
        "X-Priority": "3",
        "X-Mailer": "HandSpeak/1.0",
        "Reply-To": process.env.EMAIL_USER,
        "List-Unsubscribe": `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-size: 16px;
              font-family: 'Carol Twombly', cursive;
              background-color: #ffffff;
              margin: 0;
              padding: 20px;
              color: #000000ff;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #000000ff;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #00999ff;
              margin: 0;
              font-size: 28px;
              font-family: 'Asimovian', sans-serif;
            }
            .header p {
              color: #3a3636ff;
              margin: 5px 0 0 0;
              font-size: 14px;
            }
            .content {
              font-size: 16px;
              line-height: 1.8;
              color: #161616ff;
            }
            .otp-box {
              background-color: #f5f5f5;
              border: 2px solid #000000ff;
              border-radius: 6px;
              padding: 25px;
              text-align: center;
              margin: 25px 0;
            }
            .otp-label {
              color: #666;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 10px;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #000000ff;
              font-family: 'Courier New', monospace;
              letter-spacing: 6px;
              margin: 0;
            }
            .warning-box {
              background-color: #ffe8e8;
              border-left: 4px solid #ff0800ff;
              padding: 15px;
              margin: 25px 0;
              border-radius: 4px;
            }
            .warning-box p {
              color: #d1615dff;
              margin: 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 2px solid #eee;
              margin-top: 30px;
              font-size: 12px;
              color: #999;
            }
            .footer a {
              font-size: 10px;
              color: #000000ff;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            
            <!-- Header -->
            <div class="header">
              <h1 style="font-family: 'Asimovian', sans-serif;">🖐🏻 HandSpeak</h1>
              <p>Your bridge to seamless sign language communication</p>
            </div>

            <!-- Content -->
            <div class="content">
              <p>Dear <strong>${user.name}</strong>,</p>
              
              <p>We received a request to reset your HandSpeak account password. To verify your identity, please use the One-Time Password (OTP) provided below:</p>

              <!-- OTP Box -->
              <div class="otp-box">
                <div class="otp-label">Your OTP Code:</div>
                <p class="otp-code">${otp}</p>
              </div>

              <!-- Warning -->
              <div class="warning-box">
                <p>⏱️ Valid for 10 minutes only</p>
                <p>Please do not share it with anyone for your account's security.</p>
              </div>

              <p>If you did not request this password reset, please ignore this message — your account will remain secure.</p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>Thank you for choosing HandSpeak,<br><strong>where every gesture becomes a voice.</strong></p>
              <p>© ${new Date().getFullYear()} HandSpeak. All rights reserved.<br>
              <a href="https://handspeak.com">Visit our website</a></p>
            </div>

          </div>
        </body>
        </html>
      `,
      text: `HandSpeak Password Reset\n\nDear ${user.name},\n\nYour OTP: ${otp}\n\nValid for 10 minutes.\n\nIf you didn't request this, ignore this email.\n\nHandSpeak Support`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ OTP sent to your email" });
  } catch (err) {
    console.error("❌ OTP Error:", err);
    res.status(500).json({ message: "Error: " + err.message });
  }
});

// ✅ Verify OTP and reset password
app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const otpData = otpStore.get(email);

    if (!otpData || otpData.otp !== otp) {
      return res.status(400).json({ message: "❌ Invalid OTP" });
    }

    if (otpData.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ message: "❌ OTP expired. Request a new one." });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // ✅ Remove used OTP
    otpStore.delete(email);

    console.log(`✅ Password reset for ${user.email}`);
    res.status(200).json({ message: "✅ Password reset successfully" });
  } catch (err) {
    console.error("❌ Verify OTP Error:", err);
    res.status(500).json({ message: "Error: " + err.message });
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

// ✅ Test Email Endpoint
app.get("/test-email", async (req, res) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "your-test-email@gmail.com",  // Change this to your email
      subject: "🖐🏻 HandSpeak - Test Email",
      html: `<h1>Test Email</h1><p>If you received this, email is working!</p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "✅ Test email sent successfully" });
  } catch (err) {
    console.error("❌ Test Email Error:", err);
    res.status(500).json({ message: "Error: " + err.message });
  }
});

// ✅ Contact Form - Send Feedback Email
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (message.length < 10) {
      return res.status(400).json({ message: "Message must be at least 10 characters long" });
    }

    // ✅ Send email to HandSpeak
    const mailOptions = {
      from: `"HandSpeak Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // handspeakcompany@gmail.com
      subject: `📧 New Contact Message from ${name}`,
      headers: {
        "X-Priority": "3",
        "X-Mailer": "HandSpeak/1.0",
        "Reply-To": email
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background-color: #ffffff;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              border: 2px solid #000000ff;
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #00fff2ff;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #00bfffff;
              margin: 0;
              font-size: 28px;
              font-family: 'Asimovian', sans-serif;
            }
            .header p {
              color: #666;
              margin: 5px 0 0 0;
              font-size: 14px;
            }
            .content {
              line-height: 1.8;
              color: #333;
            }
            .sender-info {
              background-color: #f5f5f5;
              border-left: 4px solid #000000ff;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .sender-info p {
              margin: 5px 0;
              font-weight: bold;
            }
            .message-box {
              background-color: #f9f9f9;
              border: 1px solid #e0e0e0;
              border-radius: 6px;
              padding: 20px;
              margin: 20px 0;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 2px solid #eee;
              margin-top: 30px;
              font-size: 12px;
              color: #999;
            }
            .footer a {
              color: #0099cc;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            
            <!-- Header -->
            <div class="header">
              <h1>🖐🏻 HandSpeak</h1>
              <p>New Contact Form Submission</p>
            </div>

            <!-- Content -->
            <div class="content">
              <p>You have received a new message through the HandSpeak contact form.</p>

              <!-- Sender Info -->
              <div class="sender-info">
                <p>📝 From: ${name}</p>
                <p>📧 Email: <a href="mailto:${email}">${email}</a></p>
              </div>

              <!-- Message -->
              <h3 style="color: #0099cc;">Message:</h3>
              <div class="message-box">
${message}
              </div>

              <p style="color: #666; font-size: 14px;">
                <strong>Note:</strong> To reply to this message, click the email address above or use the reply function.
              </p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>Thank you for contacting HandSpeak,<br><strong>where every gesture becomes a voice.</strong></p>
              <p>© ${new Date().getFullYear()} HandSpeak. All rights reserved.</p>
            </div>

          </div>
        </body>
        </html>
      `,
      text: `New Contact Message\n\nFrom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);

    // ✅ Send confirmation email to user
    const confirmationMail = {
      from: `"HandSpeak Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ We received your message - HandSpeak",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background-color: #ffffff;
              padding: 20px;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              border: 2px solid #00fff2;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #0099cc;
              margin: 0;
              font-size: 28px;
              font-family: 'Asimovian', sans-serif;
            }
            .content {
              line-height: 1.8;
              color: #333;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 2px solid #eee;
              margin-top: 30px;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🖐🏻 HandSpeak</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for reaching out to HandSpeak! We have received your message and will get back to you as soon as possible.</p>
              <p>We appreciate your feedback and suggestions. Your message helps us improve our services.</p>
              <br>
              <p>Best regards,<br><strong>The HandSpeak Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} HandSpeak. Bridging Communication Gaps. 🖐🏻</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hi ${name},\n\nThank you for reaching out to HandSpeak! We have received your message and will get back to you as soon as possible.\n\nBest regards,\nThe HandSpeak Team`
    };

    await transporter.sendMail(confirmationMail);

    res.status(200).json({ 
      message: "✅ Thank you! Your message has been sent successfully. We'll get back to you soon." 
    });

  } catch (err) {
    console.error("❌ Contact Form Error:", err);
    res.status(500).json({ message: "Error sending message: " + err.message });
  }
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