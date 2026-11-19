// Tests that need no database: they exercise routing and input rejection only.
import test from 'node:test';
import assert from 'node:assert/strict';
import app from './app.js';

const server = app.listen(0);
const base = () => `http://127.0.0.1:${server.address().port}`;
test.after(() => server.close());

test('health endpoint responds', async () => {
  const res = await fetch(`${base()}/api/health`);
  assert.equal(res.status, 200);
});

test('rejects an invalid status filter', async () => {
  const res = await fetch(`${base()}/api/appointments?status=Nope`);
  assert.equal(res.status, 400);
});

test('unknown route returns 404', async () => {
  const res = await fetch(`${base()}/api/nothing`);
  assert.equal(res.status, 404);
});
