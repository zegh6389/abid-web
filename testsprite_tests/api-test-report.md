# API Test Report - abid-web

**Generated:** 08/14/2025 18:22:43
**Base URL:** http://127.0.0.1:3000

## Summary

- Total Tests: 18
- Passed: 0
- Failed: 18  
- Success Rate: 0%
- Total Time: 203ms

## Test Results
- [FAIL] GET /api/health - Expected: 200, Got: ERROR (12ms)
- [FAIL] GET /api/products - Expected: 200, Got: ERROR (1ms)
- [FAIL] GET /api/products/999 - Expected: 404, Got: ERROR (1ms)
- [FAIL] GET /api/products/slug/non-existent - Expected: 404, Got: ERROR (1ms)
- [FAIL] GET /api/collections - Expected: 200, Got: ERROR (1ms)
- [FAIL] GET /api/collections/999 - Expected: 404, Got: ERROR (0ms)
- [FAIL] GET /api/orders - Expected: 200, Got: ERROR (1ms)
- [FAIL] GET /api/orders/999 - Expected: 404, Got: ERROR (1ms)
- [FAIL] GET /api/admin/me - Expected: 401, Got: ERROR (1ms)
- [FAIL] POST /api/admin/login - Expected: 400, Got: ERROR (20ms)
- [FAIL] GET /api/sentinel/status - Expected: 200, Got: ERROR (1ms)
- [FAIL] GET /api/db_off_sentinel_status - Expected: 200, Got: ERROR (0ms)
- [FAIL] POST /api/products - Expected: 401, Got: ERROR (42ms)
- [FAIL] POST /api/uploads/presign - Expected: 401, Got: ERROR (2ms)
- [FAIL] POST /api/orders - Expected: 400, Got: ERROR (1ms)
- [FAIL] POST /api/payments/checkout - Expected: 400, Got: ERROR (1ms)
- [FAIL] GET /api/products/999/reviews - Expected: 200, Got: ERROR (2ms)
- [FAIL] GET /api/cron/catalogSync - Expected: 200, Got: ERROR (2ms)

## Failed Test Details

### GET /api/health
- Expected: 200
- Actual: ERROR
- Time: 12ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### GET /api/products
- Expected: 200
- Actual: ERROR
- Time: 1ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### GET /api/products/999
- Expected: 404
- Actual: ERROR
- Time: 1ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### GET /api/products/slug/non-existent
- Expected: 404
- Actual: ERROR
- Time: 1ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### GET /api/collections
- Expected: 200
- Actual: ERROR
- Time: 1ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### GET /api/collections/999
- Expected: 404
- Actual: ERROR
- Time: 0ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### GET /api/orders
- Expected: 200
- Actual: ERROR
- Time: 1ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### GET /api/orders/999
- Expected: 404
- Actual: ERROR
- Time: 1ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### GET /api/admin/me
- Expected: 401
- Actual: ERROR
- Time: 1ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### POST /api/admin/login
- Expected: 400
- Actual: ERROR
- Time: 20ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### GET /api/sentinel/status
- Expected: 200
- Actual: ERROR
- Time: 1ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### GET /api/db_off_sentinel_status
- Expected: 200
- Actual: ERROR
- Time: 0ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### POST /api/products
- Expected: 401
- Actual: ERROR
- Time: 42ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### POST /api/uploads/presign
- Expected: 401
- Actual: ERROR
- Time: 2ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### POST /api/orders
- Expected: 400
- Actual: ERROR
- Time: 1ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### POST /api/payments/checkout
- Expected: 400
- Actual: ERROR
- Time: 1ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### GET /api/products/999/reviews
- Expected: 200
- Actual: ERROR
- Time: 2ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

### GET /api/cron/catalogSync
- Expected: 200
- Actual: ERROR
- Time: 2ms
- Error: A parameter cannot be found that matches parameter name 'SkipHttpErrorCheck'.

