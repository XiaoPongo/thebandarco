class SuperSearch {
    constructor({
        searchInput,
        resultsContainer,
        jsonUrl,
        template,
        noResultsText = '<li>No results found</li>',
        minQueryLength = 2
    }) {
        this.input = searchInput;
        this.resultsContainer = resultsContainer;
        this.jsonUrl = jsonUrl;
        this.template = template;
        this.noResultsText = noResultsText;
        this.minQueryLength = minQueryLength;
        this.data = [];
        this.isOpen = false;
        this.selectedIndex = -1;
        this.currentResults = [];
        this.resultElements = [];

        // Store references to bound functions
        this.handleInput = this.handleInput.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.debouncedSearch = this.debounce(this.search.bind(this), 200);

        this.init();
    }

    // Debounce function to limit search frequency
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    async init() {
        await this.fetchData();
        this.setupEventListeners();
    }

    async fetchData() {
        try {
            const response = await fetch(this.jsonUrl);
            this.data = await response.json();
        } catch (error) {
            console.error('Search data load failed:', error);
            this.resultsContainer.innerHTML = '<li class="error">Failed to load search data</li>';
        }
    }

    setupEventListeners() {
        this.input.addEventListener('input', this.handleInput);
        document.addEventListener('keydown', this.handleKeydown);
        document.addEventListener('click', this.handleClickOutside);
    }

    handleInput() {
        this.debouncedSearch(this.input.value.trim());
    }

    handleKeydown(e) {
        if (!this.isOpen) return;
        
        switch (e.key) {
            case 'Escape':
                this.toggle();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.selectNext();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.selectPrevious();
                break;
            case 'Enter':
                if (this.selectedIndex >= 0) {
                    this.openSelectedResult();
                }
                break;
        }
    }

    handleClickOutside(e) {
        const searchContainer = document.getElementById('js-super-search');
        const searchButton = document.querySelector('.search-button');
        
        if (this.isOpen && 
            !searchContainer.contains(e.target) && 
            !searchButton.contains(e.target)) {
            this.toggle();
        }
    }

    search(query) {
        if (query.length < this.minQueryLength) {
            this.resetResults();
            return;
        }

        // Include tags in search with graceful handling
        const results = this.data.filter(item => {
            if (!item) return false;
            
            const searchContent = `${item.title} ${item.content || ''} ${
                item.tags ? item.tags.join(' ') : ''
            }`.toLowerCase();
            
            return searchContent.includes(query.toLowerCase());
        });

        this.currentResults = results.slice(0, 10); // Limit to top 10 results
        this.displayResults(this.currentResults, query);
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = this.noResultsText;
            this.resetSelection();
            return;
        }

        // Highlight matches in results
        const highlightedResults = results.map(item => {
            const highlighted = {...item};
            
            // Highlight title
            if (item.title) {
                highlighted.title = this.highlightText(item.title, query);
            }
            
            // Highlight content
            if (item.content) {
                highlighted.content = this.highlightText(item.content, query);
            }
            
            // Highlight tags
            if (item.tags) {
                highlighted.tags = item.tags.map(tag => 
                    this.highlightText(tag, query)
                );
            }
            
            return highlighted;
        });

        this.resultsContainer.innerHTML = highlightedResults
            .map(item => this.template(item))
            .join('');
        
        this.resultElements = Array.from(this.resultsContainer.children);
        this.resetSelection();
    }

    // Text highlighting function
    highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(
            `(${this.escapeRegExp(query)})`, 
            'gi'
        );
        
        return text.replace(regex, '<strong>$1</strong>');
    }

    // Escape special regex characters
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Selection navigation methods
    selectNext() {
        if (this.resultElements.length === 0) return;
        
        const newIndex = this.selectedIndex < this.resultElements.length - 1
            ? this.selectedIndex + 1
            : 0;
        
        this.setSelectedIndex(newIndex);
    }

    selectPrevious() {
        if (this.resultElements.length === 0) return;
        
        const newIndex = this.selectedIndex > 0
            ? this.selectedIndex - 1
            : this.resultElements.length - 1;
        
        this.setSelectedIndex(newIndex);
    }

    setSelectedIndex(index) {
        // Clear previous selection
        if (this.selectedIndex >= 0) {
            this.resultElements[this.selectedIndex].classList.remove('selected');
        }

        // Set new selection
        this.selectedIndex = index;
        this.resultElements[index].classList.add('selected');
        this.resultElements[index].scrollIntoView({ block: 'nearest' });
    }

    openSelectedResult() {
        const item = this.currentResults[this.selectedIndex];
        if (item && item.url) {
            window.location.href = item.url;
        }
    }

    resetSelection() {
        this.selectedIndex = -1;
        this.resultElements.forEach(el => el.classList.remove('selected'));
    }

    resetResults() {
        this.resultsContainer.innerHTML = '';
        this.currentResults = [];
        this.resultElements = [];
        this.resetSelection();
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const searchElement = document.getElementById('js-super-search');
        
        if (searchElement) {
            searchElement.classList.toggle('is-active', this.isOpen);
            
            if (this.isOpen) {
                this.input.value = '';
                this.resetResults();
                this.input.focus();
            }
        }
    }

    // Clean up event listeners
    destroy() {
        this.input.removeEventListener('input', this.handleInput);
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('click', this.handleClickOutside);
    }
}
