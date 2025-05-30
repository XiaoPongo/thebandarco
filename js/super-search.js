(function () {
  var searchFile = '/search.json',
    searchEl,
    searchInputEl,
    searchResultsEl,
    currentInputValue = '',
    lastSearchResultHash,
    posts = [];

  function handleInput() {
    currentInputValue = (searchInputEl.value + '').toLowerCase();
    if (!currentInputValue || currentInputValue.length < 3) {
      lastSearchResultHash = '';
      searchResultsEl.classList.add('is-hidden');
      return;
    }

    // Force reflow for smooth animations (optional)
    searchResultsEl.offsetWidth;

    var matchingPosts = posts.filter(function (post) {
      return (
        (post.title && post.title.toLowerCase().includes(currentInputValue)) ||
        (post.content && post.content.toLowerCase().includes(currentInputValue)) ||
        (post.tags && post.tags.toLowerCase().includes(currentInputValue)) ||
        (post.category && post.category.toLowerCase().includes(currentInputValue))
      );
    });

    if (!matchingPosts.length) {
      searchResultsEl.classList.add('is-hidden');
      return;
    }

    var currentResultHash = matchingPosts.map(p => p.title).join('');
    if (currentResultHash !== lastSearchResultHash) {
      searchResultsEl.classList.remove('is-hidden');
      searchResultsEl.innerHTML = matchingPosts.map(function (post) {
        const date = new Date(post.date).toUTCString();
        return `<li><a href="${post.url}">${post.title}<span class="super-search__result-date">${date}</span></a></li>`;
      }).join('');
    }
    lastSearchResultHash = currentResultHash;
  }

  function init(options) {
    searchFile = options.searchFile || searchFile;
    searchEl = document.querySelector(options.searchSelector || '#js-super-search');
    searchInputEl = document.querySelector(options.inputSelector || '#js-super-search__input');
    searchResultsEl = document.querySelector(options.resultsSelector || '#js-super-search__results');

    fetch(searchFile)
      .then(response => response.json())
      .then(data => {
        posts = data;
      })
      .catch(err => {
        console.error('Search data load failed:', err);
      });

    // Toggle on ESC key
    window.addEventListener('keyup', function (e) {
      if (e.key === 'Escape') toggleSearch();
    });

    // Open on '/' key
    window.addEventListener('keypress', function (e) {
      if (e.key === '/' && !searchEl.classList.contains('is-active')) {
        e.preventDefault();
        toggleSearch();
      }
    });

    searchInputEl.addEventListener('input', handleInput);
  }

  function toggleSearch() {
    searchEl.classList.toggle('is-active');
    if (searchEl.classList.contains('is-active')) {
      searchInputEl.value = '';
    } else {
      searchResultsEl.classList.add('is-hidden');
    }
    setTimeout(function () {
      searchInputEl.focus();
    }, 210);
  }

  init.toggle = toggleSearch;
  window.superSearch = init;
})();
