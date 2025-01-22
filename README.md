# Fiverr Gig Scraper

This scraper extracts detailed information from Fiverr gig listings based on the provided Fiverr category or search URL.

## Input

### Example Input
The scraper accepts a JSON input to define the scraping parameters, such as the URLs to scrape and additional options. 

Example:
```json
{
  "startUrls": [
    {
      "url": "https://www.fiverr.com/categories/programming-tech/wordpress-services"
    },
    {
      "url": "https://www.fiverr.com/categories/digital-marketing/seo-services"
    }
  ],
  "proxyCountryCode": "US"
}
```

### Fields:
- **startUrls**: An array of URLs to scrape. These URLs should be Fiverr category or search result pages.
- **proxyCountryCode** (optional): Country code for proxy usage (e.g., "US", "FR"). Defaults to "US" if not provided.

---

## API Call Example

To call the scraper via API:

**POST URL**:
```
https://api.apify.com/v2/acts/{YOUR_ACT_ID}/run-sync-get-dataset-items?token={YOUR_TOKEN}
```

**POST Body Content**:
```json
{
  "startUrls": [
    {
      "url": "https://www.fiverr.com/categories/graphics-design/logo-design"
    }
  ],
  "proxyCountryCode": "US"
}
```

---

## Output

The scraper returns an array of gig objects, where each object contains detailed information about a Fiverr gig. 

### Example Output:
```json
[
  {
    "gigId": 371627339,
    "title": "build, rebuild website development as full stack developer, front end developer",
    "sellerName": "rank_champ",
    "sellerProfileUrl": "https://www.fiverr.com/rank_champ",
    "sellerCountry": "BD",
    "sellerLevel": "level_two_seller",
    "rating": 5,
    "reviews": 172,
    "price": 150,
    "isPro": false,
    "isFiverrChoice": false,
    "metadata": [
      {
        "type": "website_type",
        "value": [
          "business"
        ]
      },
      {
        "type": "programming_language",
        "value": [
          "html_css",
          "javascript",
          "php",
          "react",
          "tailwind_css"
        ]
      },
      {
        "type": "website_features",
        "value": [
          "marketing",
          "payment",
          "forum",
          "chat",
          "membership",
          "gallery",
          "booking",
          "dashboard",
          "landing_page",
          "blog"
        ]
      }
    ],
    "mediaAssets": [
      {
        "type": "ImageAsset",
        "url": "https://fiverr-res.cloudinary.com/t_main1,q_auto,f_auto/gigs/371627339/original/f5acf84af4952823132bcc126b42dd10d5cb7f07.png"
      }
    ],
    "attachments": [],
    "sellerLanguages": [
      {
        "code": "en",
        "level": 3
      },
      {
        "code": "bn",
        "level": 4
      }
    ],
    "agency": {},
    "availability": "Offline"
  }
]

```

### Fields:
- **title**: The title of the gig.
- **gigUrl**: Direct URL to the gig.
- **sellerName**: Name of the seller offering the gig.
- **sellerProfileUrl**: URL to the seller's Fiverr profile.
- **rating**: Average rating of the gig.
- **reviews**: Total number of reviews for the gig.
- **price**: Starting price for the gig.
- **mediaType**: Indicates whether the gig preview includes a video or image.
- **mediaUrl**: URL to the gig's media (video or image).
- **searchUrl**: The URL used for the search or category listing.

---

## Usage

1. **Configure Input**:
   - Add the Fiverr category or search URLs in the `startUrls` field.
   - Set `removeDuplicates` to `true` if you want to avoid duplicate gig entries.

2. **Run the Scraper**:
   - Use the Apify platform or API to execute the scraper.

3. **Get Results**:
   - Extract comprehensive gig data in JSON format.

---

This scraper is ideal for analyzing Fiverr categories, monitoring gig trends, and gathering data for research or business use cases.

--- 
