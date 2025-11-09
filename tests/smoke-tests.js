#!/usr/bin/env node

/**
 * SMOKE TESTS - DoktorABC Mock
 * 
 * Purpose: Quick verification that critical functionality works
 * When to run: After deployment, before detailed testing
 * Coverage: Essential features that must work for basic operation
 * 
 * User Stories Covered:
 * - US-001: As a visitor, I want to access the landing page
 * - US-002: As a visitor, I want to view available treatments
 * - US-003: As a visitor, I want to access login/register
 * - US-004: As a user, I want basic navigation to work
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔥 SMOKE TESTS - Critical Functionality Check\n');
console.log('═'.repeat(80));

let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
    results.push({ name, status: 'PASS', error: null });
  } catch (error) {
    console.log(`❌ FAIL: ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
    results.push({ name, status: 'FAIL', error: error.message });
  }
}

// Test 1: Critical files exist
test('ST-001: App entry point exists (main.jsx)', () => {
  const path = join(rootDir, 'src/main.jsx');
  if (!existsSync(path)) throw new Error('main.jsx not found');
});

test('ST-002: App component exists (App.jsx)', () => {
  const path = join(rootDir, 'src/App.jsx');
  if (!existsSync(path)) throw new Error('App.jsx not found');
});

test('ST-003: Landing page exists (LandingNew.jsx)', () => {
  const path = join(rootDir, 'src/pages/LandingNew.jsx');
  if (!existsSync(path)) throw new Error('LandingNew.jsx not found');
});

// Test 2: Critical routes are defined
test('ST-004: Root route (/) is defined', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  if (!appContent.includes('path="/"')) throw new Error('Root route not defined');
});

test('ST-005: Login route (/login) is defined', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  if (!appContent.includes('path="/login"')) throw new Error('Login route not defined');
});

test('ST-006: Categories route (/categories) is defined', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  if (!appContent.includes('path="/categories"')) throw new Error('Categories route not defined');
});

// Test 3: Essential components exist
test('ST-007: Header component exists', () => {
  const path = join(rootDir, 'src/components/Layout/Header.jsx');
  if (!existsSync(path)) throw new Error('Header.jsx not found');
});

test('ST-008: Footer component exists', () => {
  const path = join(rootDir, 'src/components/Layout/Footer.jsx');
  if (!existsSync(path)) throw new Error('Footer.jsx not found');
});

// Test 4: Authentication context exists
test('ST-009: AuthContext exists and exports required functions', () => {
  const path = join(rootDir, 'src/contexts/AuthContext.jsx');
  if (!existsSync(path)) throw new Error('AuthContext.jsx not found');
  const content = readFileSync(path, 'utf-8');
  if (!content.includes('export') || !content.includes('AuthProvider')) {
    throw new Error('AuthContext missing required exports');
  }
});

// Test 5: Required data files exist
test('ST-010: User data file exists', () => {
  const path = join(rootDir, 'src/data/users.json');
  if (!existsSync(path)) throw new Error('users.json not found');
  const content = readFileSync(path, 'utf-8');
  JSON.parse(content); // Verify valid JSON
});

test('ST-011: Treatment data file exists', () => {
  const path = join(rootDir, 'src/data/treatments.json');
  if (!existsSync(path)) throw new Error('treatments.json not found');
  const content = readFileSync(path, 'utf-8');
  JSON.parse(content); // Verify valid JSON
});

// Summary
console.log('═'.repeat(80));
console.log(`\n📊 SMOKE TEST RESULTS:`);
console.log(`   Total: ${passed + failed}`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

if (failed > 0) {
  console.log('⚠️  SMOKE TESTS FAILED - Critical issues detected!');
  console.log('   Application may not be deployable.\n');
  process.exit(1);
} else {
  console.log('✅ SMOKE TESTS PASSED - Critical functionality verified!\n');
  process.exit(0);
}

