require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const signatureSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  signedAt: { type: Date, default: Date.now },
});

const Signature = mongoose.model("Signature", signatureSchema);

app.get("/api/count", async (req, res) => {
  const count = await Signature.countDocuments();
  res.json({ count });
});

app.post("/api/sign", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: "Nom et email requis." });
  }

  try {
    await Signature.create({ fullName: name, email });
    const count = await Signature.countDocuments();
    res.json({ success: true, count, redirect: process.env.REDIRECT_URL });
  } catch (err) {
    if (err.code === 11000) {
  const count = await Signature.countDocuments();
  return res.status(409).json({
    success: false,
    error: "already_signed",
    message: "Cet email a déjà signé.",
    count,
  });
}
    res.status(500).json({ success: false, error: "Erreur serveur." });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connecté");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Erreur MongoDB :", err.message);
    process.exit(1);
  });
