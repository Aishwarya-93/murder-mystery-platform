import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { db } from './db.js';
import { SESSION_SECRET, ADMIN_PASSWORD } from './config.js';
import { Team } from './types.js';

export interface AuthenticatedRequest extends Request {
  team?: Team;
  isAdmin?: boolean;
}

export function signToken(payload: string): string {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(payload);
  const sig = hmac.digest('hex');
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): string | null {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(payload);
  const expectedSig = hmac.digest('hex');
  if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    return payload;
  }
  return null;
}

export function requireTeamAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const cookie = req.cookies?.investigation_session;
  if (!cookie) {
    return res.status(401).json({ error: 'Authentication required. Please enter team credentials.' });
  }

  const teamId = verifyToken(cookie);
  if (!teamId) {
    return res.status(401).json({ error: 'Invalid or expired investigation session.' });
  }

  const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(teamId) as Team | undefined;
  if (!team) {
    return res.status(401).json({ error: 'Team not found in case database.' });
  }

  req.team = team;
  next();
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const adminCookie = req.cookies?.investigation_admin;
  if (!adminCookie) {
    return res.status(403).json({ error: 'Administrator access required.' });
  }

  const verified = verifyToken(adminCookie);
  if (verified !== 'admin') {
    return res.status(403).json({ error: 'Invalid administrator credentials.' });
  }

  req.isAdmin = true;
  next();
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const cookie = req.cookies?.investigation_session;
  if (cookie) {
    const teamId = verifyToken(cookie);
    if (teamId) {
      const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(teamId) as Team | undefined;
      if (team) req.team = team;
    }
  }

  const adminCookie = req.cookies?.investigation_admin;
  if (adminCookie && verifyToken(adminCookie) === 'admin') {
    req.isAdmin = true;
  }

  next();
}
