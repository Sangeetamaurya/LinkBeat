import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';

export const createPlaylist = async (req, res) => {
  try {
    const { name, description, genre, songIds, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }

    const playlist = await Playlist.create({
      userId: req.user._id,
      name,
      description,
      genre,
      songIds: songIds || [],
      isPublic: isPublic || false
    });

    res.status(201).json({ playlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({ playlists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json({ playlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { name, description, genre, isPublic } = req.body;

    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, description, genre, isPublic },
      { new: true, runValidators: true }
    );

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json({ playlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;

    if (!songId) {
      return res.status(400).json({ message: 'Song ID is required' });
    }

    const playlist = await Playlist.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.songIds.includes(songId)) {
      return res.status(400).json({ message: 'Song already in playlist' });
    }

    playlist.songIds.push(songId);
    await playlist.save();

    res.json({ playlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { songId } = req.params;

    const playlist = await Playlist.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.songIds = playlist.songIds.filter(id => id !== songId);
    await playlist.save();

    res.json({ playlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderPlaylist = async (req, res) => {
  try {
    const { songIds } = req.body;

    if (!Array.isArray(songIds)) {
      return res.status(400).json({ message: 'songIds must be an array' });
    }

    const playlist = await Playlist.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.songIds = songIds;
    await playlist.save();

    res.json({ playlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};