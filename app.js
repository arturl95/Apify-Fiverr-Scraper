const { Actor } = require('apify');
const { PuppeteerCrawler } = require('crawlee');
const randomUserAgent = require('random-useragent');

(async () => {
    await Actor.init();

    const input = await Actor.getInput();
    console.log(JSON.stringify(input, null, 2));

    if (!input || !Array.isArray(input.startUrls) || input.startUrls.length === 0) {
        throw new Error('No valid Start URLs provided in the input.');
    }

    const { startUrls, proxyCountryCode } = input;

    const fiverrUrls = startUrls.map(item => item.url);
    const allScrapedGigs = [];

    const crawler = new PuppeteerCrawler({
        useSessionPool: true,
        proxyConfiguration: await Actor.createProxyConfiguration({
            groups: ['RESIDENTIAL'],
            countryCode: proxyCountryCode ?? 'FR',
        }),
        launchContext: {
            launchOptions: {
                headless: true,
            },
        },
        async requestHandler({ page, request }) {
            console.log(`Scraping: ${request.url}`);

            // Simulate scrolling to load results
            await page.goto(request.url, { waitUntil: 'domcontentloaded' });
            await page.setUserAgent(randomUserAgent.getRandom() || 'Mozilla/5.0');
            await page.setViewport({ width: 1280, height: 800 });

            let scrapedGigs = [];
            let startTime = Date.now();
            const maxScrollTime = 20000; // 20 seconds
            const maxResults = 50;

            while (Date.now() - startTime < maxScrollTime && scrapedGigs.length < maxResults) {
                // Scroll to the bottom
                const previousHeight = await page.evaluate(() => document.body.scrollHeight);
                await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                await page.waitForTimeout(2000); // Wait for content to load

                const newHeight = await page.evaluate(() => document.body.scrollHeight);
                if (newHeight === previousHeight) break;

                // Scrape gigs
                const newGigs = await page.$$eval('.gig-card-layout', (gigCards) =>
                    gigCards.map((gigCard) => {
                        try {
                            const titleElement = gigCard.querySelector('p[role="heading"]');
                            const title = titleElement ? titleElement.textContent.trim() : '';

                            const gigUrlElement = gigCard.querySelector('a[aria-label="Go to gig"]');
                            const gigUrl = gigUrlElement ? `https://www.fiverr.com${gigUrlElement.getAttribute('href')}` : '';

                            const sellerNameElement = gigCard.querySelector('.text-bold a');
                            const sellerName = sellerNameElement ? sellerNameElement.textContent.trim() : '';

                            const sellerProfileUrlElement = gigCard.querySelector('.text-bold a');
                            const sellerProfileUrl = sellerProfileUrlElement ? `https://www.fiverr.com${sellerProfileUrlElement.getAttribute('href')}` : '';

                            const ratingElement = gigCard.querySelector('.rating-score');
                            const rating = ratingElement ? ratingElement.textContent.trim() : '';

                            const reviewsElement = gigCard.querySelector('.rating-count-number');
                            const reviews = reviewsElement ? reviewsElement.textContent.trim() : '';

                            const priceElement = gigCard.querySelector('.text-bold span');
                            const price = priceElement ? priceElement.textContent.trim() : '';

                            const mediaType = gigCard.querySelector('video') ? 'Video' : 'Image';
                            const mediaUrl = mediaType === 'Video'
                                ? gigCard.querySelector('video source')?.getAttribute('src')
                                : gigCard.querySelector('img')?.getAttribute('src');

                            return {
                                title,
                                gigUrl,
                                sellerName,
                                sellerProfileUrl,
                                rating,
                                reviews,
                                price,
                                mediaType,
                                mediaUrl,
                            };
                        } catch (error) {
                            console.error('Error extracting gig data:', error.message);
                            return null;
                        }
                    }).filter(Boolean)
                );

                scrapedGigs = [...scrapedGigs, ...newGigs];

                // Stop if we reach 50 gigs
                if (scrapedGigs.length >= maxResults) break;
            }

            allScrapedGigs.push(...scrapedGigs.slice(0, maxResults)); // Ensure we only push up to maxResults
        },
        failedRequestHandler({ request }) {
            console.error(`Failed to scrape ${request.url}`);
        },
    });

    await crawler.run(fiverrUrls);

    await Actor.pushData(allScrapedGigs);
    await Actor.exit();
})();
