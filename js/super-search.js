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

        // Store references to bound functions
        this.handleInput = this.handleInput.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.init();
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
        this.search(this.input.value.trim());
    }

    handleKeydown(e) {
        if (this.isOpen && e.key === 'Escape') {
            this.toggle();
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
            this.resultsContainer.innerHTML = '';
            return;
        }

        const results = this.data.filter(item => {
            if (!item) return false;
            const searchContent = `${item.title} ${item.content || ''}`.toLowerCase();
            return searchContent.includes(query.toLowerCase());
        });

        this.displayResults(results);
    }

    displayResults(results) {
        this.resultsContainer.innerHTML = results.length
            ? results.map(item => this.template(item)).join('')
            : this.noResultsText;
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const searchElement = document.getElementById('js-super-search');
        
        if (searchElement) {
            searchElement.classList.toggle('is-active', this.isOpen);
            
            if (this.isOpen) {
                this.input.value = '';
                this.resultsContainer.innerHTML = '';
                this.input.focus();
            }
        }
    }

    // Clean up event listeners when needed
    destroy() {
        this.input.removeEventListener('input', this.handleInput);
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('click', this.handleClickOutside);
    }
}
