/**
 * Comprehensive API Test Suite for abid-web
 * Tests all backend endpoints with proper error handling
 */

import fetch from 'node-fetch';
import fs from 'fs';

const API_BASE = 'http://127.0.0.1:3000';

class APITester {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async test(name, method, endpoint, body = null, expectedStatus = 200) {
    const url = `${API_BASE}${endpoint}`;
    const start = Date.now();
    
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'API-Test-Suite/1.0'
        }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(url, options);
      const responseTime = Date.now() - start;
      const responseBody = await response.text();
      
      let parsedBody;
      try {
        parsedBody = JSON.parse(responseBody);
      } catch {
        parsedBody = responseBody;
      }
      
      const result = {
        name,
        method,
        endpoint,
        url,
        status: response.status,
        expectedStatus,
        responseTime: `${responseTime}ms`,
        success: response.status === expectedStatus,
        response: parsedBody,
        headers: Object.fromEntries(response.headers.entries())
      };
      
      this.results.push(result);
      
      const status = result.success ? '✅' : '❌';
      const statusText = result.success ? 'PASS' : 'FAIL';
      console.log(`${status} ${statusText} | ${method} ${endpoint} | ${response.status} | ${responseTime}ms`);
      
      return result;
    } catch (error) {
      const responseTime = Date.now() - start;
      const result = {
        name,
        method,
        endpoint,
        url,
        status: 'ERROR',
        expectedStatus,
        responseTime: `${responseTime}ms`,
        success: false,
        error: error.message,
        response: null
      };
      
      this.results.push(result);
      console.log(`❌ ERROR | ${method} ${endpoint} | ${error.message} | ${responseTime}ms`);
      return result;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting API Test Suite for abid-web\n');
    
    // Health Check
    await this.test('Health Check', 'GET', '/api/health');
    
    // Products API
    await this.test('List Products', 'GET', '/api/products');
    await this.test('Get Non-existent Product', 'GET', '/api/products/999', null, 404);
    await this.test('Get Non-existent Product by Slug', 'GET', '/api/products/slug/non-existent', null, 404);
    
    // Collections API  
    await this.test('List Collections', 'GET', '/api/collections');
    await this.test('Get Non-existent Collection', 'GET', '/api/collections/999', null, 404);
    
    // Orders API
    await this.test('List Orders', 'GET', '/api/orders');
    await this.test('Get Non-existent Order', 'GET', '/api/orders/999', null, 404);
    
    // Admin Auth (should fail without credentials)
    await this.test('Admin Me (No Auth)', 'GET', '/api/admin/me', null, 401);
    await this.test('Admin Login (No Credentials)', 'POST', '/api/admin/login', {}, 400);
    
    // Sentinel APIs
    await this.test('Sentinel Status', 'GET', '/api/sentinel/status');
    await this.test('DB Off Sentinel Status', 'GET', '/api/db_off_sentinel_status');
    
    // Protected endpoints (should return 401/403 without auth)
    await this.test('Create Product (No Auth)', 'POST', '/api/products', { title: 'Test Product' }, 401);
    await this.test('Uploads Presign (No Auth)', 'POST', '/api/uploads/presign', { filename: 'test.jpg' }, 401);
    await this.test('Update Non-existent Variant (No Auth)', 'PATCH', '/api/variants/999', {}, 401);
    await this.test('Delete Non-existent Media (No Auth)', 'DELETE', '/api/media/999', null, 401);
    
    // Test order creation with invalid data
    await this.test('Create Order (Invalid Data)', 'POST', '/api/orders', { invalid: 'data' }, 400);
    
    // Test payment checkout with invalid data
    await this.test('Payment Checkout (Invalid Data)', 'POST', '/api/payments/checkout', { invalid: 'data' }, 400);
    
    // Test reviews for non-existent product
    await this.test('Get Reviews (Non-existent Product)', 'GET', '/api/products/999/reviews');
    await this.test('Create Review (Invalid Data)', 'POST', '/api/products/999/reviews', { invalid: 'data' }, 400);
    
    // Test internal endpoints
    await this.test('Internal Create Supplier Order', 'POST', '/api/internal/create-supplier-order', { orderId: 999 }, 500);
    
    // Test cron endpoint
    await this.test('Cron Catalog Sync', 'GET', '/api/cron/catalogSync');
    
    // Test webhooks (should require auth or special headers)
    await this.test('Modalyst Webhook (No Auth)', 'POST', '/api/webhooks/modalyst', {}, 401);
    await this.test('Spocket Webhook (No Auth)', 'POST', '/api/webhooks/spocket', {}, 401);
    await this.test('AutoDS Webhook (No Auth)', 'POST', '/api/webhooks/autods', {}, 401);
    
    this.generateReport();
  }
  
  generateReport() {
    const totalTime = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const total = this.results.length;
    
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`🕐 Total Time: ${totalTime}ms`);
    console.log(`📈 Success Rate: ${((passed/total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.filter(r => !r.success).forEach(result => {
        console.log(`- ${result.method} ${result.endpoint}: Expected ${result.expectedStatus}, got ${result.status}`);
        if (result.error) {
          console.log(`  Error: ${result.error}`);
        }
      });
    }
    
    // Generate markdown report
    this.saveMarkdownReport();
  }
  
  saveMarkdownReport() {
    const totalTime = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const total = this.results.length;
    
    let markdown = `# API Test Report - abid-web\n\n`;
    markdown += `**Generated:** ${new Date().toISOString()}\n`;
    markdown += `**Base URL:** ${API_BASE}\n\n`;
    
    markdown += `## Summary\n\n`;
    markdown += `| Metric | Value |\n`;
    markdown += `|--------|-------|\n`;
    markdown += `| Total Tests | ${total} |\n`;
    markdown += `| ✅ Passed | ${passed} |\n`;
    markdown += `| ❌ Failed | ${failed} |\n`;
    markdown += `| Success Rate | ${((passed/total) * 100).toFixed(1)}% |\n`;
    markdown += `| Total Time | ${totalTime}ms |\n\n`;
    
    markdown += `## Test Results\n\n`;
    markdown += `| Status | Method | Endpoint | Expected | Actual | Time | Response |\n`;
    markdown += `|--------|--------|----------|----------|---------|------|----------|\n`;
    
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const response = typeof result.response === 'object' 
        ? JSON.stringify(result.response).substring(0, 100) + '...'
        : String(result.response).substring(0, 100);
      
      markdown += `| ${status} | ${result.method} | ${result.endpoint} | ${result.expectedStatus} | ${result.status} | ${result.responseTime} | ${response} |\n`;
    });
    
    if (failed > 0) {
      markdown += `\n## Failed Tests Details\n\n`;
      this.results.filter(r => !r.success).forEach(result => {
        markdown += `### ${result.method} ${result.endpoint}\n\n`;
        markdown += `- **Expected Status:** ${result.expectedStatus}\n`;
        markdown += `- **Actual Status:** ${result.status}\n`;
        markdown += `- **Response Time:** ${result.responseTime}\n`;
        if (result.error) {
          markdown += `- **Error:** ${result.error}\n`;
        }
        if (result.response) {
          markdown += `- **Response:** \`\`\`json\n${JSON.stringify(result.response, null, 2)}\n\`\`\`\n`;
        }
        markdown += `\n`;
      });
    }
    
    // Save to file
    fs.writeFileSync('testsprite_tests/api-test-report.md', markdown);
    console.log('\n📝 Detailed report saved to: testsprite_tests/api-test-report.md');
  }
}

// Run the tests
const tester = new APITester();
tester.runAllTests().catch(console.error);
