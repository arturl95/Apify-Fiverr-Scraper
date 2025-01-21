# Upwork Job Scraper

This scraper extracts detailed job information from Upwork job listings based on the provided Upwork job search URL.

## Input

Check the json example in input tab:
https://apify.com/arlusm/upwork-scraper-with-fresh-job-posts/input-schema


To call via API:

POST url: https://api.apify.com/v2/acts/arlusm~upwork-scraper-with-fresh-job-posts/run-sync-get-dataset-items?token={YOUR_TOKEN}

POST body content:

```json
"startUrls": 
[
  {
    "url": "https://www.upwork.com/nx/search/jobs/?per_page=50&q=stripe",
    "method": "GET"
  }
],
"proxyCountryCode": "FR",
```

## Output

The output is an array of job objects, with each object containing the following details:

- **title**: The title of the job post
- **link**: Direct URL to the job post
- **paymentType**: Hourly or fixed-price payment type
- **budget**: The job's budget (if available)
- **projectLength**: Estimated project duration
- **shortBio**: Description of the job
- **skills**: List of required skills
- **publishedDate**: When the job was posted
- **normalizedDate**: publishedDate formatted in DateTime. This is not accurate, but rather an estimation,
- **searchUrl**: The URL that was used for the job search

Example output:
```json
[
  {
    "title": "Full Stack Web Developer",
    "link": "https://www.upwork.com/job/full-stack-web-developer_~abcd1234",
    "paymentType": "Hourly",
    "budget": "$100.00",
    "projectLength": "3-6 months",
    "shortBio": "Looking for an experienced full-stack web developer...",
    "skills": ["JavaScript", "React", "Node.js"],
    "publishedDate": "Posted 6 minutes ago",
    "normalizedDate": "2025-01-20T13:34:01.384Z",
    "searchUrl": "https://www.upwork.com/search/jobs/?q=web%20developer"
  }
]
```

## Usage

The scraper can be configured via Apify’s interface. Simply provide the Upwork job search URL, and the scraper will return job data as described.


# fiver-scraper
