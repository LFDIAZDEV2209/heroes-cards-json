import { getSearchHero } from '../services/heroesServices';

export class SearchBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="search-bar flex justify-center items-center gap-2 p-4">
                <input 
                    type="text" 
                    placeholder="Buscar héroe" 
                    class="comic-input p-2 border-3 border-black rounded-lg font-bangers text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <button class="comic-button bg-blue-600 text-white px-6 py-2 rounded-lg border-3 border-black hover:bg-blue-700 transition-colors font-bangers text-lg flex items-center gap-2">
                    <i class="fas fa-search"></i>
                    Buscar
                </button>
            </div>
        `;
    }

    setupEventListeners() {
        const searchInput = this.querySelector('input');
        const searchButton = this.querySelector('.comic-button');

        // Buscar al hacer clic en el botón
        searchButton.addEventListener('click', () => this.searchHero());

        // Buscar al presionar Enter en el input
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchHero();
            }
        });

        // Buscar mientras se escribe
        searchInput.addEventListener('input', (e) => {
            this.searchHero();
        });
    }

    async searchHero() {
        const searchInput = this.querySelector('input');
        const searchQuery = searchInput.value.trim();
        
        if (searchQuery === '') {
            // Si el input está vacío, mostrar todos los héroes
            const event = new CustomEvent('search-results', {
                detail: { heroes: [] },
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(event);
            return;
        }
        
        try {
            const heroes = await getSearchHero(searchQuery);
            
            // Disparar un evento personalizado con los resultados
            const event = new CustomEvent('search-results', {
                detail: { heroes },
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(event);
        } catch (error) {
            console.error('Error al buscar héroes:', error);
        }
    }
}

customElements.define("search-bar", SearchBar);