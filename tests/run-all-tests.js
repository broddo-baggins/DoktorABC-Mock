#!/usr/bin/env node

/**
 * TEST RUNNER - DoktorABC Mock
 * Runs all test suites in sequence
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testSuites = [
  { name: 'Smoke Tests', file: 'smoke-tests.js', critical: true },
  { name: 'Sanity Tests', file: 'sanity-tests.js', critical: true },
  { name: 'Positive Tests', file: 'positive-tests.js', critical: false },
  { name: 'Negative Tests', file: 'negative-tests.js', critical: false },
  { name: 'Regression Tests', file: 'regression-tests.js', critical: false }
];

console.log('🚀 Running All Test Suites\n');
console.log('═'.repeat(80));
console.log('\n');

let totalPassed = 0;
let totalFailed = 0;
const results = [];

async function runTest(suite) {
  return new Promise((resolve) => {
    const testPath = join(__dirname, suite.file);
    const proc = spawn('node', [testPath], { stdio: 'inherit' });
    
    proc.on('close', (code) => {
      const passed = code === 0;
      results.push({ ...suite, passed });
      
      if (passed) {
        totalPassed++;
      } else {
        totalFailed++;
      }
      
      resolve(passed);
    });
  });
}

async function runAllTests() {
  for (const suite of testSuites) {
    console.log(`\n${'='.repeat(80)}\n`);
    const passed = await runTest(suite);
    
    if (!passed && suite.critical) {
      console.log(`\n⚠️  Critical test suite "${suite.name}" failed. Stopping execution.\n`);
      break;
    }
  }
  
  // Final summary
  console.log('\n' + '═'.repeat(80));
  console.log('📊 FINAL TEST SUMMARY');
  console.log('═'.repeat(80));
  console.log('\nTest Suite Results:\n');
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED';
    const critical = result.critical ? '[CRITICAL]' : '';
    console.log(`  ${status} ${critical} ${result.name}`);
  });
  
  console.log('\nOverall Statistics:');
  console.log(`  Total Suites: ${results.length}`);
  console.log(`  ✅ Passed: ${totalPassed}`);
  console.log(`  ❌ Failed: ${totalFailed}`);
  console.log(`  Success Rate: ${((totalPassed / results.length) * 100).toFixed(1)}%\n`);
  
  if (totalFailed > 0) {
    console.log('⚠️  TESTS FAILED - See details above\n');
    process.exit(1);
  } else {
    console.log('✅ ALL TESTS PASSED!\n');
    process.exit(0);
  }
}

runAllTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});

