const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

async function testSelenium() {
    let driver = null;

    try {
        // Set up Chrome options for WSL
        const options = new chrome.Options();
        options.setBinaryPath('/usr/bin/google-chrome'); // Path to the Chrome binary

        // Add required arguments for headless mode and WSL
        options.addArguments(
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-extensions',
            '--window-size=1920,1080'
        );

        // Use X11 DISPLAY for WSL (assuming you have Xming running)
        const display = process.env.DISPLAY || ':0';
        if (display) {
            options.addArguments(`--display=${display}`);
        } else {
            throw new Error("DISPLAY environment variable is not set. Ensure Xming is running.");
        }

        // Create WebDriver instance with chromedriver
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(new chrome.ServiceBuilder(chromedriver.path).setPort(9515))
            .build();

        // Open a webpage
        await driver.get('https://www.google.com');

        // Get the title of the page
        const title = await driver.getTitle();
        console.log('Page Title:', title);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}

testSelenium();

