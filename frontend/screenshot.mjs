import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.type(), msg.text()));
page.on('pageerror', err => console.log('BROWSER_ERROR:', err.toString()));
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' }).catch(e => console.log('GOTO_ERROR:', e.message));
const content = await page.content();
console.log('HTML Length:', content.length);
if (content.length < 500) {
    console.log('HTML CONTENT:', content);
}
await browser.close();
