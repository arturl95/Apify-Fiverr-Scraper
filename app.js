const { Actor } = require('apify');
const { CheerioCrawler } = require('crawlee');
const randomUserAgent = require('random-useragent');

(async () => {
    await Actor.init();

    // Get input from the Apify Actor
    const input = await Actor.getInput();
    console.log('Input received:', JSON.stringify(input, null, 2));

    if (!input || !Array.isArray(input.startUrls) || input.startUrls.length === 0) {
        throw new Error('No valid Start URLs provided in the input.');
    }

    const { startUrls } = input;
    const allScrapedGigs = [];

    // Configure the CheerioCrawler
    const crawler = new CheerioCrawler({
        maxRequestRetries: 10,
        useSessionPool: true,
        persistCookiesPerSession: false,
        proxyConfiguration: await Actor.createProxyConfiguration({
        groups: ['RESIDENTIAL'], // Use Apify's residential proxy group
        countryCode: input.proxyCountryCode || 'US',
    }),

        requestHandler: async ({ request, $ }) => {
            console.log(`Scraping: ${request.url}`);

            // Find the <script> tag containing the items array
            let items = [];
            $('script').each((index, element) => {
                const scriptContent = $(element).html();
                if (scriptContent && scriptContent.includes('"gigId"')) {
                    try {
                        const startIndex = scriptContent.indexOf('{');
                        const endIndex = scriptContent.lastIndexOf('}');
                        const jsonString = scriptContent.substring(startIndex, endIndex + 1);

                        const jsonData = JSON.parse(jsonString);
                        if (jsonData.items) {
                            items = jsonData.items;
                        }
                    } catch (error) {
                        console.error('Error parsing JSON:', error.message);
                    }
                }
            });

            if (!items.length) {
                console.error('No items found in the page.');
                return;
            }

            // Process and store gig details
            const gigs = items.map(item => ({
                gigId: item.gigId,
                title: item.title,
                sellerName: item.seller_name,
                sellerProfileUrl: `https://www.fiverr.com${item.seller_url}`,
                sellerCountry: item.seller_country || 'N/A',
                sellerLevel: item.seller_level || 'N/A',
                rating: item.seller_rating?.score || 'N/A',
                reviews: item.seller_rating?.count || 0,
                price: item.packages?.recommended?.price || 'N/A',
                isPro: item.is_pro || false,
                isFiverrChoice: item.is_fiverr_choice || false,
                metadata: item.metadata?.map(meta => ({
                    type: meta.type,
                    value: meta.value,
                })) || [],
                mediaAssets: item.assets?.map(asset => ({
                    type: asset.type,
                    url: asset.cloud_img_main_gig || 'N/A',
                })) || [],
                attachments: item.attachments?.map(attachment => ({
                    imageUrl: attachment.image_url || 'N/A',
                    streamUrl: attachment.stream_url || 'N/A',
                })) || [],
                sellerLanguages: item.seller_languages?.map(lang => ({
                    code: lang.code,
                    level: lang.level,
                })) || [],
                agency: JSON.stringify(item.agency || {}),
                availability: item.seller_online ? "Online" : (item.is_seller_unavailable ? "Unavailable" : "Offline"),
            }));

            //console.log('Extracted Gigs:', JSON.stringify(gigs, null, 2));
            allScrapedGigs.push(...gigs);
        },

        failedRequestHandler({ request }) {
            console.error(`Failed to scrape ${request.url}`);
        },

        preNavigationHooks: [
            async ({ request }) => {
                // Set custom headers and cookies
                request.headers = {
                    'User-Agent': randomUserAgent.getRandom() || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Language': 'en-GB,en;q=0.6',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Upgrade-Insecure-Requests': '1',
                };

                // Set custom cookies if needed
                request.headers['Cookie'] = input.customCookies || '';
            },
        ],
    });

    // Run the crawler
    await crawler.run(startUrls);

    // Push the final data to the Apify dataset
    await Actor.pushData(allScrapedGigs);

    console.log('Scraping completed. Data pushed to the dataset.');
    await Actor.exit();
})();
