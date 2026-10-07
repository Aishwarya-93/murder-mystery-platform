import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

export function buildSqlLevel() {
  const targetDir = path.resolve('content/assets-private');
  fs.mkdirSync(targetDir, { recursive: true });
  const dbPath = path.join(targetDir, 'level4.sqlite');

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Schema creation
  db.exec(`
    CREATE TABLE patients (
      patient_code TEXT PRIMARY KEY,
      display_name TEXT NOT NULL
    );

    CREATE TABLE records (
      record_id TEXT PRIMARY KEY,
      patient_code TEXT NOT NULL,
      session_date TEXT NOT NULL,
      recording_ref TEXT,
      last_edited_at TEXT NOT NULL,
      edited_by TEXT NOT NULL,
      FOREIGN KEY(patient_code) REFERENCES patients(patient_code)
    );

    CREATE TABLE access_log (
      log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      device TEXT NOT NULL,
      action TEXT NOT NULL,
      target_record TEXT NOT NULL,
      ts TEXT NOT NULL
    );
  `);

  // Patients
  const insertPatient = db.prepare('INSERT INTO patients (patient_code, display_name) VALUES (?, ?)');
  const patientsData = [
    ['P-0101', 'Mira Vale'],
    ['P-0102', 'Daniel Reed'],
    ['P-0103', 'Clara Vane'],
    ['P-0104', 'Lena Vane'],
    ['P-0220', 'Arthur Pendelton'],
    ['P-0315', 'Sarah Jenkins'],
    ['P-0442', 'Marcus Sterling'],
    ['P-0588', 'Eleanor Vance'],
    ['P-0711', 'Thomas Gallagher'],
    ['P-0850', 'Beatrice Holloway'],
    ['P-0912', 'REDACTED'],
    ['P-0944', 'Jonathan Finch'],
    ['P-1025', 'Victoria Shaw']
  ];
  for (const [code, name] of patientsData) {
    insertPatient.run(code, name);
  }

  // Records
  const insertRecord = db.prepare(`
    INSERT INTO records (record_id, patient_code, session_date, recording_ref, last_edited_at, edited_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const recordsData = [
    ['R-0001', 'P-0101', '2023-11-28', 'REC-1', '2023-12-04 11:20:00', 'elias'],
    ['R-0002', 'P-0101', '2024-01-14', 'REC-7', '2024-01-14 16:30:00', 'elias'],
    ['R-0003', 'P-0104', '2023-10-15', 'REC-3', '2023-10-18 09:12:00', 'elias'],
    ['R-0004', 'P-0102', '2025-08-20', 'REC-12', '2025-08-20 14:00:00', 'elias'],
    ['R-0005', 'P-0103', '2026-03-12', 'REC-18', '2026-03-12 15:45:00', 'elias'],
    ['R-0006', 'P-0220', '2024-05-10', 'REC-22', '2024-05-11 10:00:00', 'elias'],
    ['R-0007', 'P-0315', '2024-07-19', 'REC-29', '2024-07-20 08:30:00', 'archive_admin'],
    ['R-0008', 'P-0442', '2025-02-14', 'REC-34', '2025-02-14 17:15:00', 'elias'],
    ['R-0009', 'P-0912', '2023-12-01', 'REC-9', '2023-12-05 14:22:18', 'elias'],
    ['R-0010', 'P-0588', '2025-09-02', 'REC-41', '2025-09-05 11:10:00', 'elias'],
    ['R-0011', 'P-0711', '2026-01-20', 'REC-48', '2026-01-21 16:00:00', 'archive_admin'],
    ['R-0012', 'P-0850', '2026-04-18', 'REC-52', '2026-04-18 13:20:00', 'elias'],
    ['R-0013', 'P-0944', '2026-06-30', 'REC-58', '2026-07-01 09:40:00', 'elias'],
    ['R-0014', 'P-1025', '2026-09-14', 'REC-64', '2026-09-15 10:15:00', 'elias']
  ];
  for (const r of recordsData) {
    insertRecord.run(...r);
  }

  // Access Log
  const insertLog = db.prepare(`
    INSERT INTO access_log (user_id, device, action, target_record, ts)
    VALUES (?, ?, ?, ?, ?)
  `);
  const logsData = [
    ['elias', 'WORKSTATION_MAIN', 'VIEW', 'R-0001', '2023-12-04 11:15:00'],
    ['elias', 'WORKSTATION_MAIN', 'EDIT', 'R-0001', '2023-12-04 11:20:00'],
    ['elias', 'WORKSTATION_MAIN', 'VIEW', 'R-0009', '2023-12-05 14:10:00'],
    ['elias', 'WORKSTATION_MAIN', 'EDIT', 'R-0009', '2023-12-05 14:22:18'],
    ['archive_admin', 'TERMINAL_02', 'VIEW', 'R-0007', '2024-07-20 08:25:00'],
    ['archive_admin', 'TERMINAL_02', 'EDIT', 'R-0007', '2024-07-20 08:30:00'],
    ['elias', 'STUDY_LAPTOP', 'VIEW', 'R-0002', '2024-01-14 16:25:00'],
    ['elias', 'STUDY_LAPTOP', 'DELETE', 'R-0099', '2024-03-10 18:04:00'],
    ['elias', 'WORKSTATION_MAIN', 'VIEW', 'R-0004', '2025-08-20 13:50:00'],
    ['elias', 'WORKSTATION_MAIN', 'DELETE', 'R-0088', '2025-11-04 09:12:00'],
    ['archive_admin', 'TERMINAL_02', 'VIEW', 'R-0011', '2026-01-21 15:50:00'],
    ['archive_admin', 'TERMINAL_02', 'EDIT', 'R-0011', '2026-01-21 16:00:00'],
    ['elias', 'WORKSTATION_MAIN', 'VIEW', 'R-0003', '2026-10-22 17:00:00'],
    ['elias', 'WORKSTATION_MAIN', 'VIEW', 'R-0002', '2026-10-23 20:50:00'],
    ['lena.v', 'LENA_IPAD', 'VIEW', 'R-0003', '2026-10-23 23:51:40'],
    ['lena.v', 'LENA_IPAD', 'DELETE', 'R-0003', '2026-10-23 23:52:11']
  ];
  for (const l of logsData) {
    insertLog.run(...l);
  }

  db.close();
  console.log(`Created SQLite level database at ${dbPath} (${fs.statSync(dbPath).size} bytes)`);
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  buildSqlLevel();
}
