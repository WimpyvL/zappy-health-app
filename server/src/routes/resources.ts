import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiFetch, isApiError } from '../lib/apiClient';

const router = Router();

router.use(authenticate);

router.get('/featured', async (req, res) => {
  try {
    const response = await apiFetch<unknown>('/resources/featured', {
      token: req.accessToken,
    });

    return res.json(response ?? { resources: [] });
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to fetch educational resources:', error);
    return res.status(500).json({ message: 'Failed to fetch resources' });
  }
});

export default router;
