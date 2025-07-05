const { test } = require('node:test');
const assert = require('node:assert/strict');
const { decodeBase64, renderHTML } = require('../utils');

test('decodeBase64 decodes Base64 strings', () => {
  const input = 'PGgxPkhlbGxvPC9oMT4='; // <h1>Hello</h1>
  const expected = '<h1>Hello</h1>';
  assert.strictEqual(decodeBase64(input), expected);
});

test('renderHTML writes HTML to provided document', () => {
  const doc = {
    content: '',
    open(){ this.content = ''; },
    write(str){ this.content += str; },
    close(){}
  };
  renderHTML(doc, '<p>Test</p>');
  assert.strictEqual(doc.content, '<p>Test</p>');
});
