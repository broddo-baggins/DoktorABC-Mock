# DoktorABC Mock - Test Suite

## Overview

This directory contains the comprehensive test suite for the DoktorABC Mock application. The tests are organized into 5 categories covering all aspects of the application.

## Test Files

- `smoke-tests.js` - Critical functionality verification (11 tests)
- `sanity-tests.js` - Core feature validation (16 tests)
- `positive-tests.js` - Happy path scenarios (21 tests)
- `negative-tests.js` - Error handling & security (20 tests)
- `regression-tests.js` - Feature regression prevention (50+ tests)
- `run-all-tests.js` - Master test runner

## Running Tests

```bash
# From project root:

# Run all tests
npm test

# Run individual suites
npm run test:smoke
npm run test:sanity
npm run test:positive
npm run test:negative
npm run test:regression
```

## Test Coverage

### Smoke Tests (11 tests, ~5s)
✅ Application entry points exist  
✅ Critical pages load  
✅ Core routes defined  
✅ Essential components exist  
✅ Auth context configured  
✅ Data files valid  

### Sanity Tests (16 tests, ~10s)
✅ Public routes accessible  
✅ Protected routes secured  
✅ Navigation links work  
✅ Authentication functional  
✅ Data management works  
✅ Key pages render  

### Positive Tests (21 tests, ~12s)
✅ Valid routes accessible  
✅ Authentication succeeds  
✅ Treatment browsing works  
✅ Role-based access correct  
✅ Data structures valid  
✅ UI components functional  

### Negative Tests (20 tests, ~10s)
✅ Unauthorized access prevented  
✅ Role escalation blocked  
✅ Invalid routes handled  
✅ Missing data managed  
✅ Input validation exists  
✅ Security measures in place  

### Regression Tests (50+ tests, ~15s)
✅ All routes exist  
✅ Navigation links intact  
✅ Authentication works  
✅ Data structures consistent  
✅ Components present  
✅ No features broken  

## Exit Codes

- `0` = All tests passed
- `1` = One or more tests failed

## CI/CD Integration

These tests are designed to run in CI/CD pipelines:

```yaml
- name: Run Tests
  run: npm test
```

## Documentation

See the main README.md for complete testing documentation including:
- Detailed test descriptions
- User stories covered
- When to run each test suite
- Best practices
- CI/CD integration examples

## Current Status

✅ All 118 tests passing  
✅ 100% success rate  
✅ Ready for production

