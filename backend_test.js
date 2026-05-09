/**
 * EMS Backend Comprehensive API Test Suite
 * Tests all endpoints: Auth, Events, Registrations, Participants, Dashboard, Scans, Custom Fields
 */

const BASE = 'http://localhost:5000/api';

let adminToken = '';
let verifierToken = '';
let createdEventId = '';
let createdRegistrationId = '';
let testPassNumber = '';
let testQrCode = '';

const results = [];
let passed = 0, failed = 0;

async function req(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  try {
    const r = await fetch(`${BASE}${path}`, opts);
    const json = await r.json();
    return { status: r.status, data: json };
  } catch (e) {
    return { status: 0, data: { error: e.message } };
  }
}

function test(name, status, data, expectOk = true) {
  const ok = expectOk ? (status >= 200 && status < 300) : (status >= 400 && status < 500);
  const icon = ok ? '✅' : '❌';
  const msg = `${icon} [${status}] ${name}`;
  results.push({ name, status, ok, data: JSON.stringify(data).slice(0, 120) });
  if (ok) passed++; else failed++;
  console.log(msg);
  if (!ok) console.log('   ↳ Response:', JSON.stringify(data).slice(0, 200));
}

// ─────────────────────────────────────────────
// 1. HEALTH CHECK
// ─────────────────────────────────────────────
async function testHealth() {
  console.log('\n═══ 1. HEALTH CHECK ═══');
  const { status, data } = await req('GET', '/health');
  test('GET /health - backend alive', status, data);
}

// ─────────────────────────────────────────────
// 2. AUTH ENDPOINTS
// ─────────────────────────────────────────────
async function testAuth() {
  console.log('\n═══ 2. AUTH ENDPOINTS ═══');

  // Admin login
  let r = await req('POST', '/auth/login', { email: 'admin@ems.com', password: 'admin123' });
  test('POST /auth/login - admin login', r.status, r.data);
  if (r.data?.success) adminToken = r.data.data.token;

  // Bad login
  r = await req('POST', '/auth/login', { email: 'admin@ems.com', password: 'wrongpass' });
  test('POST /auth/login - wrong password → 401', r.status, r.data, false);

  // Missing fields
  r = await req('POST', '/auth/login', { email: 'admin@ems.com' });
  test('POST /auth/login - missing password → 400', r.status, r.data, false);

  // Register a verifier
  const ts = Date.now();
  r = await req('POST', '/auth/register', {
    name: 'Test Verifier', email: `verifier_${ts}@test.com`,
    username: `verifier_${ts}`, password: 'pass123', role: 'verifier'
  });
  test('POST /auth/register - create verifier', r.status, r.data);
  if (r.data?.success) verifierToken = r.data.data.token;

  // Duplicate register
  r = await req('POST', '/auth/register', {
    name: 'Test Verifier', email: `verifier_${ts}@test.com`,
    username: `verifier2_${ts}`, password: 'pass123', role: 'verifier'
  });
  test('POST /auth/register - duplicate email → 409', r.status, r.data, false);

  // Invalid email
  r = await req('POST', '/auth/register', {
    name: 'Bad', email: 'not-an-email', password: 'pass123', role: 'verifier'
  });
  test('POST /auth/register - invalid email → 400', r.status, r.data, false);

  // Get profile
  r = await req('GET', '/auth/profile', null, adminToken);
  test('GET /auth/profile - authenticated', r.status, r.data);

  // No token
  r = await req('GET', '/auth/profile');
  test('GET /auth/profile - no token → 401', r.status, r.data, false);

  // List users (admin)
  r = await req('GET', '/auth/users', null, adminToken);
  test('GET /auth/users - admin list users', r.status, r.data);
}

// ─────────────────────────────────────────────
// 3. EVENT ENDPOINTS
// ─────────────────────────────────────────────
async function testEvents() {
  console.log('\n═══ 3. EVENT ENDPOINTS ═══');

  // List events (public)
  let r = await req('GET', '/events?page=1&pageSize=10');
  test('GET /events - list events (public)', r.status, r.data);

  // Create event (admin)
  const ts = Date.now();
  r = await req('POST', '/events', {
    event_name: `Test Event ${ts}`,
    description: 'Automated test event for backend validation',
    start_date_time: '2027-01-15T09:00:00Z',
    end_date_time: '2027-01-15T17:00:00Z',
    address: 'Test Venue, Mumbai',
    event_for: 'all',
    capacity: 100,
    entry_fee: 0,
    category: 'CONFERENCE',
    additional_info: 'Automated test',
    organizer_details: { name: 'Test Org', email: 'org@test.com', phone: '9876543210', role: 'Organizer' },
    registration_fields: [],
    success_page_config: {}
  }, adminToken);
  test('POST /events - create event (admin)', r.status, r.data);
  if (r.data?.success) createdEventId = r.data.data.event_id;

  // Create event without auth → 401
  r = await req('POST', '/events', { event_name: 'No Auth Event', description: 'x', start_date_time: '2027-01-15T09:00:00Z', end_date_time: '2027-01-15T17:00:00Z', address: 'x', event_for: 'all' });
  test('POST /events - no auth → 401', r.status, r.data, false);

  // Create event with missing fields → 400
  r = await req('POST', '/events', { description: 'Missing name' }, adminToken);
  test('POST /events - missing required fields → 400', r.status, r.data, false);

  // Create event with bad event_for
  r = await req('POST', '/events', {
    event_name: 'Bad Event', description: 'x', start_date_time: '2027-01-15T09:00:00Z',
    end_date_time: '2027-01-15T17:00:00Z', address: 'x', event_for: 'invalid_value'
  }, adminToken);
  test('POST /events - invalid event_for → 400', r.status, r.data, false);

  // Get single event
  if (createdEventId) {
    r = await req('GET', `/events/${createdEventId}`);
    test(`GET /events/${createdEventId} - get event by ID`, r.status, r.data);
  }

  // Get non-existent event
  r = await req('GET', '/events/999999');
  test('GET /events/999999 - not found → 404', r.status, r.data, false);

  // Update event
  if (createdEventId) {
    r = await req('PUT', `/events/${createdEventId}`, {
      event_name: `Updated Event ${ts}`,
      description: 'Updated description'
    }, adminToken);
    test(`PUT /events/${createdEventId} - update event`, r.status, r.data);
  }

  // Update event without auth → 401
  if (createdEventId) {
    r = await req('PUT', `/events/${createdEventId}`, { event_name: 'Hacked' });
    test('PUT /events/:id - no auth → 401', r.status, r.data, false);
  }
}

// ─────────────────────────────────────────────
// 4. REGISTRATION ENDPOINTS
// ─────────────────────────────────────────────
async function testRegistrations() {
  console.log('\n═══ 4. REGISTRATION ENDPOINTS ═══');

  if (!createdEventId) {
    console.log('   ⚠ Skipping registration tests - no event created');
    return;
  }

  const ts = Date.now();
  // Register a participant
  let r = await req('POST', '/registrations', {
    participant_name: 'API Test User',
    participant_email: `apitest_${ts}@test.com`,
    participant_phone: '9876543210',
    event_id: createdEventId,
    organization: 'Test Corp',
    designation: 'QA Engineer'
  });
  test('POST /registrations - register participant', r.status, r.data);
  if (r.data?.success) {
    createdRegistrationId = r.data.data.registration_id;
    testPassNumber = r.data.data.pass_number;
    testQrCode = r.data.data.qr_code;
  }

  // Duplicate registration → 400
  r = await req('POST', '/registrations', {
    participant_name: 'API Test User',
    participant_email: `apitest_${ts}@test.com`,
    participant_phone: '9876543210',
    event_id: createdEventId
  });
  test('POST /registrations - duplicate → 400', r.status, r.data, false);

  // Get all registrations
  r = await req('GET', '/registrations');
  test('GET /registrations - list all registrations', r.status, r.data);

  // Get event registrations
  r = await req('GET', `/registrations/event/${createdEventId}`);
  test(`GET /registrations/event/${createdEventId} - event registrations`, r.status, r.data);

  // Update registration status
  if (createdRegistrationId) {
    r = await req('PATCH', `/registrations/${createdRegistrationId}/status`, { status: 'approved' });
    test(`PATCH /registrations/${createdRegistrationId}/status - approve`, r.status, r.data);
  }

  // Invalid status → 400
  if (createdRegistrationId) {
    r = await req('PATCH', `/registrations/${createdRegistrationId}/status`, { status: 'invalid_status' });
    test('PATCH /registrations/:id/status - invalid status → 400', r.status, r.data, false);
  }
}

// ─────────────────────────────────────────────
// 5. PARTICIPANTS ENDPOINT
// ─────────────────────────────────────────────
async function testParticipants() {
  console.log('\n═══ 5. PARTICIPANT ENDPOINTS ═══');

  // Create participant
  const ts = Date.now();
  let r = await req('POST', '/participants', {
    name: 'Direct Participant',
    email: `direct_${ts}@test.com`,
    phone: '9123456789'
  });
  test('POST /participants - create participant', r.status, r.data);

  // Duplicate → 200 (returns existing)
  r = await req('POST', '/participants', {
    name: 'Direct Participant',
    email: `direct_${ts}@test.com`,
    phone: '9123456789'
  });
  test('POST /participants - duplicate returns existing 200', r.status, r.data);

  // Invalid email → 400
  r = await req('POST', '/participants', { name: 'Bad', email: 'not-valid', phone: '1234567890' });
  test('POST /participants - invalid email → 400', r.status, r.data, false);
}

// ─────────────────────────────────────────────
// 6. DASHBOARD ENDPOINT
// ─────────────────────────────────────────────
async function testDashboard() {
  console.log('\n═══ 6. DASHBOARD ENDPOINT ═══');

  // With admin token
  let r = await req('GET', '/dashboard', null, adminToken);
  test('GET /dashboard - admin stats', r.status, r.data);
  if (r.data?.success) {
    const s = r.data.data.summary;
    console.log(`   📊 Summary: Events=${s.total_events}, Reg=${s.total_registrations}, Scans=${s.total_scans}, Users=${s.total_users}`);
  }

  // Without token → 401
  r = await req('GET', '/dashboard');
  test('GET /dashboard - no auth → 401', r.status, r.data, false);

  // With verifier token → 403 (admin only)
  if (verifierToken) {
    r = await req('GET', '/dashboard', null, verifierToken);
    test('GET /dashboard - verifier token → 403', r.status, r.data, false);
  }
}

// ─────────────────────────────────────────────
// 7. SCAN / QR ENDPOINT
// ─────────────────────────────────────────────
async function testScans() {
  console.log('\n═══ 7. SCAN ENDPOINTS ═══');

  // No QR code → 400
  let r = await req('POST', '/scans', {}, verifierToken || adminToken);
  test('POST /scans - missing QR code → 400', r.status, r.data, false);

  // Invalid QR code → 400
  r = await req('POST', '/scans', { qr_code: 'INVALID_CODE_123' }, verifierToken || adminToken);
  test('POST /scans - invalid QR → 400', r.status, r.data, false);

  // No auth → 401
  r = await req('POST', '/scans', { qr_code: testQrCode || 'someqr' });
  test('POST /scans - no auth → 401', r.status, r.data, false);

  // Valid scan (with approved registration)
  if (testQrCode && (verifierToken || adminToken)) {
    r = await req('POST', '/scans', { qr_code: testQrCode }, verifierToken || adminToken);
    // Should be valid (we approved the registration above)
    test('POST /scans - valid QR scan', r.status, r.data);
    if (r.data?.success) console.log(`   📋 Scan status: ${r.data.data.status} - ${r.data.data.message}`);

    // Duplicate scan
    r = await req('POST', '/scans', { qr_code: testQrCode }, verifierToken || adminToken);
    test('POST /scans - duplicate scan (still 200)', r.status, r.data);
    if (r.data?.success) console.log(`   📋 Duplicate status: ${r.data.data.status}`);
  }

  // Scan by pass number
  if (testPassNumber && (verifierToken || adminToken)) {
    r = await req('POST', '/scans', { qr_code: testPassNumber }, verifierToken || adminToken);
    test('POST /scans - scan by pass number', r.status, r.data);
  }
}

// ─────────────────────────────────────────────
// 8. CUSTOM FIELDS ENDPOINT
// ─────────────────────────────────────────────
async function testCustomFields() {
  console.log('\n═══ 8. CUSTOM FIELDS ENDPOINTS ═══');

  if (!createdEventId) {
    console.log('   ⚠ Skipping - no event created');
    return;
  }

  // Get custom fields for event
  let r = await req('GET', `/custom-fields/event/${createdEventId}`);
  test(`GET /custom-fields/event/${createdEventId} - list fields`, r.status, r.data);

  // Create custom field (admin)
  r = await req('POST', `/custom-fields/event/${createdEventId}`, {
    field_name: 'Company Name',
    field_type: 'text',
    required: true
  }, adminToken);
  test('POST /custom-fields/event/:id - create field', r.status, r.data);

  // Invalid field type → 400
  r = await req('POST', `/custom-fields/event/${createdEventId}`, {
    field_name: 'Invalid Field',
    field_type: 'invalid_type',
    required: false
  }, adminToken);
  test('POST /custom-fields/event/:id - invalid type → 400', r.status, r.data, false);
}

// ─────────────────────────────────────────────
// 9. EVENT DELETE (cleanup)
// ─────────────────────────────────────────────
async function testEventDelete() {
  console.log('\n═══ 9. EVENT DELETE (cleanup) ═══');

  if (!createdEventId) return;

  // Verifier cannot delete → 403
  if (verifierToken) {
    let r = await req('DELETE', `/events/${createdEventId}`, null, verifierToken);
    test(`DELETE /events/${createdEventId} - verifier → 403`, r.status, r.data, false);
  }

  // Admin can delete
  let r = await req('DELETE', `/events/${createdEventId}`, null, adminToken);
  test(`DELETE /events/${createdEventId} - admin soft delete`, r.status, r.data);

  // Verify event is gone (soft deleted)
  r = await req('GET', `/events/${createdEventId}`);
  test(`GET /events/${createdEventId} - after delete → 404`, r.status, r.data, false);
}

// ─────────────────────────────────────────────
// 10. USER MANAGEMENT (cleanup)
// ─────────────────────────────────────────────
async function testUserManagement() {
  console.log('\n═══ 10. USER MANAGEMENT ═══');

  // List users
  let r = await req('GET', '/auth/users', null, adminToken);
  test('GET /auth/users - list all users', r.status, r.data);

  // Assign events to verifier (get verifier user_id first)
  if (r.data?.success && createdEventId) {
    const users = r.data.data;
    const verifier = users.find(u => u.role_name === 'verifier');
    if (verifier) {
      const evR = await req('PATCH', `/auth/users/${verifier.user_id}/events`, 
        { eventIds: [1, 2] }, adminToken);
      test(`PATCH /auth/users/${verifier.user_id}/events - assign events`, evR.status, evR.data);
    }
  }
}

// ─────────────────────────────────────────────
// MAIN RUNNER
// ─────────────────────────────────────────────
async function run() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   EMS BACKEND FULL API TEST SUITE            ║');
  console.log('║   Testing: http://localhost:5000/api         ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`   Started at: ${new Date().toLocaleTimeString()}\n`);

  await testHealth();
  await testAuth();
  await testEvents();
  await testRegistrations();
  await testParticipants();
  await testDashboard();
  await testScans();
  await testCustomFields();
  await testUserManagement();
  await testEventDelete();

  // ── SUMMARY ──
  const total = passed + failed;
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║                 TEST SUMMARY                 ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Total Tests : ${String(total).padEnd(28)}║`);
  console.log(`║  ✅ Passed   : ${String(passed).padEnd(28)}║`);
  console.log(`║  ❌ Failed   : ${String(failed).padEnd(28)}║`);
  console.log('╚══════════════════════════════════════════════╝');

  if (failed > 0) {
    console.log('\n🔴 FAILED TESTS:');
    results.filter(r => !r.ok).forEach(r => {
      console.log(`  ❌ [${r.status}] ${r.name}`);
      console.log(`       ${r.data}`);
    });
  }

  console.log(`\nFinal: ${failed === 0 ? '🟢 ALL TESTS PASSED' : `🔴 ${failed} TEST(S) FAILED`}`);
}

run().catch(console.error);
