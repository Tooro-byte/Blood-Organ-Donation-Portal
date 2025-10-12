// Import dependencies
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection with Sequelize
const sequelize = new Sequelize("donation_portal", "root", "Bougainvillea112", {
  host: "localhost",
  dialect: "mysql",
});

// Define Models
const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("donor", "admin"), allowNull: false },
  name: { type: DataTypes.STRING },
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

// Define Relationships
User.hasMany(Donation, { foreignKey: "userId" });
Donation.belongsTo(User, { foreignKey: "userId" });

// Sync database
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("MySQL database synced");
  })
  .catch((err) => console.error("Error syncing database:", err));

// User login
app.post("/api/auth/login", async (req, res) => {
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

// User signup
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, role } = req.body;
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "User exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword, role });
  const token = jwt.sign({ id: user.id, role: user.role }, "secret_key", {
    expiresIn: "1h",
  });
  res.json({ token, role: user.role });
});

// Create donation (for donors)
app.post("/api/donations", authenticate, async (req, res) => {
  if (req.user.role !== "donor")
    return res.status(403).json({ message: "Forbidden" });
  const donation = await Donation.create({ ...req.body, userId: req.user.id });
  res.json(donation);
});

// Get all donations (for admin)
app.get("/api/donations", authenticate, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  const donations = await Donation.findAll({
    include: [{ model: User, attributes: ["email"] }],
  });
  res.json(donations);
});

// Update donation status (for admin)
app.put("/api/donations/:id", authenticate, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  const donation = await Donation.findByPk(req.params.id);
  if (!donation) return res.status(404).json({ message: "Donation not found" });
  await donation.update(req.body);
  res.json(donation);
});

// Middleware for auth
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

app.listen(3000, () => console.log("Server on port 3000"));
