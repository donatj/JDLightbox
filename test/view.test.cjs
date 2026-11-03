const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../lib/jdlightbox.js'), 'utf8');
const { adjacentIndex, lightboxView } = vm.runInNewContext(`${source}\n({ adjacentIndex, lightboxView })`);

test('navigation stays within the gallery', () => {
	assert.equal(adjacentIndex(0, 3, -1), null);
	assert.equal(adjacentIndex(0, 3, 1), 1);
	assert.equal(adjacentIndex(2, 3, 1), null);
	assert.equal(adjacentIndex(-1, 3, 1), null);
	assert.equal(adjacentIndex(3, 3, -1), null);
});

test('view state uses the title or thumbnail and describes available navigation', () => {
	const item = { href: '/image.jpg', title: 'Title', thumbnailAlt: 'Thumbnail', isFrame: false };
	const first = lightboxView(item, 0, 2);
	assert.equal(first.title, 'Title');
	assert.equal(first.href, '/image.jpg');
	assert.equal(first.showNavigation, true);
	assert.equal(first.canGoPrevious, false);
	assert.equal(first.canGoNext, true);

	const only = lightboxView({ ...item, title: '', isFrame: true }, 0, 1);
	assert.equal(only.title, 'Thumbnail');
	assert.equal(only.isFrame, true);
	assert.equal(only.showNavigation, false);
	assert.equal(only.canGoPrevious, false);
	assert.equal(only.canGoNext, false);
	assert.equal(item.title, 'Title');
});
