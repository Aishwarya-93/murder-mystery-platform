import { Router, Request, Response } from 'express';
import { registerSSEClient, unregisterSSEClient, getLeaderboardData } from '../sse.js';
import { getEventClock } from '../event-clock.js';

const router = Router();

router.get('/stream', (req: Request, res: Response) => {
  const clientId = registerSSEClient(res);

  req.on('close', () => {
    unregisterSSEClient(clientId);
  });
});

router.get('/', (_req: Request, res: Response) => {
  return res.json({
    leaderboard: getLeaderboardData(),
    clock: getEventClock()
  });
});

export default router;
