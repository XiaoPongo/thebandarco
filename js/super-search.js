/* super-search
Author: Kushagra Gour (http://kushagragour.in)
MIT Licensed
*/
(function () {
	var searchFile = '/feed.xml',
		searchEl,
		searchInputEl,
		searchResultsEl,
		currentInputValue = '',
		lastSearchResultHash,
		posts = [];

	// Converts XML to JSON (simplified)
	function xmlToJson(xml) {
		var obj = {};
		if (xml.nodeType === 3) { // text
			obj = xml.nodeValue;
		}

		var textNodes = [].slice.call(xml.childNodes).filter(function (node) { return node.nodeType === 3; });
		if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
			obj = [].slice.call(xml.childNodes).reduce(function (text, node) { return text + node.nodeValue; }, '');
		}
		else if (xml.hasChildNodes()) {
			for (var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if (typeof (obj[nodeName]) == "undefined") {
					obj[nodeName] = xmlToJson(item);
				} else {
					if (typeof (obj[nodeName].push) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(xmlToJson(item));
				}
			}
		}
		if (xml.attributes && xml.attributes.length > 0) {
			obj['@attributes'] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
			}
		}
		return obj;
	}

	function getPostsFromXml(xml) {
		var json = xmlToJson(xml);
		if (json.feed && json.feed.entry) {
			return Array.isArray(json.feed.entry) ? json.feed.entry : [json.feed.entry];
		}
		return [];
	}

	window.toggleSearch = function toggleSearch() {
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

	function handleInput() {
		currentInputValue = (searchInputEl.value + '').toLowerCase();
		if (!currentInputValue || currentInputValue.length < 3) {
			lastSearchResultHash = '';
			searchResultsEl.classList.add('is-hidden');
			return;
		}
		searchResultsEl.style.offsetWidth;

		var matchingPosts = posts.filter(function (post) {
			const title = post.title && post.title['#text'] || '';
			const summary = post.summary && post.summary['#text'] || '';
			return title.toLowerCase().includes(currentInputValue) || summary.toLowerCase().includes(currentInputValue);
		});

		if (!matchingPosts.length) {
			searchResultsEl.classList.add('is-hidden');
			return;
		}

		var currentResultHash = matchingPosts.reduce(function (hash, post) {
			return (post.title && post.title['#text'] || '') + hash;
		}, '');

		if (currentResultHash !== lastSearchResultHash) {
			searchResultsEl.classList.remove('is-hidden');
			searchResultsEl.innerHTML = matchingPosts.map(function (post) {
				const title = post.title['#text'] || '';
				const link = post.link && post.link['@attributes'] && post.link['@attributes'].href || '#';
				const dateStr = post.published || post.updated || '';
				const date = new Date(dateStr).toUTCString();
				return `<li><a href="${link}">${title}<span class="super-search__result-date">${date}</span></a></li>`;
			}).join('');
		}
		lastSearchResultHash = currentResultHash;
	}

	function init(options) {
		searchFile = options.searchFile || searchFile;
		searchEl = document.querySelector(options.searchSelector || '#js-super-search');
		searchInputEl = document.querySelector(options.inputSelector || '#js-super-search__input');
		searchResultsEl = document.querySelector(options.resultsSelector || '#js-super-search__results');

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('GET', searchFile);
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState !== 4) return;
			if (xmlhttp.status !== 200 && xmlhttp.status !== 304) return;
			var node = (new DOMParser).parseFromString(xmlhttp.responseText, 'text/xml');
			posts = getPostsFromXml(node);
		}
		xmlhttp.send();

		// Toggle on ESC key
		window.addEventListener('keyup', function (e) {
			if (e.which === 27) toggleSearch();
		});
		// Open on '/' key
		window.addEventListener('keypress', function (e) {
			if (e.which === 47 && !searchEl.classList.contains('is-active')) toggleSearch();
		});
		searchInputEl.addEventListener('input', handleInput);
	}

	init.toggle = toggleSearch;
	window.superSearch = init;
})();
