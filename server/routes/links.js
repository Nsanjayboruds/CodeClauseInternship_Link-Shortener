const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const Click = require('../models/Click');
const generateCode = require('../utils/codegen');
const validUrl = require('valid-url');

// POST /api/shorten
router.post('/shorten', async (req, res) => {
  try {
    const { url, customCode, expireAt } = req.body;
    if (!url || !validUrl.isWebUri(url)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // If custom code provided, ensure unique
    let code = customCode && customCode.trim().length ? customCode.trim() : null;
    if (code) {
      const exists = await Link.findOne({ shortCode: code });
      if (exists) return res.status(409).json({ error: 'Custom alias already in use' });
    } else {
      // generate unique code (retry on collision, unlikely)
      do {
        code = generateCode(7);
      } while (await Link.findOne({ shortCode: code }));
    }

    const linkDoc = new Link({
      originalUrl: url,
      shortCode: code,
      customAlias: Boolean(customCode),
      expiresAt: expireAt || null
    });

    await linkDoc.save();
    return res.json({ shortUrl: `${process.env.BASE_URL}/${code}`, code });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/link/:code => return link info & basic analytics
router.get('/link/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ shortCode: code });
    if (!link) return res.status(404).json({ error: 'Not found' });

    const recentClicks = await Click.find({ linkId: link._id }).sort({ timestamp: -1 }).limit(20);
    return res.json({
      link: {
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        clickCount: link.clickCount,
        createdAt: link.createdAt,
        expiresAt: link.expiresAt
      },
      recentClicks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
