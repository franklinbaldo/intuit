import { decodeDataParam, decodeB64Param, loadGist } from '../utils.js';

describe('utils', () => {
  test('decodeDataParam extracts decoded HTML', () => {
    const result = decodeDataParam('?data=%3Ch1%3EHi%3C/h1%3E');
    expect(result).toBe('<h1>Hi</h1>');
  });

  test('decodeB64Param decodes base64 HTML', () => {
    const result = decodeB64Param('?b64=PGgxPkhlbGxvPC9oMT4=');
    expect(result).toBe('<h1>Hello</h1>');
  });

  test('loadGist fetches gist HTML', async () => {
    const gistId = '123';
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          files: { 'index.html': { filename: 'index.html', raw_url: 'raw_url' } }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('<div>Gist</div>')
      });

    const result = await loadGist(gistId);
    expect(fetch).toHaveBeenCalledWith(`https://api.github.com/gists/${gistId}`);
    expect(result).toBe('<div>Gist</div>');
  });
});
