
const gateway = require('./api/index.js');

async function testLocal() {
  console.log('=== TESTING LOCAL NODE GATEWAY ===');
  
  // Test 1: GET /api/toeic/questions
  const req1 = { method: 'GET', url: '/api/toeic/questions?mode=full' };
  const res1 = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(body) { console.log('1. /api/toeic/questions Response:', this.statusCode, body.success, 'Total Qs:', body.total_questions); return this; }
  };
  await gateway(req1, res1);

  // Test 2: POST /api/auth/login
  const req2 = { method: 'POST', url: '/api/auth/login', body: { password: '@Dmin123' } };
  const res2 = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(body) { console.log('2. /api/auth/login Response:', this.statusCode, body.success, 'Has Token:', !!body.token); return this; }
  };
  await gateway(req2, res2);
}

testLocal().catch(err => {
  console.error('LOCAL TEST CRASHED:', err);
  process.exit(1);
});
