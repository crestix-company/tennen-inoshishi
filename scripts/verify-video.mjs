import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const video = html.match(/<video\b[^>]*id="introduction-video"[^>]*>/)?.[0];
assert(video, 'Introduction video exists');
for (const attribute of ['controls', 'playsinline', 'preload="none"', 'width="360"', 'height="640"', 'poster="media/tennen-inoshishi-poster.jpg"']) assert(video.includes(attribute), attribute);
assert(!/\b(autoplay|loop)\b/.test(video), 'No automatic playback');
assert(html.indexOf('id="hero"') < html.indexOf('id="movie"'));
assert(html.indexOf('id="movie"') < html.indexOf('id="concept"'));
assert(html.includes('type="video/mp4"'));
assert(html.includes('<source src="https://crestix-company.github.io/tennen-inoshishi/media/tennen-inoshishi-introduction.mp4"'), 'Use the byte-range-capable video host');
assert(html.includes('id="movie-start"'));
assert(html.includes('id="movie-error"'));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'IDs are unique');
let checked = 0;
for (const [, reference] of html.matchAll(/\b(?:src|href|poster|srcset)="([^"]+)"/g)) {
    if (/^(?:https?:|tel:|data:)/.test(reference)) continue;
    if (reference.startsWith('#')) {
        if (reference.length > 1) assert(ids.includes(reference.slice(1)), reference);
    } else {
        assert(!reference.startsWith('/'), 'Assets work under the GitHub Pages path prefix');
        const path = resolve(root, reference);
        assert(path.startsWith(root.endsWith(sep) ? root : root + sep));
        assert((await stat(path)).size > 0, reference);
    }
    checked++;
}
const media = await readFile(resolve(root, 'media/tennen-inoshishi-introduction.mp4'));
assert(media.length < 5 * 1024 * 1024, 'Video remains suitable for the lightweight inline player');
assert(media.includes(Buffer.from('avc1')), 'H.264 video');
assert(media.includes(Buffer.from('mp4a')), 'AAC audio');
const css = await readFile(resolve(root, 'style.css'), 'utf8');
assert(css.includes('object-fit: contain;'));
assert(css.includes('.movie-start[hidden]'));
const script = await readFile(resolve(root, 'script.js'), 'utf8');
const videoSetup = script.slice(script.indexOf('    // Load the introduction'), script.indexOf('    // ====================================\n    // Hamburger'));
assert(videoSetup.includes('movieStart.addEventListener'), 'Video setup found for behavior tests');
for (const failure of [null, 'AbortError', 'NotSupportedError']) {
    const handlers = new Map();
    const videoHandlers = new Map();
    const start = { hidden: true, addEventListener: (name, handler) => handlers.set(name, handler) };
    const error = { hidden: true };
    const player = {
        controls: true,
        play: async () => { if (failure) throw { name: failure }; },
        pause() {}, focus() {},
        addEventListener: (name, handler) => videoHandlers.set(name, handler),
        querySelector: () => ({ addEventListener() {} })
    };
    const elements = { 'introduction-video': player, 'movie-start': start, 'movie-error': error };
    runInNewContext(videoSetup, { document: { getElementById: id => elements[id], addEventListener() {} } });
    assert.equal(start.hidden, false);
    assert.equal(player.controls, false);
    await handlers.get('click')();
    assert.equal(player.controls, true);
    assert.equal(error.hidden, failure !== 'NotSupportedError', `${failure}: expected loading message state`);
    assert.equal(start.hidden, failure !== 'NotSupportedError');
    videoHandlers.get('play')();
    assert.equal(error.hidden, true, 'Successful playback clears earlier error');
}
console.log(`PASS: video placement, manual inline playback, H.264/AAC, ${checked} local references and responsive player styles.`);
console.log('PASS: playback success, intentional pause cancellation, load failure and recovery.');
