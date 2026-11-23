import express from 'express';
import {
  addToHistory,
  getHistory,
  getRecentHistory,
  clearHistory,
  getPlayCounts
} from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', addToHistory);
router.get('/', getHistory);
router.get('/recent', getRecentHistory);
router.get('/playcounts', getPlayCounts);
router.delete('/', clearHistory);

export default router;