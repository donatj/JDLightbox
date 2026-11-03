const { existsSync } = require('node:fs');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright-core');

async function main() {
	const paths = [process.env.CHROME_BIN, '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
	const executablePath = paths.find(existsSync);
	if (!executablePath) throw new Error('Chrome or Chromium was not found. Set CHROME_BIN to its path.');
	const browser = await chromium.launch({ executablePath, headless: true });
	try {
		const page = await browser.newPage();
		await page.goto(pathToFileURL(resolve(__dirname, 'browser.html')).href);
		await page.waitForFunction(() => document.body.dataset.result);
		const result = await page.locator('body').getAttribute('data-result');
		if (result !== 'passed') throw new Error(await page.locator('body').textContent());
		console.log('Browser tests passed');
	} finally {
		await browser.close();
	}
}

main().catch(error => { console.error(error); process.exitCode = 1; });
