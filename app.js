const { Actor } = require('apify');
const { CheerioCrawler } = require('crawlee');
const randomUserAgent = require('random-useragent');

(async () => {
    await Actor.init();

    const input = await Actor.getInput();
    console.log(JSON.stringify(input, null, 2));

    if (!input || !Array.isArray(input.startUrls) || input.startUrls.length === 0) {
        throw new Error('No valid Start URLs provided in the input.');
    }

    const { startUrls, removeDuplicates, proxyCountryCode } = input;

    const fiverrUrls = startUrls.map(item => item.url);
    const allScrapedGigs = [];

    const crawler = new CheerioCrawler({
        useSessionPool: true,
        persistCookiesPerSession: false,
        proxyConfiguration: await Actor.createProxyConfiguration({
            groups: ['RESIDENTIAL'],
            countryCode: proxyCountryCode ?? 'FR',
        }),
        requestHandlerTimeoutSecs: 60,
        preNavigationHooks: [
            async ({ request }) => {
                request.headers['User-Agent'] = randomUserAgent.getRandom() || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
                request.headers['Accept-Language'] = 'en-US,en;q=0.9';
                request.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
                request.headers['Connection'] = 'keep-alive';
                request.headers['Upgrade-Insecure-Requests'] = '1';
            }
        ],
        requestHandler: async ({ request, $ }) => {
            console.log(`Scraping: ${request.url}`);

            const gigCards = $('.gig-card-layout');
            const scrapedGigs = [];

            gigCards.each((index, gigCard) => {
                try {
                    const title = $(gigCard).find('p[role="heading"]').text().trim();
                    const gigUrl = "https://www.fiverr.com" + $(gigCard).find('a[aria-label="Go to gig"]').attr('href');
                    const sellerName = $(gigCard).find('.text-bold a').text().trim();
                    const sellerProfileUrl = "https://www.fiverr.com" + $(gigCard).find('.text-bold').attr('href');
                    const rating = $(gigCard).find('.rating-score').text().trim();
                    const reviews = $(gigCard).find('.rating-count-number').text().trim();
                    const price = $(gigCard).find('.text-bold span').last().text().trim();
                    const mediaType = $(gigCard).find('video').length ? 'Video' : 'Image';
                    const mediaUrl = mediaType === 'Video'
                        ? $(gigCard).find('video source').attr('src')
                        : $(gigCard).find('img').attr('src');

                    scrapedGigs.push({
                        title,
                        gigUrl,
                        sellerName,
                        sellerProfileUrl,
                        rating,
                        reviews,
                        price,
                        mediaType,
                        mediaUrl,
                        searchUrl: request.url,
                    });
                } catch (error) {
                    console.error('Error scraping gig card:', error.message);
                }
            });

            allScrapedGigs.push(...scrapedGigs);
        },
        failedRequestHandler({ request }) {
            console.error(`Failed to scrape ${request.url}`);
        },
    });

    await crawler.run(fiverrUrls);

    let finalGigs = allScrapedGigs;

    if (removeDuplicates) {
        console.log('Final gigs before removing duplicates:', allScrapedGigs.length);
        const uniqueGigUrls = new Set();
        finalGigs = allScrapedGigs.filter(gig => {
            if (uniqueGigUrls.has(gig.gigUrl)) {
                return false;
            }
            uniqueGigUrls.add(gig.gigUrl);
            return true;
        });
        console.log('Final gigs after removing duplicates:', finalGigs.length);
    }

    await Actor.pushData(finalGigs);
    await Actor.exit();
})();
