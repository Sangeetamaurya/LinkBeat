import ListeningHistory from '../models/ListeningHistory.js';

export const addToHistory = async (req, res) => {
  try {
    const { trackId, title, artist, cover, durationPlayed } = req.body;

    if (!trackId || !title || !artist) {
      return res.status(400).json({ message: 'trackId, title, and artist are required' });
    }

    const history = await ListeningHistory.create({
      userId: req.user._id,
      songId: trackId,
      songTitle: title,
      songArtist: artist,
      songCover: cover,
      durationPlayed: durationPlayed || 0
    });

    res.status(201).json({ history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const history = await ListeningHistory.find({ userId: req.user._id })
      .sort({ playedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ListeningHistory.countDocuments({ userId: req.user._id });

    res.json({ 
      history, 
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentHistory = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const history = await ListeningHistory.find({ userId: req.user._id })
      .sort({ playedAt: -1 })
      .limit(parseInt(limit));

    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearHistory = async (req, res) => {
  try {
    await ListeningHistory.deleteMany({ userId: req.user._id });
    res.json({ message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlayCounts = async (req, res) => {
  try {
    const history = await ListeningHistory.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$songId', count: { $sum: 1 }, songTitle: { $first: '$songTitle' }, songArtist: { $first: '$songArtist' }, songCover: { $first: '$songCover' } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ playCounts: history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};