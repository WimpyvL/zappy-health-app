import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiFetch, isApiError } from '../lib/apiClient';
import { ProfileInsert, ProfileUpdate } from '../types/database';

const router = Router();

router.use(authenticate);

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await apiFetch(`/profiles/${userId}`, {
      token: req.accessToken,
    });

    return res.json(profile);
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to fetch profile:', error);
    return res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

router.post('/', async (req, res) => {
  const payload = req.body as ProfileInsert;

  if (!payload?.id || !payload.email) {
    return res.status(400).json({ message: 'Profile id and email are required' });
  }

  try {
    const profile = await apiFetch('/profiles', {
      method: 'POST',
      body: JSON.stringify(payload),
      token: req.accessToken,
    });

    return res.status(201).json(profile);
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to create profile:', error);
    return res.status(500).json({ message: 'Failed to create profile' });
  }
});

router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const updates = req.body as ProfileUpdate;

  try {
    await apiFetch(`/profiles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      token: req.accessToken,
    });

    return res.status(204).send();
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to update profile:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

export default router;
