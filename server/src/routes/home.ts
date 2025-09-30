import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiFetch, isApiError } from '../lib/apiClient';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const data = await apiFetch('/home', {
      token: req.accessToken,
    });

    return res.json(data);
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to fetch home data:', error);
    return res.status(500).json({ message: 'Failed to fetch home data' });
  }
});

router.post('/check-ins', async (req, res) => {
  try {
    await apiFetch('/home/check-ins', {
      method: 'POST',
      body: JSON.stringify(req.body ?? {}),
      token: req.accessToken,
    });

    return res.status(201).json({ message: 'Check-in logged' });
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to log check-in:', error);
    return res.status(500).json({ message: 'Failed to log check-in' });
  }
});

router.post('/tasks/:taskId/complete', async (req, res) => {
  const { taskId } = req.params;

  try {
    await apiFetch(`/home/tasks/${taskId}/complete`, {
      method: 'POST',
      token: req.accessToken,
    });

    return res.status(200).json({ message: 'Task completed' });
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to complete task:', error);
    return res.status(500).json({ message: 'Failed to complete task' });
  }
});

router.get('/programs', async (req, res) => {
  try {
    const programs = await apiFetch('/home/programs', {
      token: req.accessToken,
    });

    return res.json(programs ?? []);
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to fetch programs:', error);
    return res.status(500).json({ message: 'Failed to fetch programs' });
  }
});

router.get('/programs/:category', async (req, res) => {
  const { category } = req.params;

  try {
    const programData = await apiFetch(`/home/programs/${category}`, {
      token: req.accessToken,
    });

    return res.json(programData ?? { orders: [], tasks: [], resources: [] });
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to fetch program data:', error);
    return res.status(500).json({ message: 'Failed to fetch program data' });
  }
});

export default router;
