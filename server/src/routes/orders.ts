import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiFetch, isApiError } from '../lib/apiClient';
import { OrderInsert } from '../types/database';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  const userId = (req.query.userId as string) ?? req.authUser?.id;
  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    const orders = await apiFetch(`/orders?userId=${encodeURIComponent(userId)}`, {
      token: req.accessToken,
    });

    return res.json(orders ?? []);
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to fetch orders:', error);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await apiFetch(`/orders/${id}`, {
      token: req.accessToken,
    });

    return res.json(order);
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to fetch order:', error);
    return res.status(500).json({ message: 'Failed to fetch order' });
  }
});

router.post('/', async (req, res) => {
  const payload = req.body as OrderInsert;
  if (!payload?.user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  try {
    const order = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
      token: req.accessToken,
    });

    return res.status(201).json(order);
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to create order:', error);
    return res.status(500).json({ message: 'Failed to create order' });
  }
});

router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status?: string };

  if (!status) {
    return res.status(400).json({ message: 'status is required' });
  }

  try {
    await apiFetch(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      token: req.accessToken,
    });

    return res.status(204).send();
  } catch (error) {
    if (isApiError(error)) {
      return res.status(error.status).json({ message: error.message, details: error.body });
    }

    console.error('Failed to update order status:', error);
    return res.status(500).json({ message: 'Failed to update order status' });
  }
});

export default router;
