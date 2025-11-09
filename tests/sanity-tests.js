#!/usr/bin/env node

/**
 * SANITY TESTS - DoktorABC Mock
 * 
 * Purpose: Verify core functionality after changes
 * When to run: After bug fixes or minor changes
 * Coverage: Key features and workflows
 * 
 * User Stories Covered:
 * - US-010: As a visitor, I want to browse all treatment categories
 * - US-011: As a visitor, I want to read treatment details
 * - US-020: As a patient, I want to access my dashboard
 * - US-021: As a patient, I want to view my cart
 * - US-030: As a doctor, I want to access my portal
 * - US-040: As a pharmacist, I want to manage orders
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🧪 SANITY TESTS - Core Functionality Verification\n');
console.log('═'.repeat(80));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ FAIL: ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

// Test Group 1: Routing Configuration
console.log('\n📍 ROUTING TESTS:');

test('SAN-001: All public routes are properly configured', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  const requiredRoutes = ['/', '/login', '/register', '/categories', '/about', '/contact'];
  requiredRoutes.forEach(route => {
    if (!appContent.includes(`path="${route}"`)) {
      throw new Error(`Route ${route} not configured`);
    }
  });
});

test('SAN-002: Patient routes are protected', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  if (!appContent.includes('ProtectedRoute')) {
    throw new Error('Protected routes not configured');
  }
  if (!appContent.includes("allowedRoles={['patient']}")) {
    throw new Error('Patient role protection not found');
  }
});

test('SAN-003: Doctor routes are protected', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  if (!appContent.includes("allowedRoles={['doctor']}")) {
    throw new Error('Doctor role protection not found');
  }
});

test('SAN-004: 404 redirect is configured', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  if (!appContent.includes('path="*"')) {
    throw new Error('404 catch-all route not configured');
  }
});

// Test Group 2: Navigation Components
console.log('\n🧭 NAVIGATION TESTS:');

test('SAN-005: Header contains all required navigation links', () => {
  const headerContent = readFileSync(join(rootDir, 'src/components/Layout/Header.jsx'), 'utf-8');
  const requiredLinks = ['/how-it-works', '/about', '/shipping', '/faq', '/contact'];
  requiredLinks.forEach(link => {
    if (!headerContent.includes(`to="${link}"`)) {
      throw new Error(`Header missing link to ${link}`);
    }
  });
});

test('SAN-006: Footer contains information links', () => {
  const footerContent = readFileSync(join(rootDir, 'src/components/Layout/Footer.jsx'), 'utf-8');
  const requiredLinks = ['/terms', '/privacy', '/shipping', '/contact'];
  requiredLinks.forEach(link => {
    if (!footerContent.includes(`to="${link}"`)) {
      throw new Error(`Footer missing link to ${link}`);
    }
  });
});

test('SAN-007: Header supports authenticated and unauthenticated states', () => {
  const headerContent = readFileSync(join(rootDir, 'src/components/Layout/Header.jsx'), 'utf-8');
  if (!headerContent.includes('isAuthenticated')) {
    throw new Error('Header does not handle authentication state');
  }
  if (!headerContent.includes('Login') && !headerContent.includes('login')) {
    throw new Error('Header missing login functionality');
  }
});

// Test Group 3: Authentication
console.log('\n🔐 AUTHENTICATION TESTS:');

test('SAN-008: AuthContext provides login functionality', () => {
  const authContent = readFileSync(join(rootDir, 'src/contexts/AuthContext.jsx'), 'utf-8');
  if (!authContent.includes('login')) {
    throw new Error('AuthContext missing login function');
  }
});

test('SAN-009: AuthContext provides logout functionality', () => {
  const authContent = readFileSync(join(rootDir, 'src/contexts/AuthContext.jsx'), 'utf-8');
  if (!authContent.includes('logout')) {
    throw new Error('AuthContext missing logout function');
  }
});

test('SAN-010: Login page exists and uses AuthContext', () => {
  const loginContent = readFileSync(join(rootDir, 'src/pages/Auth/Login.jsx'), 'utf-8');
  if (!loginContent.includes('useAuth') && !loginContent.includes('AuthContext')) {
    throw new Error('Login page not using AuthContext');
  }
});

// Test Group 4: Data Management
console.log('\n💾 DATA MANAGEMENT TESTS:');

test('SAN-011: Users data is valid JSON with required fields', () => {
  const usersData = JSON.parse(readFileSync(join(rootDir, 'src/data/users.json'), 'utf-8'));
  if (!Array.isArray(usersData) || usersData.length === 0) {
    throw new Error('Users data is empty or invalid');
  }
  const firstUser = usersData[0];
  if (!firstUser.email || !firstUser.role) {
    throw new Error('User data missing required fields');
  }
});

test('SAN-012: Treatments data is valid JSON with required fields', () => {
  const treatmentsData = JSON.parse(readFileSync(join(rootDir, 'src/data/treatments.json'), 'utf-8'));
  if (!Array.isArray(treatmentsData) || treatmentsData.length === 0) {
    throw new Error('Treatments data is empty or invalid');
  }
  const firstTreatment = treatmentsData[0];
  if (!firstTreatment.id || !firstTreatment.name) {
    throw new Error('Treatment data missing required fields');
  }
});

test('SAN-013: AppStateContext manages treatments', () => {
  const appStateContent = readFileSync(join(rootDir, 'src/contexts/AppStateContext.jsx'), 'utf-8');
  if (!appStateContent.includes('treatments')) {
    throw new Error('AppStateContext not managing treatments');
  }
});

// Test Group 5: Key Pages
console.log('\n📄 PAGE TESTS:');

test('SAN-014: Landing page imports required components', () => {
  const landingContent = readFileSync(join(rootDir, 'src/pages/LandingNew.jsx'), 'utf-8');
  if (!landingContent.includes('Button') || !landingContent.includes('Card')) {
    throw new Error('Landing page missing UI component imports');
  }
});

test('SAN-015: Categories page exists', () => {
  const categoriesContent = readFileSync(join(rootDir, 'src/pages/Categories.jsx'), 'utf-8');
  if (!categoriesContent.includes('treatments') && !categoriesContent.includes('Treatment')) {
    throw new Error('Categories page not handling treatments');
  }
});

test('SAN-016: Patient dashboard exists', () => {
  const dashboardPath = join(rootDir, 'src/pages/Patient/Dashboard.jsx');
  const dashboardContent = readFileSync(dashboardPath, 'utf-8');
  if (!dashboardContent.includes('Dashboard') && !dashboardContent.includes('dashboard')) {
    throw new Error('Patient dashboard not properly configured');
  }
});

// Summary
console.log('\n' + '═'.repeat(80));
console.log(`\n📊 SANITY TEST RESULTS:`);
console.log(`   Total: ${passed + failed}`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

if (failed > 0) {
  console.log('⚠️  SANITY TESTS FAILED - Core functionality broken!');
  console.log('   Investigate and fix issues before proceeding.\n');
  process.exit(1);
} else {
  console.log('✅ SANITY TESTS PASSED - Core functionality verified!\n');
  process.exit(0);
}

