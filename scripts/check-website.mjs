#!/usr/bin/env node
// Website-only checks. No account, cloud configuration or application mutations.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../website');
const names = ['index.html', 'privacy.html', 'terms.html', 'support.html'];
const failures = [];
const drafts = [];
function check(condition, message) {
  if (!condition) failures.push(message);
}
function inspect(html, name, isLive = false) {
  check(/<html\s+lang="en"/i.test(html), name + ': language metadata missing');
  check(/name="viewport"/i.test(html), name + ': mobile viewport missing');
  check(/<title>[^<]+<\/title>/i.test(html), name + ': page title missing');
  for (const target of ['privacy.html', 'terms.html', 'support.html']) {
    check(html.includes('href="./' + target + '"'), name + ': missing ' + target + ' link');
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  check(new Set(ids).size === ids.length, name + ': duplicate IDs');
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
    check(ids.includes(id), name + ': missing section ' + id);
  }
  if (name !== 'index.html') {
    check(html.includes('mailto:gara.support@gmail.com'), name + ': contact missing');
    check(!/<form\b|type="password"/i.test(html), name + ': unexpected sign-in form');
  }
  if (name === 'privacy.html' || name === 'terms.html') {
    check(html.includes('Daniel Roci'), name + ': operator missing');
    check(html.includes('18'), name + ': age policy missing');
    if (/not yet effective|draft for .*review/i.test(html)) drafts.push((isLive ? 'live ' : '') + name);
  }
}

for (const name of names) {
  const html = readFileSync(path.join(root, name), 'utf8');
  inspect(html, name);
  const canonical = name === 'index.html' ? 'https://drivegara.com/' : 'https://drivegara.com/' + name;
  check(html.includes('rel="canonical" href="' + canonical + '"'), name + ': canonical URL mismatch');
  for (const [, value] of html.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) {
    for (const part of value.split(',')) {
      const relative = part.trim().split(/\s+/)[0];
      if (!relative.startsWith('./')) continue;
      const file = relative.split(/[?#]/)[0];
      check(existsSync(path.resolve(root, file)), name + ': missing file ' + file);
    }
  }
}

if (process.argv.includes('--live')) {
  for (const name of names) {
    const url = name === 'index.html' ? 'https://drivegara.com/' : 'https://drivegara.com/' + name;
    try {
      // No cookies, credentials or stored browser session.
      const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
      console.log(name + ': HTTPS ' + response.status);
      check(response.status === 200, name + ': public HTTP status ' + response.status);
      check(new URL(response.url).origin === 'https://drivegara.com', name + ': unexpected redirect origin');
      check((response.headers.get('content-type') || '').includes('text/html'), name + ': not HTML');
      if (response.status === 200) inspect(await response.text(), name, true);
    } catch (error) {
      failures.push(name + ': public request failed (' + error.name + ')');
    }
  }
}
for (const failure of failures) console.error('FAIL: ' + failure);
console.log(failures.length ? 'Website technical checks failed.' : 'Website static technical checks passed.');
if (drafts.length) console.log('NOT FINAL: draft policies remain: ' + [...new Set(drafts)].join(', '));
console.log('These checks do not verify legal correctness, mobile rendering, domain ownership or store acceptance.');
process.exitCode = failures.length ? 1 : 0;
