import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiFetch, isApiError } from '../lib/apiClient';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const response = await apiFetch<unknown>('/shop', {
      token: req.accessToken,
    });

    return res.json(response ?? { sections: [], featured: [] });
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to fetch shop catalog:', error);
    return res.status(500).json({ message: 'Failed to fetch shop catalog' });
  }
});

export default router;
