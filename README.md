# MURDER MYSTERY // Case File Archive Platform

A web platform for a 3.5-hour team murder mystery competition set in late October 1986 (London). Teams solve 10 sequential forensic investigation cases. Every solved case unseals a clue card onto the squad's physical Evidence Board with an authentic redaction-wipe reveal. After Case 10, teams submit their final Case Theory of the Prosecution for organizer review.

---

## 1. System Architecture & Constraints

- **Zero Runtime CDN Dependencies**: Fully self-hosted fonts (`@fontsource`), images, and WASM binaries. Operates reliably on constrained venue Wi-Fi.
- **Client Runtimes**: Ships strictly one heavy runtime—`sql.js` (SQLite WASM) for Level 4. No client-side code execution, interpreters, or compilers.
- **Server-Side Validation**: All solutions are validated on the server using HMAC-SHA256 salted hashes (`answers.hashed.json`). Answers and sealed case assets are never transmitted to the client before being earned.
- **Dynamic In-World Templating**: Characters (`content/characters.json`) and event tokens (`content/event.config.json`) are injected at render time. Renaming any character or location automatically updates all story briefs.
- **Single Process Deployment**: A single Node process serves both the REST API, SSE streams, and the built React SPA.

---

## 2. Quickstart & Commands

### Prerequisites
- Node.js 20+ (Node 22 LTS tested)
- npm 10+

### Development Setup
```bash
# 1. Install all dependencies across workspaces
npm install

# 2. Generate database, logs, and hashed answers
npm run generate-assets

# 3. Verify case file integrity
npm run verify-content

# 4. Run automated test suites (Unit & Full 10-Level E2E Happy Path)
npm test

# 5. Launch full development server (Concurrent API & Vite dev servers)
npm run dev
```

### Production Build & Single Process Launch
```bash
# Build server & web client
npm run build

# Start the unified production server on port 3000
npm start
```

### Docker Deployment
```bash
docker-compose up --build -d
```
Access the application at `http://localhost:3000`.

---

## 3. Event Day Runbook for Organizers

### Timeline Checklist

#### T-60 Minutes: System Initialization & Readiness Check
1. Start the server (`npm start` or via Docker).
2. Navigate to `http://<SERVER_IP>:3000/hq` (Emergency Login).
   - Default master passcode: `hampstead1986` (configurable via `ADMIN_PASSWORD` in `.env`).
3. Check the **Pre-Flight Readiness Banner** at the top of the HQ dashboard:
   - Ensure all squads have an assigned hardware `kit_no`.
   - Ensure all Kit #1..10 stations have their secret answers configured.

#### T-45 Minutes: Squad Roster Import & Credentials
1. Under the **Squad Import / Export** tab in HQ:
   - Paste your team roster CSV (`name,code,password,kit_no,members`).
   - Click **Import Squad List**.
   - Click **Download Credentials Sheet** to export printable slips for squad tables.
2. Demo Squad Credentials already pre-seeded:
   - Squad: `Baker Street Unit` • Code: `BAKER` • Pass: `case1986` • Kit #1
   - Squad: `Scotland Yard Bravo` • Code: `YARD` • Pass: `case1986` • Kit #2
   - Squad: `Hampstead Watch` • Code: `WATCH` • Pass: `case1986` • Kit #3

#### T-30 Minutes: Level 8 Physical Kit Stations
1. Place physical electronics kits on each table corresponding to the squad's assigned Kit number.
2. In HQ -> **Kit Answers (Level 8)** tab:
   - Verify or update the canonical answer for Kit #1 through Kit #10.
   - Answers are hashed instantly with HMAC-SHA256 upon saving.

#### T-0: Starting the Investigation
1. At the event start signal, click **START EVENT** in the top bar.
2. The global countdown clock begins (210 minutes).
3. Squads may now log in and submit case calculations.

#### Mid-Event Operations
- **Pausing the Event**: Click **PAUSE** at any time. Submissions will be temporarily suspended and countdown frozen. Click **RESUME** to continue.
- **Broadcasting Announcements**: Type any hint or venue announcement in the broadcast bar and click **Broadcast Toast** to send an instant popup to all squad screens over SSE.
- **Classifying Leaderboard**: Near the final 30 minutes, click **Leaderboard Visible** to toggle it to **Classified**. Teams will see that the board is hidden, adding suspense.
- **Manual Overrides**: If a hardware wire fails on a physical kit or a team needs organizer intervention, use the **Manual Overrides** tab to `UNLOCK` or `RESET` any level with an audited rationale.

#### Post-Event: Case Theory Review & Final Results
1. Click **END** when the clock expires.
2. Under the **Theory Grading** tab:
   - Examine each squad's answers to the 8 prosecution theory questions side-by-side with the canonical answers.
   - Tick `Correct`, `Partial`, or `Missed`, and add examiner feedback notes.
3. Click **Export Results CSV** to download final standings, levels solved, hints used, and elapsed times.

---

## 4. Canonical Solutions Quick Reference

| Level | Case Title | Stage & Tool | Solution |
|---|---|---|---|
| 1 | The Stopped Clock | Log Forensics (LogViewer) | `2237` |
| 2 | Recording Seven | Morse Taps (MorsePlayer) | `NOT ME JULIAN` (or `JULIAN`) |
| 3 | The Old Case | Gate: Fiction OSINT<br>Stage 1: Discrepancy | Gate: `1938MANNINGHAM`<br>Answer: `32-4417` |
| 4 | The Patient Files | Offline SQLite WASM (SqlConsole) | `LENA_IPAD-P0912` |
| 5 | Contradictions | Evidence Matrix (MatchBoard) | `3527` (Lena E3, Daniel E5, Clara E2, Noah E7) |
| 6 | Mira's Silence | Diary Reorder (DiaryTable) | `P1,P2,P3,P4,P5,P6` |
| 7 | The Perfect Alibi | Geolocation (PhotoViewer) | `Whitby` (or `54.4897, -0.6173`) |
| 8 | The Garage Panel | Physical DE Kit (KitStation) | Assigned per kit (e.g. Kit 1 = `42`, Kit 2 = `67`) |
| 9 | The Locked Room | Code Debugging (CodeFill) | Blanks: `60`, `+`, `%`<br>Output: `2308-4417` |
| 10 | The Accomplice | Club OSINT (FlagForm) | `FLAG{ROWAN_HALE}` |

---

## 5. Security & Anti-Cheat

- No plaintext answers or hashes are included in the frontend bundle.
- Sealed level content, transcripts, and assets return `403 Forbidden` if requested before being unlocked.
- Automatic rate limiting: max 6 submissions per minute per squad per level.
- Lockout protection: 10 consecutive incorrect attempts trigger a 60-second cooldown.
- Full submission logs with microsecond timestamps recorded in `attempts` table.
