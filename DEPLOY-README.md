# MOTTO Automotive Website v20

Deployment package prepared on 17 August 2026.

## Product photography upgrade in v20

- Replaced all six line-art product diagrams with premium photographic visuals based on MOTTO's actual product-section assets.
- Added dedicated visuals for number plate holders, 3D badges, dealer keychains, car sunshades, showroom plates and the white-label range.
- Removed callout lines, numbers and infographic styling from the product cards and product-page hero areas.
- Converted every new 1536 by 1024 pixel image to AVIF and added responsive 768 pixel variants for faster delivery while keeping detailed product imagery.
- Self-hosted the product-page display font to eliminate layout shift and reduce dependence on third-party font delivery.
- Updated English and Arabic alternative text, Product schema image references, image sitemap entries, dimensions and preloads.
- A local Lighthouse 13 mobile audit of the number plate holder page scored 99 Performance and 100 for Accessibility, Best Practices and SEO.

## Product landing pages and About refinements in v19

- Added dedicated English and Arabic product indexes at `/products/` and `/ar/products/`.
- Added indexable landing pages for number plate holders, 3D automotive badges, dealer keychains, custom car sunshades, showroom plates and white-label automotive accessories.
- Added product visuals, descriptive alternative text, explicit image dimensions, responsive sizing and page-specific WhatsApp enquiries.
- Added canonical URLs, reciprocal language alternates, breadcrumbs, FAQs and page-level structured data for both languages.
- Added visible manufacturing and editorial notes based on MOTTO Automotive's first-party experience.
- Updated homepage cards, navigation, footer links, sitemap, `llms.txt` and `llms-full.txt` to point to the new landing pages.
- Updated the About page introduction to identify Pavle Rastovic as Managing Director.
- Added a dedicated mobile crop for Pavle Rastovic's leadership image so his portrait and the Dubai skyline remain visible on narrow screens.
- Removed the empty leading space from Partnerships in Motion and deferred offscreen LinkedIn embeds to reduce initial third-party work.
- Added explicit dimensions and alternative text checks for every image used across all 40 HTML pages.
- Replaced the shared navigation emblem with a 104 by 104 pixel AVIF asset, reducing that request from about 47 KB to about 6 KB.
- Reduced product-page critical CSS, deferred non-critical popup and font styles, and enabled long-lived versioned CSS and JavaScript caching for Cloudflare Pages.
- A local Lighthouse 12 mobile audit of the number plate holder page scored 96 Performance and 100 for Accessibility, Best Practices and SEO. Live results can vary by network, Cloudflare caching and third-party services.

### New product URLs

- `/products/number-plate-holders`
- `/products/3d-automotive-badges`
- `/products/dealer-keychains`
- `/products/custom-car-sunshades`
- `/products/showroom-plates`
- `/products/white-label-automotive-accessories`

Arabic equivalents use the same paths under `/ar/products/`.

## Signature product slideshow in v18

- Removed the Instagram video player from the Signature Product section.
- Added 12 supplied vehicle photographs as SEO-friendly local assets.
- Cropped every slideshow image to a consistent 900 by 1125 pixel, 4:5 format.
- Focused the crops on the branded showroom plate or number plate holder wherever visible.
- Added an automatic 5.2-second slideshow with a 1.25-second crossfade and subtle image movement.
- Kept the slideshow free of start, stop and navigation controls for a clean presentation.
- Paused the slideshow when it is outside the viewport or the browser tab is hidden.
- Respected reduced-motion accessibility preferences.
- Added descriptive English and Arabic alternative text.

## Reliable local preview in v17

Do not open `index.html` directly from Finder. The website uses root-relative assets and clean URLs, so it must be viewed through a local web server.

On macOS:

1. Unzip the package.
2. Double-click `START-PREVIEW.command`.
3. If macOS blocks it the first time, right-click it, choose Open and confirm.
4. Keep the Terminal window open while previewing the website.
5. Press Control+C in that Terminal window when finished.

The included preview server supports the same extensionless article routes used by Cloudflare Pages, such as `/blog/uae-number-plate-holder-sizes-fit-guide`.

Cloudflare Pages already serves matching `.html` files at extensionless URLs, so `preview_server.py` and `START-PREVIEW.command` are local preview tools only and are not needed by the live website.

## Arabic logo and locale compatibility fix in v16

- Restored the complete Arabic MOTTO hero lockup, including the emblem, large Arabic wordmark, automotive descriptor and company line.
- Updated Arabic CSS selectors to support the regional `ar-AE` language code across the homepage, enquiry form and About page.
- Updated JavaScript language detection to recognize Arabic regional language codes.
- Added new asset version parameters so browsers and Cloudflare fetch the corrected CSS and JavaScript instead of cached copies.

## Conversion, authorship and navigation updates in v15

- Replaced every generic WhatsApp redirect with a direct, page-specific enquiry message.
- Added the current page title and canonical URL to article enquiries so MOTTO can immediately identify the visitor's topic.
- Added product-specific WhatsApp messages to the main homepage product and manufacturing calls to action.
- Updated the delayed enquiry form so its WhatsApp message includes the current page context in English and Arabic.
- Removed personal author cards from blog articles.
- Set article authorship and review attribution to MOTTO Automotive as an Organization in visible metadata and JSON-LD.
- Reduced the main desktop navigation to Products, Manufacturing, Insights and About, with Contact retained in the menu drawer and as the primary header action.
- Normalized page language metadata to `en-AE` and `ar-AE`, including localized Open Graph values and accurate alternates only where equivalent translations exist.
- Kept the English and Arabic sites on distinct crawlable URLs with an explicit language switch.

## Performance fix in v14

- Increased the Partnerships in Motion carousel to a normal continuous pace.
- Replaced per-frame horizontal scrolling with GPU-accelerated transforms.
- Cached card measurements to avoid repeated layout work.
- Added offscreen rendering containment for the embedded LinkedIn posts.
- Paused background animation work only when the section or browser tab is not visible.
- Applied the same fix to the English and Arabic About pages.

## New SEO article library

Twelve original educational articles were added for UAE dealers, fleets, procurement teams, marketers and vehicle-preparation teams:

1. UAE Number Plate Holder Sizes: A Fit Guide for Dealers and Fleets
2. Are Number Plate Frames Legal in the UAE?
3. How to Order Custom Dealer-Branded Number Plate Holders
4. Number Plate Holder Manufacturer vs Reseller
5. Foil Stamping, Pad Printing or Stickers for Plate Frames
6. How Custom 3D Automotive Badges Are Made
7. Custom Car Badges for Gulf Conditions
8. Dealer Handover Gifts and Branded Keychains
9. Custom Car Sunshades in the UAE
10. How Sunshades Protect Vehicle Interiors in UAE Heat
11. Custom Showroom Plates for UAE Dealers
12. Bulk Automotive Accessories Procurement Checklist

Each new article includes:

- A short, descriptive canonical URL
- Search-focused title and meta description
- One H1 and clear H2 sections
- A quick-answer block and table of contents
- Original, customer-oriented educational copy
- Practical checklists, tables and FAQs
- Relevant MOTTO product or vehicle imagery with descriptive alt text
- BlogPosting, BreadcrumbList and FAQPage JSON-LD
- Published and reviewed dates
- MOTTO Automotive organization authorship and editorial review information
- Related-guide internal links and a contact call to action

The legal articles distinguish official UAE registration plates from accessory holders and non-registration showroom display products. They cite current official sources, including Federal Decree-Law No. 14 of 2024 On Traffic Regulation.

## Discovery and indexing updates

- Expanded `/blog/` to 15 educational articles
- Added links to the three priority articles from the homepage
- Expanded `/sitemap.xml` to include every new canonical URL and article image
- Added `/feed.xml` as an RSS discovery feed
- Expanded `/llms.txt`
- Added `/llms-full.txt`
- Added clean-URL redirects for all new `.html` files
- Added cache and content-type rules for the RSS and LLM files
- Removed em dash characters from the website source

## Deploy to Cloudflare Pages

1. Keep the package structure unchanged. `index.html` must remain at the ZIP root.
2. Upload the ZIP through Cloudflare Pages Direct Upload.
3. Wait for the deployment to finish, then verify:
   - `https://motto.ae/products/`
   - `https://motto.ae/products/number-plate-holders`
   - `https://motto.ae/ar/products/`
   - `https://motto.ae/blog/`
   - `https://motto.ae/blog/uae-number-plate-holder-sizes-fit-guide`
   - `https://motto.ae/blog/are-number-plate-frames-legal-uae`
   - `https://motto.ae/blog/custom-dealer-branded-number-plate-holders-ordering-guide`
   - `https://motto.ae/sitemap.xml`
   - `https://motto.ae/feed.xml`
   - `https://motto.ae/llms.txt`
   - `https://motto.ae/llms-full.txt`
4. In Google Search Console, resubmit `https://motto.ae/sitemap.xml` after the new deployment is live.
5. Use URL Inspection for the product index, the six English product pages, the blog index and the three priority article URLs above. Test the live URL, then request indexing.

## Important publishing note

The new articles currently use English canonical URLs. Their language control opens the Arabic Insights index because direct Arabic translations have not yet been published. No Arabic alternate is declared for an untranslated article.

LinkedIn embeds require the live HTTPS website and may not render when an HTML file is opened directly from a computer.
