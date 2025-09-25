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


const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 60
});
app.use(limiter);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api', linksRouter);


app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ shortCode: code });
    if (!link) return res.status(404).send('Not found');

    
    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(410).send('Link expired');
    }

    
    link.clickCount = (link.clickCount || 0) + 1;
    await link.save();

    const click = new Click({
      linkId: link._id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referrer') || req.get('Referer') || ''
    });
    await click.save();

    
    return res.redirect(link.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
