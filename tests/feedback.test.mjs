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
