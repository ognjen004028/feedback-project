import express from 'express';
import { z } from 'zod';
import { Feedback } from '../models/feedback.js';

const router = express.Router();

// Validation schema
const feedbackSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  type: z.enum(['bug', 'suggestion']),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
});

// GET /api/feedback
router.get('/', async (req, res) => {
  try {
    const { page = '1', limit = '10', type, sortBy } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (type && type !== 'all') {
      query.type = type;
    }

    const sort: any = {};
    if (sortBy === 'name') {
      sort.name = 1;
    } else {
      sort.createdAt = -1;
    }

    const [feedbacks, total] = await Promise.all([
      Feedback.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Feedback.countDocuments(query),
    ]);

    res.json({
      feedbacks,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/feedback
router.post('/', async (req, res) => {
  try {
    const validatedData = feedbackSchema.parse(req.body);
    const feedback = new Feedback(validatedData);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error creating feedback:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export const feedbackRouter = router;