// Retain the global array to store parsed posts
window.validPosts = window.validPosts || [];

/**
 * Formats a simple status bar showing memory usage and post count.
 * @param {number} memoryUsage - Current memory usage in MB.
 * @param {number} postCount - Number of posts parsed so far.
 * @returns {string} - A formatted status bar string.
 */
function formatStatusBar(memoryUsage, postCount) {
    const progress = Math.min(postCount / 100, 1);
    const barLength = 20;
    const filledLength = Math.floor(progress * barLength);
    const bar = '█'.repeat(filledLength) + '-'.repeat(barLength - filledLength);

    return `📊 Memory: ${memoryUsage}MB | Posts: ${postCount}\n[${bar}] ${Math.floor(progress * 100)}%`;
}

/**
 * Safely parses integer values, returning zero if parsing fails.
 * @param {string} value - The string to parse.
 * @returns {number} - The parsed integer, or zero if invalid.
 */
function safeParseInt(value) {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Extracts relevant post details from an article DOM element,
 * using the HTML structure shown in your snippet.
 * @param {HTMLElement} article - The article element containing post data.
 * @returns {Object} - An object with post details (may contain empty fields if not found).
 */
function extractPostDetails(article) {
    try {
        /**
         * Helper to parse integers safely.
         * Returns 0 if value is NaN or not found.
         */
        function safeParseInt(value) {
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? 0 : parsed;
        }

        // Username (e.g., "0.5x e/acc-ngineer"):
        // Looks like it's under data-testid="User-Name" in a span.css-1jxf684
        const username = article
            .querySelector('[data-testid="User-Name"] div[dir="ltr"] span.css-1jxf684')
            ?.textContent.trim() || '';

        // Handle (e.g., "@eaccngineer"):
        // Typically also under data-testid="User-Name", but in a different link + span
        const handle = article
            .querySelector('[data-testid="User-Name"] a[role="link"][tabindex="-1"] span.css-1jxf684')
            ?.textContent.trim() || '';

        // Timestamp:
        // Found in the <time> element’s datetime attribute
        const timestamp = article
            .querySelector('time')
            ?.getAttribute('datetime') || '';

        // Content (tweet text):
        // Found in a div with data-testid="tweetText"
        const content = article
            .querySelector('[data-testid="tweetText"]')
            ?.textContent.trim() || '';

        // Retweets:
        // Found in button with data-testid="retweet" -> inner <span> holds the count
        const retweets = safeParseInt(
            article.querySelector('[data-testid="retweet"] span.css-1jxf684')?.textContent
        );

        // Likes:
        // Found in a button with data-testid="like" or "unlike" -> inner <span> holds the count
        const likes = safeParseInt(
            article.querySelector('[data-testid="like"], [data-testid="unlike"] span.css-1jxf684')
                ?.textContent
        );

        // Impressions:
        // Found in the <a> tag that links to "/analytics"
        // The <span> inside holds the number
        const impressions = safeParseInt(
            article.querySelector('a[href*="/analytics"] span.css-1jxf684')?.textContent
        );

        // Construct an object with all extracted data
        return {
            username,
            handle,
            timestamp,
            content,
            retweets,
            likes,
            impressions,
        };
    } catch (error) {
        console.error("Error extracting post details:", error);
        return null;
    }
}

/**
 * Main function to parse all posts in the document and update the global validPosts array.
 * This version does NOT filter out incomplete/empty data.
 */
function parsePosts() {
    const articles = document.querySelectorAll('article');
    const parsedPosts = Array.from(articles).map(extractPostDetails);

    window.validPosts.push(...parsedPosts);
    const postCount = window.validPosts.length;

    if (parsedPosts.length > 0) {
        console.log("Recent post:", parsedPosts[parsedPosts.length - 1]);
    }
}

parsePosts();
