import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

export const ANSWER_SECRET = process.env.ANSWER_SECRET || 'MURDER_MYSTERY_1986_SECRET_KEY';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'INVESTIGATION_COOKIE_SECRET_1986';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hampstead1986';
export const PORT = parseInt(process.env.PORT || '3000', 10);

const rootDir = path.resolve(process.cwd());

export function loadEventConfig() {
  const cfgPath = path.resolve(rootDir, 'content/event.config.json');
  return JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
}

export function loadCharactersConfig() {
  const charsPath = path.resolve(rootDir, 'content/characters.json');
  return JSON.parse(fs.readFileSync(charsPath, 'utf8'));
}
