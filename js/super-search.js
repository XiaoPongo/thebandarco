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
        }
    }

    setupEventListeners() {
        this.input.addEventListener('input', () => this.search(this.input.value.trim()));
        
        document.addEventListener('keydown', (e) => {
            if (this.isOpen && e.key === 'Escape') this.toggle();
        });
    }

    search(query) {
        if (query.length < this.minQueryLength) {
            this.resultsContainer.innerHTML = '';
            return;
        }

        const results = this.data.filter(item => {
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
        document.getElementById('js-super-search').classList.toggle('is-active', this.isOpen);
        
        if (this.isOpen) {
            this.input.value = '';
            this.resultsContainer.innerHTML = '';
            this.input.focus();
        }
    }
}
