import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiFetch, isApiError } from '../lib/apiClient';
import { PatientInsert, PatientUpdate } from '../types/database';

const router = Router();

router.use(authenticate);

router.get('/by-user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const patient = await apiFetch(`/patients/by-user/${userId}`, {
      token: req.accessToken,
    });

    return res.json(patient);
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to fetch patient:', error);
    return res.status(500).json({ message: 'Failed to fetch patient' });
  }
});

router.post('/', async (req, res) => {
  const payload = req.body as PatientInsert;
  if (!payload?.user_id || !payload?.first_name) {
    return res.status(400).json({ message: 'user_id and first_name are required' });
  }

  try {
    const patient = await apiFetch('/patients', {
      method: 'POST',
      body: JSON.stringify(payload),
      token: req.accessToken,
    });

    return res.status(201).json(patient);
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to create patient:', error);
    return res.status(500).json({ message: 'Failed to create patient' });
  }
});

router.put('/by-user/:userId', async (req, res) => {
  const { userId } = req.params;
  const updates = req.body as PatientUpdate;

  try {
    await apiFetch(`/patients/by-user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      token: req.accessToken,
    });

    return res.status(204).send();
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to update patient:', error);
    return res.status(500).json({ message: 'Failed to update patient' });
  }
});

export default router;
