import express from 'express';
import {
  createSong,
  getSong,
  searchSongs,
  getSongsByIds
} from '../controllers/songController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createSong);
router.get('/search', searchSongs);
router.post('/by-ids', getSongsByIds);
router.get('/:trackId', getSong);

export default router;