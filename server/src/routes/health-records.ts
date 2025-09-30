import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiFetch, isApiError } from '../lib/apiClient';
import { HealthRecordInsert, HealthRecordUpdate } from '../types/database';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  const userId = (req.query.userId as string) ?? req.authUser?.id;
  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    const records = await apiFetch(`/health-records?userId=${encodeURIComponent(userId)}`, {
      token: req.accessToken,
    });

    return res.json(records ?? []);
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to fetch health records:', error);
    return res.status(500).json({ message: 'Failed to fetch health records' });
  }
});

router.post('/', async (req, res) => {
  const payload = req.body as HealthRecordInsert;
  if (!payload?.user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  try {
    const record = await apiFetch('/health-records', {
      method: 'POST',
      body: JSON.stringify(payload),
      token: req.accessToken,
    });

    return res.status(201).json(record);
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to create health record:', error);
    return res.status(500).json({ message: 'Failed to create health record' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body as HealthRecordUpdate;

  try {
    await apiFetch(`/health-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      token: req.accessToken,
    });

    return res.status(204).send();
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to update health record:', error);
    return res.status(500).json({ message: 'Failed to update health record' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await apiFetch(`/health-records/${id}`, {
      method: 'DELETE',
      token: req.accessToken,
    });

    return res.status(204).send();
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to delete health record:', error);
    return res.status(500).json({ message: 'Failed to delete health record' });
  }
});

export default router;
