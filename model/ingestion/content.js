window.validPosts = window.validPosts || [];

function isValidPost(post) {
    return post.username && post.handle && post.timestamp && post.content &&
    !isNaN(parseInt(post.retweets)) &&
    !isNaN(parseInt(post.timestamp)) &&
    !isNaN(parseInt(post.likes)) &&
    !isNaN(parseInt(post.impressions));
}

function formatStatusBar(memoryUsage, postCount) {
    const progress = Math.min(postCount / 100, 1);
    const barLength = 20;
    const filledLength = Math.floor(progress * barLength);
    const bar = '█'.repeat(filledLength) + '-'.repeat(barLength - filledLength);
    return `📊 Memory: ${memoryUsage}MB | Posts: ${postCount}\n[${bar}] ${Math.floor(progress * 100)}%`;
}

function parsePosts() {
    const posts = Array.from(document.querySelectorAll('article')).map(post => post.innerText);
    const parsedPosts = posts.map(post => {
        const lines = post.split('\n').filter(line => line.trim() !== '');
        const quoteIndex = lines.findIndex(line => line.startsWith('Zitat'));
        const statsIndex = lines.length - 3;
        return {
            username: lines[0] || '',
            handle: lines[1] || '',
            timestamp: lines[3] || '',
            content: quoteIndex !== -1 ? lines.slice(4, quoteIndex).join(' ') : lines.slice(4, statsIndex).join(' '),
            quotes: quoteIndex !== -1 ? lines.slice(quoteIndex + 1, statsIndex).join(' ') : '',
            retweets: parseInt(lines[statsIndex]) || 0,
            likes: parseInt(lines[statsIndex + 1]) || 0,
            impressions: parseInt(lines[statsIndex + 2]) || 0
        };
    }).filter(isValidPost);
    window.validPosts.push(...parsedPosts);
    const memoryUsage = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
    const postCount = window.validPosts.length;
    console.clear();
    console.log(formatStatusBar(memoryUsage, postCount));
    console.log("Recent post: " + JSON.stringify(window.validPosts[postCount - 1]));
        const liveView = document.getElementById('live-view');
    console.log(liveView)
    chrome.runtime.sendMessage({ type: 'updateView', data: window.validPosts });
}

parsePosts();