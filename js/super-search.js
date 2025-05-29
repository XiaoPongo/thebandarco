// super-search.js adapted to fetch and search JSON index instead of XML
(() => {
  let posts = [];
  let searchEl, searchInputEl, searchResultsEl;
  let currentInputValue = '';
  let lastSearchResultHash = '';
  let searchFile = '/search.json'; // default JSON file

  // Simple function to format ISO or date string to "MMM DD, YYYY"
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show/hide results based on matching posts
  const handleInput = () => {
    currentInputValue = searchInputEl.value.toLowerCase().trim();

    if (!currentInputValue || currentInputValue.length < 3) {
      lastSearchResultHash = '';
      searchResultsEl.classList.add('is-hidden');
      searchResultsEl.innerHTML = '';
      return;
    }

    // Filter posts for matches in title, category, tags, or content
    const matchingPosts = posts.filter(post => {
      const haystack = [
        post.title,
        post.category,
        post.tags,
        post.content
      ].filter(Boolean).join(' ').toLowerCase();

      return haystack.includes(currentInputValue);
    });

    const currentResultHash = matchingPosts.map(p => p.title).join('');

    if (!matchingPosts.length || currentResultHash === lastSearchResultHash) {
      searchResultsEl.classList.add('is-hidden');
      searchResultsEl.innerHTML = '';
      return;
    }

    searchResultsEl.classList.remove('is-hidden');

    searchResultsEl.innerHTML = matchingPosts.map(post => {
      const dateStr = formatDate(post.date);
      return `
        <li>
          <a href="${post.url}">
            ${post.title}
            ${dateStr ? `<span class="super-search__result-date">${dateStr}</span>` : ''}
          </a>
        </li>`;
    }).join('');

    lastSearchResultHash = currentResultHash;
  };

  // Main superSearch initialization
  const superSearch = ({
    searchFile: file = '/search.json',
    searchSelector = '#js-super-search',
    inputSelector = '#js-super-search__input',
    resultsSelector = '#js-super-search__results'
  } = {}) => {
    searchFile = file;
    searchEl = document.querySelector(searchSelector);
    searchInputEl = document.querySelector(inputSelector);
    searchResultsEl = document.querySelector(resultsSelector);

    // Fetch JSON search index
    fetch(searchFile)
      .then(res => res.json())
      .then(data => {
        posts = data;
      })
      .catch(err => {
        console.error('Error loading search JSON:', err);
      });

    // Keyboard shortcuts: ESC to close, '/' to open
    window.addEventListener('keyup', e => {
      if (e.key === 'Escape') toggle();
    });

    window.addEventListener('keypress', e => {
      if (e.key === '/' && !searchEl.classList.contains('is-active')) {
        toggle();
        e.preventDefault();
      }
    });

    searchInputEl?.addEventListener('input', handleInput);
  };

  // Toggle search overlay display
  const toggle = () => {
    if (!searchEl || !searchInputEl || !searchResultsEl) return;

    searchEl.classList.toggle('is-active');

    if (searchEl.classList.contains('is-active')) {
      searchInputEl.value = '';
      searchResultsEl.classList.add('is-hidden');
      searchResultsEl.innerHTML = '';
      setTimeout(() => searchInputEl.focus(), 200);
    } else {
      searchResultsEl.classList.add('is-hidden');
      searchResultsEl.innerHTML = '';
    }
  };

  // Export to global scope
  superSearch.toggle = toggle;
  window.superSearch = superSearch;

})();
