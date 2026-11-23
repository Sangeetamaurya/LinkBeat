import LikedSong from '../models/LikedSong.js';
import Song from '../models/Song.js';

export const toggleLike = async (req, res) => {
  try {
    const { trackId, title, artist, genre, duration, cover, previewUrl } = req.body;

    if (!trackId || !title || !artist) {
      return res.status(400).json({ message: 'trackId, title, and artist are required' });
    }

    const existing = await LikedSong.findOne({ userId: req.user._id, songId: trackId });

    if (existing) {
      await LikedSong.findByIdAndDelete(existing._id);
      return res.json({ liked: false, message: 'Song removed from liked songs' });
    }

    await LikedSong.create({
      userId: req.user._id,
      songId: trackId,
      songTitle: title,
      songArtist: artist,
      songGenre: genre,
      songDuration: duration,
      songCover: cover,
      songPreviewUrl: previewUrl
    });

    res.status(201).json({ liked: true, message: 'Song added to liked songs' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLikedSongs = async (req, res) => {
  try {
    const likedSongs = await LikedSong.find({ userId: req.user._id })
      .sort({ likedAt: -1 });

    res.json({ likedSongs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkLiked = async (req, res) => {
  try {
    const { trackId } = req.params;
    const liked = await LikedSong.findOne({ userId: req.user._id, songId: trackId });
    res.json({ liked: !!liked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};