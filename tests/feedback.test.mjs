// node --test tests/feedback.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../functions/api/feedback.js';

test('validate feedback input', () => {
  assert.deepEqual(validate({ type: 'idea', message: '  อยากได้โหมดมืด  ' }), {
    type: 'idea', message: 'อยากได้โหมดมืด', contact: null,
  });
  assert.equal(validate({ type: 'x', message: 'hello there' }).error, 'type');
  assert.equal(validate({ type: 'bug', message: 'hi' }).error, 'message');
  assert.equal(validate({ type: 'bug', message: 'a'.repeat(1001) }).error, 'message');
  assert.equal(validate({ type: 'bug', message: 'hello there', contact: 'c'.repeat(121) }).error, 'contact');
  assert.equal(validate({ type: 'bug', message: 'hello there', website: 'spam.com' }).spam, true);
  assert.equal(validate(null).error, 'bad_request');
});

import { authorized } from '../functions/api/admin/_middleware.js';
const req = (h) => ({ headers: new Headers(h ? { authorization: h } : {}) });

test('admin auth', () => {
  const env = { ADMIN_TOKEN: 'x'.repeat(24) };
  assert.equal(authorized(req('Bearer ' + 'x'.repeat(24)), env), true);
  assert.equal(authorized(req('Bearer ' + 'x'.repeat(23) + 'y'), env), false);
  assert.equal(authorized(req('Bearer short'), env), false);
  assert.equal(authorized(req(), env), false);
  assert.equal(authorized(req('Bearer '), { ADMIN_TOKEN: '' }), false); // unset secret never opens it
  assert.equal(authorized(req('Bearer abc'), { ADMIN_TOKEN: 'abc' }), false); // too-short secret stays locked
});
