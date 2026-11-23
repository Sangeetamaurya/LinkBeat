import Song from '../models/Song.js';

export const createSong = async (req, res) => {
  try {
    const { trackId, title, artist, genre, duration, cover, previewUrl } = req.body;

    if (!trackId || !title || !artist) {
      return res.status(400).json({ message: 'trackId, title, and artist are required' });
    }

    let song = await Song.findOne({ trackId });

    if (!song) {
      song = await Song.create({ trackId, title, artist, genre, duration, cover, previewUrl });
    }

    res.status(201).json({ song });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSong = async (req, res) => {
  try {
    const song = await Song.findOne({ trackId: req.params.trackId });

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    res.json({ song });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchSongs = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const songs = await Song.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit));

    res.json({ songs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSongsByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'ids array is required' });
    }

    const songs = await Song.find({ trackId: { $in: ids } });
    const songMap = new Map(songs.map(s => [s.trackId, s]));
    const orderedSongs = ids.map(id => songMap.get(id)).filter(Boolean);

    res.json({ songs: orderedSongs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};