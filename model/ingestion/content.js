(async () => {
    const posts = Array.from(document.querySelectorAll('article')).map(post => post.innerText);
    console.log(posts);
  })();