const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true },
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String,
  referrer: String
});

module.exports = mongoose.model('Click', ClickSchema);
