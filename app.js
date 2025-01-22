requestHandler: async ({ request, $ }) => {
    console.log(`Scraping: ${request.url}`);

    const jobElements = $('article');
    const scrapedJobs = [];

    jobElements.each((index, jobElement) => {
        const titleElement = $(jobElement).find('.job-tile-title a');
        const title = titleElement.text().trim();

        const relativeLink = titleElement.attr('href');
        const baseUrl = "https://www.upwork.com";
        const link = baseUrl + relativeLink;

        if (title.includes('Access Denied')) {
            console.log(`Blocked or CAPTCHA page detected on ${request.url}. Retrying...`);
            throw new Error('Blocked by CAPTCHA');
        }

        const paymentType = safeCall(() => getPaymentInfo($(jobElement))).paymentType;
        const budget = safeCall(() => getPaymentInfo($(jobElement))).budget;
        const projectLength = safeCall(() => getProjectLength($(jobElement)));
        const shortBio = safeCall(() => getShortBio($(jobElement)));
        const skills = safeCall(() => getSkills($(jobElement)));
        const publishedDate = safeCall(() => getJobPublishedDate($(jobElement)));
        const normalizedDate = safeCall(() => normalizeDate(publishedDate));

        // Add detailed serialization
        const jobData = {
            title,
            link,
            paymentType,
            budget,
            projectLength,
            shortBio,
            skills: skills || [],
            publishedDate,
            normalizedDate,
            searchUrl: request.url,
        };

        // Log as fully expanded JSON for debugging
        console.log(JSON.stringify(jobData, null, 2));

        scrapedJobs.push(jobData);
    });

    allScrapedJobs.push(...scrapedJobs);
}
