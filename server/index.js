require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const linksRouter = require('./routes/links');
const Link = require('./models/Link');
const Click = require('./models/Click');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// simple rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60 // limit each IP to 60 requests per minute
});
app.use(limiter);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error', err); process.exit(1); });

// Routes
app.use('/api', linksRouter);

// Redirect route: GET /:code
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ shortCode: code });
    if (!link) return res.status(404).send('Not found');

    // check expiry
    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(410).send('Link expired');
    }

    // record click & increment counter
    link.clickCount = (link.clickCount || 0) + 1;
    await link.save();

    const click = new Click({
      linkId: link._id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referrer') || req.get('Referer') || ''
    });
    await click.save();

    // redirect
    return res.redirect(link.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
