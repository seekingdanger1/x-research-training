(async () => {
    const posts = Array.from(document.querySelectorAll('article')).map(post => post.innerText);
    const parsedPosts = posts.map(post => {
      const lines = post.split('\n');
      return {
        username: lines[1] || '',
        handle: lines[2] || '',
        timestamp: lines[4] || '',
        content: lines.slice(5, lines.findIndex(line => line.startsWith('Zitat'))).join(' ') || '',
        quotes: lines.includes('Zitat') ? lines.slice(lines.findIndex(line => line.startsWith('Zitat')) + 1, lines.length - 3).join(' ') : '',
        retweets: lines[lines.length - 3] || '0',
        likes: lines[lines.length - 2] || '0',
        impressions: lines[lines.length - 1] || '0'
      };
    });
    console.log(JSON.stringify(parsedPosts, null, 2));
  })();