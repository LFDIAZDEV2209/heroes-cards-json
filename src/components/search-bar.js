export class SearchBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
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
        `
    }

    searchHero() {
        const searchInput = this.querySelector('input');
        const searchQuery = searchInput.value;
        
        if (searchQuery.trim() === '') {
            console.log('No se puede buscar un héroe sin un nombre');
            return;
        }
        
        // Idea para crear un endpoint para buscar el heroe por nombre
    }
}

customElements.define("search-bar", SearchBar);