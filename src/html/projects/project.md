---
title: Project title
language: None
description: Project description
publish: private

changefreq: never
lastmod: 2020-04-17
priority: 0.5
---

The contents of the project explanation and demonstration go here.

The general variables 'title', 'description' and 'publish' must be included in all projects/ files (excluding index).
The sitemap variables 'changefreq', 'lastmod' and 'priority' must be included in all projects/ files (excluding index).

The 'publish' variable can be set to one of the following:
- Private 
  - Hide posts and is not included in the production build.
  - Use for posts that will never be posted.
  - E.g. publish: private.
- Draft
  - Hide posts and is not included in the production build.
  - Use for posts that will be posted in the future.
  - E.g. publish: draft.
- Future-dated
  - Hide posts and is not included in the production build.
  - Use for publishing at a specific future date.
  - E.g. publish: 2020-10-16.
- Date
  - Show post and is included in the production build.
  - Use for publishing the article at current or previous date.
  - E.g. publish: 2019-01-23.

The variables 'changefreq', 'lastmod' and 'priority' are used for generating the sitemap.
- changefreq
  - How frequently the page is likely to change, providing general information to search engines and may not correlate exactly to how often they crawl the page.
  - For posts typical value will be 'never'.
  - Valid values: always, hourly, daily, weekly, monthly, yearly, never.
- lastmod
  - The date of last modification of the file.
  - Date should be set every time file is modified.
  - Valid format: XX-XX-XX
- priority
   - The priority of this URL relative to other URLs on your site.
   - For posts typical value will be set to 0.5.
   - Valid range: 0.0 - 1.0

Note - This is a private article and will not appear on the production build.
