const connectToDatabase = require('../../lib/db');
const ToeicPendingBatch = require('../../models/ToeicPendingBatch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();
    
    // 1. Fetch BBC News Business RSS feed
    const rssResponse = await fetch('http://feeds.bbci.co.uk/news/business/rss.xml');
    if (!rssResponse.ok) {
      throw new Error(`Failed to fetch BBC RSS: ${rssResponse.statusText}`);
    }
    const rssText = await rssResponse.text();
    const $rss = cheerio.load(rssText, { xmlMode: true });
    
    // Get the first item link
    const firstItem = $rss('item').first();
    const articleUrl = firstItem.find('link').text();
    const articleTitle = firstItem.find('title').text();
    
    if (!articleUrl) {
      throw new Error('No article URL found in RSS feed');
    }

    // 2. Fetch the article page
    const articleResponse = await fetch(articleUrl);
    if (!articleResponse.ok) {
      throw new Error(`Failed to fetch article: ${articleResponse.statusText}`);
    }
    const articleHtml = await articleResponse.text();
    const $article = cheerio.load(articleHtml);
    
    // Extract paragraphs (BBC typically uses <p> or specific classes, let's grab all <p> in article body)
    // Using a generic approach to grab paragraph texts within the main article container if possible, 
    // or just all paragraphs avoiding nav/footer. BBC often uses <main> or <article>.
    let paragraphs = [];
    $article('main p, article p, [data-component="text-block"]').each((i, el) => {
      const text = $article(el).text().trim();
      if (text.length > 30) { // filter out short boilerplate
        paragraphs.push(text);
      }
    });

    if (paragraphs.length === 0) {
      // Fallback if selectors fail
      $article('p').each((i, el) => {
        const text = $article(el).text().trim();
        if (text.length > 50) paragraphs.push(text);
      });
    }

    const scrapedContent = paragraphs.slice(0, 15).join('\n\n'); // Limit to first 15 pars
    
    if (!scrapedContent || scrapedContent.length < 200) {
      throw new Error('Insufficient content scraped from article');
    }

    // 3. Save to ToeicPendingBatch
    await ToeicPendingBatch.create({ 
      source: `BBC News: ${articleTitle}`, 
      content: scrapedContent, 
      status: 'pending' 
    });

    return res.status(200).json({ 
      success: true, 
      message: 'CRON Job Executed: Scraped BBC News and saved pending batch to DB.',
      scrapedUrl: articleUrl
    });
  } catch (err) {
    console.error('Scrape Trigger Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
