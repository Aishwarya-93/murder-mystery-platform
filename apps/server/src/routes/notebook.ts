import { Router, Response } from 'express';
import { db } from '../db.js';
import { requireTeamAuth, AuthenticatedRequest } from '../auth.js';

const router = Router();

router.get('/', requireTeamAuth, (req: AuthenticatedRequest, res: Response) => {
  const teamId = req.team!.id;
  const row = db.prepare('SELECT text, updated_at FROM notebook WHERE team_id = ?').get(teamId) as { text: string; updated_at: string } | undefined;
  return res.json({ text: row?.text || '', updatedAt: row?.updated_at || null });
});

router.put('/', requireTeamAuth, (req: AuthenticatedRequest, res: Response) => {
  const teamId = req.team!.id;
  const { text = '' } = req.body;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO notebook (team_id, text, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(team_id) DO UPDATE SET text = excluded.text, updated_at = excluded.updated_at
  `).run(teamId, String(text), now);

  return res.json({ ok: true, updatedAt: now });
});

export default router;
