// super-search.js
// Author: Kushagra Gour (modernized by OpenAI)
// MIT Licensed

(() => {
  let posts = [];
  let searchEl, searchInputEl, searchResultsEl;
  let currentInputValue = '';
  let lastSearchResultHash = '';
  let searchFile = '/feed.xml';

  // Converts XML to JSON
  const xmlToJson = (xml) => {
    if (xml.nodeType === 3) return xml.nodeValue;

    const textNodes = Array.from(xml.childNodes).filter(n => n.nodeType === 3);
    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
      return textNodes.map(n => n.nodeValue).join('');
    }

    const obj = {};
    if (xml.hasChildNodes()) {
      Array.from(xml.childNodes).forEach(item => {
        const nodeName = item.nodeName;
        const content = xmlToJson(item);
        if (obj[nodeName] === undefined) {
          obj[nodeName] = content;
        } else {
          if (!Array.isArray(obj[nodeName])) {
            obj[nodeName] = [obj[nodeName]];
          }
          obj[nodeName].push(content);
        }
      });
    }
    return obj;
  };

  const getPostsFromXml = (xml) => {
    const json = xmlToJson(xml);
    return json?.channel?.item || [];
  };

  const toggle = () => {
    if (!searchEl || !searchInputEl || !searchResultsEl) return;

    searchEl.classList.toggle('is-active');

    if (searchEl.classList.contains('is-active')) {
      searchInputEl.value = '';
    } else {
      searchResultsEl.classList.add('is-hidden');
    }

    setTimeout(() => searchInputEl.focus(), 200);
  };

  const handleInput = () => {
    currentInputValue = searchInputEl.value.toLowerCase();
    if (!currentInputValue || currentInputValue.length < 3) {
      lastSearchResultHash = '';
      searchResultsEl.classList.add('is-hidden');
      return;
    }

    const matchingPosts = posts.filter(post =>
      post.title?.toLowerCase().includes(currentInputValue) ||
      post.description?.toLowerCase().includes(currentInputValue)
    );

    const currentResultHash = matchingPosts.map(p => p.title).join('');
    if (!matchingPosts.length || currentResultHash === lastSearchResultHash) {
      searchResultsEl.classList.add('is-hidden');
      return;
    }

    searchResultsEl.classList.remove('is-hidden');
    searchResultsEl.innerHTML = matchingPosts.map(post => {
      const date = new Date(post.pubDate);
      const formattedDate = date.toUTCString().replace(/.*(\d{2})\s+(\w{3})\s+(\d{4}).*/, '$2 $1, $3');
      return `<li><a href="${post.link}">${post.title}<span class="super-search__result-date">${formattedDate}</span></a></li>`;
    }).join('');

    lastSearchResultHash = currentResultHash;
  };

  const superSearch = ({
    searchFile: feed = '/feed.xml',
    searchSelector = '#js-super-search',
    inputSelector = '#js-super-search__input',
    resultsSelector = '#js-super-search__results'
  } = {}) => {
    searchFile = feed;
    searchEl = document.querySelector(searchSelector);
    searchInputEl = document.querySelector(inputSelector);
    searchResultsEl = document.querySelector(resultsSelector);

    fetch(searchFile)
      .then(res => res.text())
      .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then(xml => {
        const channel = xml.querySelector('channel');
        posts = getPostsFromXml(channel);
      })
      .catch(err => console.error('Error loading search feed:', err));

    // ESC key = close, '/' = open
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

  // Make toggle available globally
  superSearch.toggle = toggle;

  // Export to global scope
  window.superSearch = superSearch;

})();
