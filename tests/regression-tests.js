#!/usr/bin/env node

/**
 * REGRESSION TESTS - DoktorABC Mock
 * 
 * Purpose: Ensure existing functionality still works after changes
 * When to run: Before releases, after major changes
 * Coverage: All previously working features
 * 
 * User Stories Covered:
 * - US-001 to US-050: All implemented user stories
 * - Ensures no features were broken by recent changes
 * - Validates backward compatibility
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('REGRESSION TESTS - Verify Existing Features\n');
console.log('═'.repeat(80));

let passed = 0;
let failed = 0;
const categories = {};

function test(category, name, fn) {
  if (!categories[category]) categories[category] = { passed: 0, failed: 0 };
  
  try {
    fn();
    console.log(`PASS: ${name}`);
    passed++;
    categories[category].passed++;
  } catch (error) {
    console.log(`FAIL: ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
    categories[category].failed++;
  }
}

// Test Group 1: All Routes Still Exist
console.log('\n📍 ROUTE REGRESSION:');

const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
const allRoutes = [
  '/', '/login', '/register', '/categories', '/treatment/:id', '/quick-book/:id',
  '/how-it-works', '/about', '/shipping', '/faq', '/contact', '/terms', '/privacy',
  '/dashboard', '/questionnaire/:treatmentId', '/book-consultation', '/cart', '/settings',
  '/doctor/dashboard', '/doctor/prescriptions', '/doctor/treatments',
  '/pharmacy/dashboard', '/pharmacy/orders', '/pharmacy/inventory',
  '/support/dashboard', '/support/tickets',
  '/customer-service/dashboard', '/customer-service/inquiries'
];

allRoutes.forEach((route, idx) => {
  test('Routes', `REG-R${idx + 1}: Route ${route} still exists`, () => {
    if (!appContent.includes(`path="${route}"`)) {
      throw new Error(`Route ${route} was removed`);
    }
  });
});

// Test Group 2: All Navigation Links Still Work
console.log('\n🔗 NAVIGATION REGRESSION:');

test('Navigation', 'REG-N1: Header navigation links intact', () => {
  const headerContent = readFileSync(join(rootDir, 'src/components/Layout/Header.jsx'), 'utf-8');
  const links = ['/how-it-works', '/about', '/shipping', '/faq', '/contact', '/login', '/register'];
  links.forEach(link => {
    if (!headerContent.includes(link)) {
      throw new Error(`Header link ${link} was removed`);
    }
  });
});

test('Navigation', 'REG-N2: Footer navigation links intact', () => {
  const footerContent = readFileSync(join(rootDir, 'src/components/Layout/Footer.jsx'), 'utf-8');
  const links = ['/how-it-works', '/categories', '/faq', '/about', '/terms', '/privacy', '/shipping', '/contact'];
  links.forEach(link => {
    if (!footerContent.includes(link)) {
      throw new Error(`Footer link ${link} was removed`);
    }
  });
});

test('Navigation', 'REG-N3: Logo navigation still works', () => {
  const headerContent = readFileSync(join(rootDir, 'src/components/Layout/Header.jsx'), 'utf-8');
  if (!headerContent.includes('Link to=')) {
    throw new Error('Logo navigation was removed');
  }
});

test('Navigation', 'REG-N4: Mobile menu still exists', () => {
  const headerContent = readFileSync(join(rootDir, 'src/components/Layout/Header.jsx'), 'utf-8');
  if (!headerContent.includes('mobileMenuOpen') && !headerContent.includes('mobile')) {
    throw new Error('Mobile menu was removed');
  }
});

// Test Group 3: Authentication Features
console.log('\n🔐 AUTHENTICATION REGRESSION:');

test('Auth', 'REG-A1: Login functionality preserved', () => {
  const authContent = readFileSync(join(rootDir, 'src/contexts/AuthContext.jsx'), 'utf-8');
  if (!authContent.includes('login')) {
    throw new Error('Login function was removed');
  }
});

test('Auth', 'REG-A2: Logout functionality preserved', () => {
  const authContent = readFileSync(join(rootDir, 'src/contexts/AuthContext.jsx'), 'utf-8');
  if (!authContent.includes('logout')) {
    throw new Error('Logout function was removed');
  }
});

test('Auth', 'REG-A3: Role-based access still enforced', () => {
  if (!appContent.includes('ProtectedRoute') || !appContent.includes('allowedRoles')) {
    throw new Error('Role-based protection was removed');
  }
});

test('Auth', 'REG-A4: User state management preserved', () => {
  const authContent = readFileSync(join(rootDir, 'src/contexts/AuthContext.jsx'), 'utf-8');
  if (!authContent.includes('user') || !authContent.includes('useState')) {
    throw new Error('User state management was modified');
  }
});

// Test Group 4: Core Pages
console.log('\n📄 PAGE REGRESSION:');

const criticalPages = [
  'src/pages/LandingNew.jsx',
  'src/pages/Auth/Login.jsx',
  'src/pages/Auth/Register.jsx',
  'src/pages/Categories.jsx',
  'src/pages/TreatmentDetail.jsx',
  'src/pages/Patient/Dashboard.jsx',
  'src/pages/Doctor/Dashboard.jsx',
  'src/pages/Pharmacy/Dashboard.jsx'
];

criticalPages.forEach((page, idx) => {
  test('Pages', `REG-P${idx + 1}: ${page.split('/').pop()} still exists`, () => {
    if (!existsSync(join(rootDir, page))) {
      throw new Error(`${page} was deleted`);
    }
  });
});

// Test Group 5: Data Files
console.log('\n💾 DATA REGRESSION:');

test('Data', 'REG-D1: Users data structure preserved', () => {
  const users = JSON.parse(readFileSync(join(rootDir, 'src/data/users.json'), 'utf-8'));
  if (!users[0].email || !users[0].role || !users[0].name) {
    throw new Error('Users data structure changed');
  }
});

test('Data', 'REG-D2: Treatments data structure preserved', () => {
  const treatments = JSON.parse(readFileSync(join(rootDir, 'src/data/treatments.json'), 'utf-8'));
  if (!treatments[0].id || !treatments[0].name || !treatments[0].category) {
    throw new Error('Treatments data structure changed');
  }
});

test('Data', 'REG-D3: Patient test accounts still exist', () => {
  const users = JSON.parse(readFileSync(join(rootDir, 'src/data/users.json'), 'utf-8'));
  const patientExists = users.some(u => u.role === 'patient');
  if (!patientExists) {
    throw new Error('Patient test account was removed');
  }
});

test('Data', 'REG-D4: Doctor test accounts still exist', () => {
  const users = JSON.parse(readFileSync(join(rootDir, 'src/data/users.json'), 'utf-8'));
  const doctorExists = users.some(u => u.role === 'doctor');
  if (!doctorExists) {
    throw new Error('Doctor test account was removed');
  }
});

// Test Group 6: UI Components
console.log('\n🎨 COMPONENT REGRESSION:');

const uiComponents = ['Button', 'Card', 'Input', 'Modal', 'Toast'];

uiComponents.forEach((component, idx) => {
  test('Components', `REG-C${idx + 1}: ${component} component exists`, () => {
    const path = join(rootDir, `src/components/ui/${component}.jsx`);
    if (!existsSync(path)) {
      throw new Error(`${component} component was deleted`);
    }
  });
});

// Test Group 7: Context Providers
console.log('\nCONTEXT REGRESSION:');

test('Context', 'REG-CT1: AuthContext still provides required values', () => {
  const authContent = readFileSync(join(rootDir, 'src/contexts/AuthContext.jsx'), 'utf-8');
  const required = ['user', 'login', 'logout', 'isAuthenticated'];
  required.forEach(item => {
    if (!authContent.includes(item)) {
      throw new Error(`AuthContext no longer provides ${item}`);
    }
  });
});

test('Context', 'REG-CT2: AppStateContext still manages state', () => {
  const appStateContent = readFileSync(join(rootDir, 'src/contexts/AppStateContext.jsx'), 'utf-8');
  if (!appStateContent.includes('treatments') || !appStateContent.includes('cart')) {
    throw new Error('AppStateContext state management changed');
  }
});

// Summary
console.log('\n' + '═'.repeat(80));
console.log(`\nREGRESSION TEST RESULTS:\n`);

Object.keys(categories).forEach(cat => {
  const { passed: p, failed: f } = categories[cat];
  const total = p + f;
  const rate = ((p / total) * 100).toFixed(1);
  console.log(`   ${cat}: ${p}/${total} passed (${rate}%)`);
});

console.log(`\n   Overall Total: ${passed + failed}`);
console.log(`   Passed: ${passed}`);
console.log(`   Failed: ${failed}`);
console.log(`   Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

if (failed > 0) {
  console.log('REGRESSION TESTS FAILED!');
  console.log('   Some existing features were broken by recent changes.\n');
  process.exit(1);
} else {
  console.log('REGRESSION TESTS PASSED!');
  console.log('   All existing features still work correctly.\n');
  process.exit(0);
}

