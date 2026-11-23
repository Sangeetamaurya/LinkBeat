import mongoose from 'mongoose';

const listeningHistorySchema = new mongoose.Schema({
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
  durationPlayed: {
    type: Number,
    default: 0
  },
  playedAt: {
    type: Date,
    default: Date.now
  }
});

listeningHistorySchema.index({ userId: 1, playedAt: -1 });
listeningHistorySchema.index({ userId: 1, songId: 1 });

export default mongoose.model('ListeningHistory', listeningHistorySchema);