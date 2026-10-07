import fs from 'node:fs';
import path from 'node:path';

export function generateLogs() {
  const logs = [
    { id: 1, source: 'SEC', timestamp: '23-10 19:30:12', message: 'SYSTEM_ARMED perimeter_only', tz: 'BST (Panel)' },
    { id: 2, source: 'THERMO', timestamp: '2026-10-23 19:45:00', message: 'COMFORT_TEMP target=21.5C current=21.0C', tz: 'BST' },
    { id: 3, source: 'PHONE', timestamp: '7:55 PM', message: 'OUTGOING +44 20 7946 0912 03:14', tz: 'BST' },
    { id: 4, source: 'PC', timestamp: '2026-10-23T19:02:15Z', message: 'SYNC session_cache_uploaded', tz: 'UTC' },
    { id: 5, source: 'DOORBELL', timestamp: '2026-10-23 20:15:02', message: 'MOTION_DETECTED sidewalk_pedestrian', tz: 'BST' },
    { id: 6, source: 'PC', timestamp: '2026-10-23T19:25:40Z', message: 'INPUT keyboard clinical_notes_p0101.doc', tz: 'UTC' },
    { id: 7, source: 'DOORBELL', timestamp: '2026-10-23 20:41:32', message: 'FRONT_DOOR_OPEN (courier handoff)', tz: 'BST' },
    { id: 8, source: 'SEC', timestamp: '23-10 20:47:32', message: 'FRONT_DOOR_OPEN zone=1', tz: 'BST (Panel)' },
    { id: 9, source: 'SEC', timestamp: '23-10 20:48:15', message: 'FRONT_DOOR_CLOSE zone=1', tz: 'BST (Panel)' },
    { id: 10, source: 'THERMO', timestamp: '2026-10-23 20:50:00', message: 'ZONE_4_HEAT active pump_cycle=on', tz: 'BST' },
    { id: 11, source: 'DOORBELL', timestamp: '2026-10-23 21:02:11', message: 'NETWORK_INTERFACE_OFFLINE (Wi-Fi lost)', tz: 'BST' },
    { id: 12, source: 'SEC', timestamp: '23-10 21:10:22', message: 'CORRIDOR_MOTION zone=2', tz: 'BST (Panel)' },
    { id: 13, source: 'SEC', timestamp: '23-10 21:24:00', message: 'VISITOR_EXIT door=front guest_badge=07', tz: 'BST (Panel)' },
    { id: 14, source: 'PHONE', timestamp: '9:41 PM', message: 'INCOMING unknown 0:52', tz: 'BST' },
    { id: 15, source: 'PC', timestamp: '2026-10-23T20:52:07Z', message: 'INPUT keyboard', tz: 'UTC' },
    { id: 16, source: 'SEC', timestamp: '23-10 21:58:04', message: 'STUDY_MOTION zone=4', tz: 'BST (Panel)' },
    { id: 17, source: 'THERMO', timestamp: '2026-10-23 22:00:00', message: 'SETBACK 19C', tz: 'BST' },
    { id: 18, source: 'SEC', timestamp: '23-10 22:05:10', message: 'HEARTBEAT panel_ok batt=99%', tz: 'BST (Panel)' },
    { id: 19, source: 'PC', timestamp: '2026-10-23T21:35:44Z', message: 'SYNC backup_complete', tz: 'UTC' },
    { id: 20, source: 'SEC', timestamp: '23-10 22:32:00', message: 'HEARTBEAT panel_ok batt=99%', tz: 'BST (Panel)' },
    { id: 21, source: 'THERMO', timestamp: '2026-10-23 22:45:00', message: 'TEMP_READING zone=4 19.1C', tz: 'BST' },
    { id: 22, source: 'PHONE', timestamp: '11:14 PM', message: 'MISSED_CALL unknown', tz: 'BST' },
    { id: 23, source: 'THERMO', timestamp: '2026-10-23 23:15:00', message: 'NIGHT_PROFILE_ACTIVE', tz: 'BST' },
    { id: 24, source: 'SEC', timestamp: '23-10 23:25:00', message: 'HEARTBEAT panel_ok batt=98%', tz: 'BST (Panel)' },
    { id: 25, source: 'PC', timestamp: '2026-10-23T22:52:10Z', message: 'SYNC cloud_auth_refresh', tz: 'UTC' },
    { id: 26, source: 'THERMO', timestamp: '2026-10-23 23:45:00', message: 'TEMP_READING zone=4 18.4C', tz: 'BST' },
    { id: 27, source: 'SEC', timestamp: '23-10 23:58:30', message: 'PERIMETER_STATUS secure', tz: 'BST (Panel)' },
    { id: 28, source: 'THERMO', timestamp: '2026-10-24 00:00:00', message: 'DAILY_STATISTICS logged', tz: 'BST' }
  ];

  const targetDir = path.resolve('content/assets-private');
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'level1_logs.json'), JSON.stringify(logs, null, 2));
  console.log(`Generated ${logs.length} log entries in content/assets-private/level1_logs.json`);
  return logs;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  generateLogs();
}
