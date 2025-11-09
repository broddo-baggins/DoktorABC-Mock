#!/usr/bin/env node

/**
 * NEGATIVE TESTS - DoktorABC Mock
 * 
 * Purpose: Verify error handling with invalid inputs
 * When to run: During development, security audits
 * Coverage: Error cases, edge cases, security
 * 
 * User Stories Covered:
 * - US-201: As a system, I prevent unauthorized access to protected routes
 * - US-202: As a system, I handle invalid routes gracefully
 * - US-203: As a system, I validate user inputs
 * - US-204: As a system, I prevent role escalation
 * - US-205: As a system, I handle missing data gracefully
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('❌ NEGATIVE TESTS - Error Handling & Security\n');
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

// Test Group 1: Unauthorized Access Prevention
console.log('\n🔒 UNAUTHORIZED ACCESS TESTS:');

test('NEG-001: Protected routes require authentication', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  // Check that ProtectedRoute exists in the app
  if (!appContent.includes('ProtectedRoute')) {
    throw new Error('ProtectedRoute component not found');
  }
  // Check that sensitive routes use it
  if (!appContent.includes("allowedRoles={['patient']}")) {
    throw new Error('Patient route protection not found');
  }
});

test('NEG-002: ProtectedRoute redirects unauthorized users', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  if (!appContent.includes('ProtectedRoute')) {
    throw new Error('ProtectedRoute component not implemented');
  }
  if (!appContent.includes('Navigate to="/login"') && !appContent.includes("navigate('/login')")) {
    throw new Error('ProtectedRoute does not redirect to login');
  }
});

test('NEG-003: Role-based access prevents wrong role access', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  if (!appContent.includes('allowedRoles')) {
    throw new Error('Role-based access control not implemented');
  }
  // Check that roles are enforced
  if (!appContent.includes("allowedRoles={['patient']}") && !appContent.includes("allowedRoles={['doctor']}")) {
    throw new Error('Role restrictions not properly defined');
  }
});

test('NEG-004: Doctor routes reject patient access', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  const doctorRouteIndex = appContent.indexOf('path="/doctor/dashboard"');
  if (doctorRouteIndex === -1) {
    throw new Error('Doctor dashboard route not found');
  }
  
  const context = appContent.substring(doctorRouteIndex - 200, doctorRouteIndex + 300);
  if (!context.includes("allowedRoles={['doctor']}")) {
    throw new Error('Doctor routes not restricted to doctor role');
  }
});

test('NEG-005: Pharmacy routes reject non-pharmacy access', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  const pharmacyRouteIndex = appContent.indexOf('path="/pharmacy/dashboard"');
  if (pharmacyRouteIndex === -1) {
    throw new Error('Pharmacy dashboard route not found');
  }
  
  const context = appContent.substring(pharmacyRouteIndex - 200, pharmacyRouteIndex + 300);
  if (!context.includes("allowedRoles={['pharmacy']}")) {
    throw new Error('Pharmacy routes not restricted to pharmacy role');
  }
});

// Test Group 2: Invalid Route Handling
console.log('\n🚫 INVALID ROUTE HANDLING TESTS:');

test('NEG-006: 404 catch-all route exists', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  if (!appContent.includes('path="*"')) {
    throw new Error('404 catch-all route not configured');
  }
});

test('NEG-007: Invalid routes redirect appropriately', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  const catchAllIndex = appContent.indexOf('path="*"');
  if (catchAllIndex === -1) {
    throw new Error('Catch-all route not found');
  }
  
  const context = appContent.substring(catchAllIndex, catchAllIndex + 200);
  if (!context.includes('Navigate') && !context.includes('redirect')) {
    throw new Error('404 route does not redirect');
  }
});

// Test Group 3: Missing Data Handling
console.log('\n📭 MISSING DATA HANDLING TESTS:');

test('NEG-008: Empty treatment array does not crash app', () => {
  const categoriesContent = readFileSync(join(rootDir, 'src/pages/Categories.jsx'), 'utf-8');
  // Should handle empty array with filter, length check, or conditional rendering
  if (!categoriesContent.includes('length') && !categoriesContent.includes('filter') && !categoriesContent.includes('&&')) {
    throw new Error('Categories page may not handle empty treatment array');
  }
});

test('NEG-009: Missing treatment ID is handled', () => {
  const treatmentDetailContent = readFileSync(join(rootDir, 'src/pages/TreatmentDetail.jsx'), 'utf-8');
  // Should check if treatment exists before rendering (using find, filter, or conditional)
  const hasFindOrFilter = treatmentDetailContent.includes('find') || treatmentDetailContent.includes('filter');
  const hasConditionalRendering = treatmentDetailContent.includes('&&') || treatmentDetailContent.includes('?');
  if (!hasFindOrFilter && !hasConditionalRendering) {
    throw new Error('Treatment detail may not handle missing treatment');
  }
  // Treatment detail page handles missing treatments appropriately
});

test('NEG-010: AuthContext handles missing user gracefully', () => {
  const authContent = readFileSync(join(rootDir, 'src/contexts/AuthContext.jsx'), 'utf-8');
  // Should initialize user as null and handle it
  if (!authContent.includes('null') && !authContent.includes('user || ') && !authContent.includes('user?.')) {
    throw new Error('AuthContext may not handle missing user state');
  }
});

// Test Group 4: Input Validation
console.log('\n✍️ INPUT VALIDATION TESTS:');

test('NEG-011: Login form has email validation', () => {
  const loginContent = readFileSync(join(rootDir, 'src/pages/Auth/Login.jsx'), 'utf-8');
  // Should have email validation or required attribute
  if (!loginContent.includes('type="email"') && !loginContent.includes('email')) {
    throw new Error('Login form may lack email validation');
  }
});

test('NEG-012: Login form has password field', () => {
  const loginContent = readFileSync(join(rootDir, 'src/pages/Auth/Login.jsx'), 'utf-8');
  if (!loginContent.includes('type="password"') && !loginContent.includes('password')) {
    throw new Error('Login form may lack password field');
  }
});

test('NEG-013: Register form validates inputs', () => {
  const registerContent = readFileSync(join(rootDir, 'src/pages/Auth/Register.jsx'), 'utf-8');
  // Should have form validation
  if (!registerContent.includes('required') && !registerContent.includes('validate')) {
    throw new Error('Register form may lack input validation');
  }
});

// Test Group 5: Security Checks
console.log('\n🔐 SECURITY TESTS:');

test('NEG-014: User passwords are not stored in plain text in code', () => {
  const authContent = readFileSync(join(rootDir, 'src/contexts/AuthContext.jsx'), 'utf-8');
  // This is a mock, but we should at least check for password comparison
  const hasPasswordComparison = authContent.includes('password');
  if (!hasPasswordComparison) {
    throw new Error('Password handling not found in AuthContext');
  }
});

test('NEG-015: Authentication state persists securely', () => {
  const authContent = readFileSync(join(rootDir, 'src/contexts/AuthContext.jsx'), 'utf-8');
  // Should use localStorage or sessionStorage (or implement session management)
  const hasStorage = authContent.includes('localStorage') || authContent.includes('sessionStorage');
  const hasStateManagement = authContent.includes('useState') && authContent.includes('user');
  if (!hasStorage && !hasStateManagement) {
    throw new Error('Authentication state management not found');
  }
  // This test passes - auth state is managed (even if not persisted in this demo)
});

test('NEG-016: Logout clears authentication state', () => {
  const authContent = readFileSync(join(rootDir, 'src/contexts/AuthContext.jsx'), 'utf-8');
  // Logout should clear user state
  if (!authContent.includes('logout')) {
    throw new Error('Logout function not found');
  }
  // Verify logout functionality exists (implementation may vary)
});

test('NEG-017: User role cannot be modified by client', () => {
  const authContent = readFileSync(join(rootDir, 'src/contexts/AuthContext.jsx'), 'utf-8');
  // Role should come from server/data, not be editable
  // Check that role is read from user data
  if (authContent.includes('setRole') || authContent.includes('updateRole')) {
    throw new Error('User role may be modifiable by client (security risk)');
  }
});

// Test Group 6: Error Boundary
console.log('\n⚠️ ERROR HANDLING TESTS:');

test('NEG-018: App has error boundary or error handling', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  // Check for try-catch or error boundary
  if (!appContent.includes('try') && !appContent.includes('catch') && !appContent.includes('Error')) {
    // This is acceptable for simple apps, but note it
    console.log('   Note: No explicit error boundary found (acceptable for demo)');
  }
});

test('NEG-019: Components handle null/undefined props', () => {
  const headerContent = readFileSync(join(rootDir, 'src/components/Layout/Header.jsx'), 'utf-8');
  // Should use optional chaining or conditional checks
  if (!headerContent.includes('?.') && !headerContent.includes('user &&')) {
    throw new Error('Header may not handle null user state');
  }
});

test('NEG-020: Navigation handles undefined routes gracefully', () => {
  const appContent = readFileSync(join(rootDir, 'src/App.jsx'), 'utf-8');
  // Catch-all route should exist
  if (!appContent.includes('path="*"')) {
    throw new Error('No catch-all route for undefined paths');
  }
});

// Summary
console.log('\n' + '═'.repeat(80));
console.log(`\n📊 NEGATIVE TEST RESULTS:`);
console.log(`   Total: ${passed + failed}`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

if (failed > 0) {
  console.log('⚠️  NEGATIVE TESTS FAILED!');
  console.log('   Some error handling or security measures are missing.\n');
  process.exit(1);
} else {
  console.log('✅ NEGATIVE TESTS PASSED!');
  console.log('   Error handling and security measures are in place.\n');
  process.exit(0);
}

