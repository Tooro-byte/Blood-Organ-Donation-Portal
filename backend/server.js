const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

// MUST be BEFORE other middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const sequelize = new Sequelize("donation_portal", "root", "Bougainvillea112", {
  host: "localhost",
  dialect: "mysql",
});

const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("donor", "admin"), allowNull: false },
  fullName: { type: DataTypes.STRING },
  telephone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  bloodGroup: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Donation = sequelize.define("Donation", {
  type: { type: DataTypes.ENUM("blood", "organ"), allowNull: false },
  details: { type: DataTypes.STRING },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
  fullName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  contact: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  bloodGroup: { type: DataTypes.STRING },
  preferredDate: { type: DataTypes.DATE },
  hospital: { type: DataTypes.STRING },
  time: { type: DataTypes.TIME },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Contact = sequelize.define("Contact", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

User.hasMany(Donation, { foreignKey: "userId" });
Donation.belongsTo(User, { foreignKey: "userId" });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("MySQL database synced successfully");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// ==================== AUTHENTICATION ENDPOINTS ====================

app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("Login attempt for:", req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, "secret_key", {
      expiresIn: "1h",
    });

    res.json({
      token,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      telephone: user.telephone,
      address: user.address,
      bloodGroup: user.bloodGroup,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    console.log("Signup attempt for:", req.body.email);
    const { email, password, role, fullName, telephone, address, bloodGroup } =
      req.body;

    if (!email || !password || !role || !fullName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      fullName,
      telephone: role === "donor" ? telephone : null,
      address: role === "donor" ? address : null,
      bloodGroup: role === "donor" ? bloodGroup : null,
    });

    const token = jwt.sign({ id: user.id, role: user.role }, "secret_key", {
      expiresIn: "1h",
    });

    res.status(201).json({
      token,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      telephone: user.telephone,
      address: user.address,
      bloodGroup: user.bloodGroup,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ==================== USER PROFILE ENDPOINTS ====================

// Get current user profile
app.get("/api/user/profile", authenticate, async (req, res) => {
  try {
    console.log("Profile request for user:", req.user.id);
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }, // Don't send password
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
});

// Update user profile
app.put("/api/user/profile", authenticate, async (req, res) => {
  try {
    console.log("Profile update for user:", req.user.id);
    const { fullName, telephone, address, bloodGroup } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only allowed fields
    await user.update({
      fullName: fullName || user.fullName,
      telephone: telephone || user.telephone,
      address: address || user.address,
      bloodGroup: bloodGroup || user.bloodGroup,
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        telephone: user.telephone,
        address: user.address,
        bloodGroup: user.bloodGroup,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// ==================== DONATION ENDPOINTS ====================

// Get user-specific donations
app.get("/api/user/donations", authenticate, async (req, res) => {
  try {
    console.log("User donations request by user:", req.user.id);
    const donations = await Donation.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(donations);
  } catch (err) {
    console.error("Error fetching user donations:", err);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
});

app.post("/api/donations", authenticate, async (req, res) => {
  console.log("Donation attempt by user:", req.user.id);
  if (req.user.role !== "donor") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only donors can submit donations" });
  }

  const { type, details, preferredDate, hospital, time } = req.body;

  if (!type || !preferredDate || !hospital || !time) {
    return res
      .status(400)
      .json({ message: "Missing required donation fields" });
  }

  try {
    // Get user data to include in donation
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const donation = await Donation.create({
      type,
      details: details || null,
      fullName: user.fullName,
      email: user.email,
      contact: user.telephone,
      address: user.address,
      bloodGroup: user.bloodGroup,
      preferredDate,
      hospital,
      time,
      userId: req.user.id,
    });

    res.status(201).json(donation);
  } catch (err) {
    console.error("Error creating donation:", err);
    res.status(500).json({ message: "Failed to create donation" });
  }
});

app.get("/api/donations", authenticate, async (req, res) => {
  console.log("Donations request by user:", req.user.id);
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can view all donations" });
  }

  try {
    const donations = await Donation.findAll({
      include: [
        {
          model: User,
          attributes: ["email", "fullName", "telephone", "bloodGroup"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(donations);
  } catch (err) {
    console.error("Error fetching donations:", err);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
});

app.put("/api/donations/:id", authenticate, async (req, res) => {
  console.log("Update donation attempt for ID:", req.params.id);
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can update donations" });
  }

  try {
    const donation = await Donation.findByPk(req.params.id);
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    await donation.update(req.body);
    res.json(donation);
  } catch (err) {
    console.error("Error updating donation:", err);
    res.status(500).json({ message: "Failed to update donation" });
  }
});

app.delete("/api/donations/:id", authenticate, async (req, res) => {
  console.log("Delete donation attempt for ID:", req.params.id);

  try {
    const donation = await Donation.findByPk(req.params.id);
    if (!donation || donation.userId !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Donation not found or unauthorized" });
    }

    await donation.destroy();
    res.json({ message: "Donation cancelled successfully" });
  } catch (err) {
    console.error("Error deleting donation:", err);
    res.status(500).json({ message: "Failed to cancel donation" });
  }
});

// ==================== CONTACT ENDPOINTS ====================

app.post("/api/contact", async (req, res) => {
  console.log("Contact form submission received:", req.body);
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const contact = await Contact.create({ name, email, message });
    console.log("Contact saved:", contact.dataValues);
    res
      .status(201)
      .json({ message: "Contact form submitted successfully", contact });
  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(500).json({ message: "Failed to submit contact form" });
  }
});

// ==================== UTILITY ENDPOINTS ====================

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// ==================== AUTHENTICATION MIDDLEWARE ====================

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, "secret_key");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("CORS enabled for:", [
    "http://localhost:3000",
    "http://localhost:5173",
  ]);
});
