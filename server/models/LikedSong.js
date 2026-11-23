import mongoose from 'mongoose';

const likedSongSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songId: {
    type: String,
    ref: 'Song',
    required: true
  },
  songTitle: {
    type: String,
    required: true
  },
  songArtist: {
    type: String,
    required: true
  },
  songCover: {
    type: String
  },
  songDuration: {
    type: Number,
    default: 0
  },
  songPreviewUrl: {
    type: String
  },
  songGenre: {
    type: String
  },
  likedAt: {
    type: Date,
    default: Date.now
  }
});

likedSongSchema.index({ userId: 1, likedAt: -1 });
likedSongSchema.index({ userId: 1, songId: 1 }, { unique: true });

export default mongoose.model('LikedSong', likedSongSchema);