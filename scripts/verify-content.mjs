import fs from 'node:fs';
import path from 'node:path';

export function verifyContent() {
  console.log('Verifying case files and content integrity...');
  let hasErrors = false;

  // Check event config
  const eventConfigPath = path.resolve('content/event.config.json');
  if (!fs.existsSync(eventConfigPath)) {
    console.error('FAIL: Missing content/event.config.json');
    hasErrors = true;
  }

  // Check characters
  const charactersPath = path.resolve('content/characters.json');
  if (!fs.existsSync(charactersPath)) {
    console.error('FAIL: Missing content/characters.json');
    hasErrors = true;
  }

  // Check hashed answers
  const hashedAnswersPath = path.resolve('apps/server/data/answers.hashed.json');
  if (!fs.existsSync(hashedAnswersPath)) {
    console.error('FAIL: Missing apps/server/data/answers.hashed.json');
    hasErrors = true;
  } else {
    const hashed = JSON.parse(fs.readFileSync(hashedAnswersPath, 'utf8'));
    for (let i = 1; i <= 10; i++) {
      if (!hashed[i]) {
        console.error(`FAIL: Missing hashed answer entry for Level ${i}`);
        hasErrors = true;
      }
    }
  }

  // Check levels 01 to 10
  for (let i = 1; i <= 10; i++) {
    const folder = String(i).padStart(2, '0');
    const levelDir = path.resolve(`content/levels/${folder}`);

    const requiredFiles = ['level.json', 'story.md', 'hints.md', 'reveal.md'];
    for (const file of requiredFiles) {
      const filePath = path.join(levelDir, file);
      if (!fs.existsSync(filePath)) {
        console.error(`FAIL: Level ${i} missing required file: ${file}`);
        hasErrors = true;
      } else {
        const stat = fs.statSync(filePath);
        if (stat.size === 0) {
          console.error(`FAIL: Level ${i} file is empty: ${file}`);
          hasErrors = true;
        }
      }
    }
  }

  if (hasErrors) {
    console.error('Content verification FAILED.');
    process.exit(1);
  }

  console.log('✓ Content verification PASSED. All 10 levels have full case files and hashed answers.');
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  verifyContent();
}
