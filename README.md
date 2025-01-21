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
    "title": "I will create a profitable one product Shopify dropshipping store",
    "gigUrl": "https://www.fiverr.com/lucassobrinho/create-30k-per-month-one-product-shopify-store",
    "sellerName": "Lucas Sobrinho",
    "sellerProfileUrl": "https://www.fiverr.com/lucassobrinho",
    "rating": "4.9",
    "reviews": "1k+",
    "price": "€122",
    "mediaType": "Video",
    "mediaUrl": "https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/q9fvvyjjl0f6brz5h08a",
    "searchUrl": "https://www.fiverr.com/categories/programming-tech/wordpress-services"
  },
  {
    "title": "I will build responsive WordPress website design",
    "gigUrl": "https://www.fiverr.com/faisalshafiq842/work-for-5-for-wordpress-designing",
    "sellerName": "Faisal Shafiq",
    "sellerProfileUrl": "https://www.fiverr.com/faisalshafiq842",
    "rating": "4.9",
    "reviews": "530",
    "price": "€102",
    "mediaType": "Image",
    "mediaUrl": "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/133869484/original/e8ccb61e19b34a7a0a69deb45ad0375a004aefc7.jpeg",
    "searchUrl": "https://www.fiverr.com/categories/programming-tech/wordpress-services"
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
