import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiFetch, isApiError } from '../lib/apiClient';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const response = await apiFetch<unknown>('/treatments', {
      token: req.accessToken,
    });

    return res.json(response ?? { categories: [] });
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to fetch treatments:', error);
    return res.status(500).json({ message: 'Failed to fetch treatments' });
  }
});

router.get('/:treatmentId', async (req, res) => {
  const { treatmentId } = req.params;

  try {
    const response = await apiFetch<unknown>(`/treatments/${encodeURIComponent(treatmentId)}`, {
      token: req.accessToken,
    });

    return res.json(response ?? {});
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error(`Failed to fetch treatment ${treatmentId}:`, error);
    return res.status(500).json({ message: 'Failed to fetch treatment details' });
  }
});

export default router;
