import { Router, Response } from 'express';
import { db } from '../db.js';
import { requireTeamAuth, AuthenticatedRequest } from '../auth.js';
import { getEventClock } from '../event-clock.js';

const router = Router();

export const THEORY_QUESTIONS = [
  { id: 'q1', text: 'Who killed Dr. Elias Vane?' },
  { id: 'q2', text: 'What happened during the confrontation in the study?' },
  { id: 'q3', text: 'Why was the 22:17 clock important to the killer?' },
  { id: 'q4', text: 'What really happened to Julian Marsh three years earlier?' },
  { id: 'q5', text: 'Why did Mira Vale stop speaking?' },
  { id: 'q6', text: 'Why did Lena Vane alter the crime scene?' },
  { id: 'q7', text: 'Why did Adrian hide his connection to Elias?' },
  { id: 'q8', text: 'What does Dr. Vane’s final note imply about Detective Rowan Hale?' }
];

router.get('/', requireTeamAuth, (req: AuthenticatedRequest, res: Response) => {
  const teamId = req.team!.id;
  const theory = db.prepare('SELECT * FROM theory WHERE team_id = ?').get(teamId);

  return res.json({
    questions: THEORY_QUESTIONS,
    submission: theory || null
  });
});

router.post('/', requireTeamAuth, (req: AuthenticatedRequest, res: Response) => {
  const clock = getEventClock();
  if (clock.state === 'ENDED') {
    return res.status(400).json({ error: 'The event has officially ended. Theories can no longer be edited.' });
  }

  const teamId = req.team!.id;
  const { q1 = '', q2 = '', q3 = '', q4 = '', q5 = '', q6 = '', q7 = '', q8 = '' } = req.body;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO theory (team_id, q1, q2, q3, q4, q5, q6, q7, q8, submitted_at, marks_json, reviewed_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)
    ON CONFLICT(team_id) DO UPDATE SET
      q1 = excluded.q1,
      q2 = excluded.q2,
      q3 = excluded.q3,
      q4 = excluded.q4,
      q5 = excluded.q5,
      q6 = excluded.q6,
      q7 = excluded.q7,
      q8 = excluded.q8,
      submitted_at = excluded.submitted_at
  `).run(teamId, q1, q2, q3, q4, q5, q6, q7, q8, now);

  return res.json({ ok: true, submittedAt: now });
});

export default router;
