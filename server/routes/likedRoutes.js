import express from 'express';
import {
  toggleLike,
  getLikedSongs,
  checkLiked
} from '../controllers/likedController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/toggle', toggleLike);
router.get('/', getLikedSongs);
router.get('/check/:trackId', checkLiked);

export default router;