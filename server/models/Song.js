import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  trackId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    default: 0
  },
  cover: {
    type: String
  },
  previewUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

songSchema.index({ title: 'text', artist: 'text' });

export default mongoose.model('Song', songSchema);