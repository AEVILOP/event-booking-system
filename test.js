async function testAPI() {
  const API_URL = 'http://localhost:3000/api';
  console.log('--- Starting API Verification ---');

  // 1. Register Organizer
  console.log('1. Registering Organizer...');
  let res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice', email: 'alice@test.com', password: 'password123', role: 'organizer' })
  });
  let data = await res.json();
  console.log(data);

  // 2. Login Organizer
  console.log('2. Login Organizer...');
  res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alice@test.com', password: 'password123' })
  });
  data = await res.json();
  const orgToken = data.data ? data.data.token : null;
  console.log('Organizer Token:', orgToken ? 'Received' : 'Failed');

  // 3. Register Customer
  console.log('3. Registering Customer...');
  res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Bob', email: 'bob@test.com', password: 'password123', role: 'customer' })
  });
  data = await res.json();
  console.log(data);

  // 4. Login Customer
  console.log('4. Login Customer...');
  res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bob@test.com', password: 'password123' })
  });
  data = await res.json();
  const cusToken = data.data ? data.data.token : null;
  console.log('Customer Token:', cusToken ? 'Received' : 'Failed');

  // 5. Create Event (Organizer)
  console.log('5. Creating Event as Organizer...');
  res = await fetch(`${API_URL}/events`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${orgToken}` },
    body: JSON.stringify({ title: 'Tech Conference 2026', description: 'A great tech conference', date: '2026-10-01', total_tickets: 100 })
  });
  data = await res.json();
  const eventId = data.data ? data.data.eventId : null;
  console.log(data);

  // 6. Browse Events (Customer)
  console.log('6. Browse Events as Customer...');
  res = await fetch(`${API_URL}/events`, {
    method: 'GET', headers: { 'Authorization': `Bearer ${cusToken}` }
  });
  data = await res.json();
  console.log('Events Found:', data.data ? data.data.total : 0);

  // 7. Book Tickets (Customer)
  console.log('7. Book Tickets as Customer...');
  res = await fetch(`${API_URL}/bookings`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cusToken}` },
    body: JSON.stringify({ eventId, tickets: 2 })
  });
  data = await res.json();
  console.log(data);

  // Wait briefly for Task 1 Notification
  await new Promise(r => setTimeout(r, 1500)); 

  // 8. Update Event (Organizer)
  console.log('8. Updating Event as Organizer...');
  res = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${orgToken}` },
    body: JSON.stringify({ title: 'Tech Conference 2026 - Extended' })
  });
  data = await res.json();
  console.log(data);

  // Wait briefly for Task 2 Notification
  await new Promise(r => setTimeout(r, 1500));

  console.log('--- Verification Complete ---');
  process.exit();
}

testAPI().catch(console.error);
