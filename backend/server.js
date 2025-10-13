const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

const sequelize = new Sequelize("donation_portal", "root", "password", {
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

app.post("/api/auth/login", async (req, res) => {
  console.log("Login attempt for:", req.body.email);
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, "secret_key", {
    expiresIn: "1h",
  });
  res.json({ token, role: user.role });
});

app.post("/api/auth/signup", async (req, res) => {
  console.log("Signup attempt for:", req.body.email);
  const { email, password, role, fullName, telephone, address, bloodGroup } =
    req.body;
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) return res.status(400).json({ message: "User exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    role,
    fullName: role === "donor" ? fullName : null,
    telephone: role === "donor" ? telephone : null,
    address: role === "donor" ? address : null,
    bloodGroup: role === "donor" ? bloodGroup : null,
  });
  const token = jwt.sign({ id: user.id, role: user.role }, "secret_key", {
    expiresIn: "1h",
  });
  res.json({ token, role: user.role });
});

app.post("/api/donations", authenticate, async (req, res) => {
  console.log("Donation attempt by user:", req.user.id);
  if (req.user.role !== "donor")
    return res.status(403).json({ message: "Forbidden" });
  const donation = await Donation.create({ ...req.body, userId: req.user.id });
  res.json(donation);
});

app.get("/api/donations", authenticate, async (req, res) => {
  console.log("Donations request by user:", req.user.id);
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  const donations = await Donation.findAll({
    include: [{ model: User, attributes: ["email"] }],
  });
  res.json(donations);
});

app.put("/api/donations/:id", authenticate, async (req, res) => {
  console.log("Update donation attempt for ID:", req.params.id);
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  const donation = await Donation.findByPk(req.params.id);
  if (!donation) return res.status(404).json({ message: "Donation not found" });
  await donation.update(req.body);
  res.json(donation);
});

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

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
