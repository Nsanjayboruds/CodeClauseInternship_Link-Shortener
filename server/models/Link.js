const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  customAlias: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  clickCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Link', LinkSchema);
