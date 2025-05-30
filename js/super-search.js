class SuperSearch {
    constructor(options) {
        this.input = options.searchInput;
        this.resultsContainer = options.resultsContainer;
        this.jsonFile = options.jsonFile;
        this.noResultsText = options.noResultsText;
        this.template = options.template;
        this.data = [];
        
        this.init();
    }
    
    init() {
        this.fetchData();
        this.setupEventListeners();
    }
    
    fetchData() {
        fetch(this.jsonFile)
            .then(response => response.json())
            .then(data => {
                this.data = data;
            })
            .catch(error => console.error('Error loading search data:', error));
    }
    
    setupEventListeners() {
        this.input.addEventListener('input', () => this.search(this.input.value));
        
        // Close when clicking outside search results
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#js-super-search') && 
                !e.target.closest('.search-button')) {
                this.toggle();
            }
        });
    }
    
    search(query) {
        if (!query || query.length < 2) {
            this.resultsContainer.innerHTML = '';
            return;
        }
        
        const results = this.data.filter(item => {
            const searchContent = (item.title + ' ' + (item.content || '')).toLowerCase();
            return searchContent.includes(query.toLowerCase());
        });
        
        this.displayResults(results);
    }
    
    displayResults(results) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = this.noResultsText;
            return;
        }
        
        this.resultsContainer.innerHTML = results.map(item => this.template(item)).join('');
    }
    
    toggle() {
        const search = document.getElementById('js-super-search');
        search.classList.toggle('is-active');
        
        if (search.classList.contains('is-active')) {
            this.input.focus();
        } else {
            this.input.value = '';
            this.resultsContainer.innerHTML = '';
        }
    }
    
    static toggle() {
        if (window.superSearch) {
            window.superSearch.toggle();
        }
    }
}
