export function decodeDataParam(urlSearch) {
  const params = new URLSearchParams(urlSearch);
  return params.get('data');
}

export function decodeB64Param(urlSearch) {
  const params = new URLSearchParams(urlSearch);
  const b64 = params.get('b64');
  if (!b64) return null;
  return atob(b64);
}

export async function loadGist(gistId) {
  const response = await fetch(`https://api.github.com/gists/${gistId}`);
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  const data = await response.json();
  let htmlFileUrl = null;
  for (const file of Object.values(data.files)) {
    if (file.filename.endsWith('.html')) {
      htmlFileUrl = file.raw_url;
      break;
    }
  }
  if (!htmlFileUrl) {
    throw new Error('No HTML file found in Gist');
  }
  const rawResponse = await fetch(htmlFileUrl);
  if (!rawResponse.ok) {
    throw new Error(`Error fetching Gist raw content: ${rawResponse.status}`);
  }
  return await rawResponse.text();
}
