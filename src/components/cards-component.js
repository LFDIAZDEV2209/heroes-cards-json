import { getHeroes } from "../services/heroesServices";
import "./show-more.js";
import "./search-bar.js";

export class CardsComponent extends HTMLElement {
    constructor() {
        super();
        this.heroes = [];
    }

    async connectedCallback() {
        this.render();
        await this.loadHeroes();
        this.setupEventListeners();
    }

    async loadHeroes() {
        try {
            this.heroes = await getHeroes();
            this.renderCards();
        } catch (error) {
            console.error('Error al cargar los héroes:', error);
            this.showError();
        }
    }

    setupEventListeners() {
        // Escuchar el evento de búsqueda
        const searchBar = this.querySelector('search-bar');
        if (searchBar) {
            searchBar.addEventListener('search-results', (event) => {
                if (event.detail.heroes && event.detail.heroes.length > 0) {
                    this.heroes = event.detail.heroes;
                    this.renderCards();
                } else {
                    this.loadHeroes();
                }
            });
        }
    }

    render() {
        this.innerHTML = `
            <header class="search-container">
                <h1 class="text-3xl font-bold text-white text-center mb-4">Heroes Cards</h1>
                <div class="max-w-md mx-auto">
                    <search-bar class="block w-full"></search-bar>
                    <filter-bar></filter-bar>
                </div>
            </header>
            <div class="cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full"></div>
        `;
    }

    renderCards() {
        try {
            const cardsGrid = this.querySelector('.cards-grid');
            if (!cardsGrid) return;

            const comicEffects = ["POW!", "BAM!", "ZOOM!", "WHAM!", "BOOM!", "ZAP!"]

            if (this.heroes.length === 0) {
                cardsGrid.innerHTML = `
                    <div class="col-span-full flex justify-center items-center p-8">
                        <div class="comic-error">
                            <p class="font-bold text-xl text-center" style="font-family: 'Bangers', cursive;">¡OOPS!</p>
                            <p class="text-center">No se encontraron héroes que coincidan con tu búsqueda.</p>
                        </div>
                    </div>
                `;
                return;
            }

            cardsGrid.innerHTML = this.heroes
                .map((hero, index) => {
                    const randomEffect = comicEffects[Math.floor(Math.random() * comicEffects.length)]

                    return `
                        <div class="comic-card" data-id="${hero.id}">
                            <div class="pow-effect">${randomEffect}</div>
                            <h2 class="comic-card-header">${hero.name}</h2>
                            <div class="comic-card-image" style="background-image: url('${hero.image}')"></div>
                            <div class="comic-card-content">
                                <p class="comic-info"><span class="comic-card-label">Nombre Clave:</span> ${hero.alias}</p>
                                <p class="comic-info"><span class="comic-card-label">Casa:</span> ${hero.house}</p>
                                <p class="comic-info"><span class="comic-card-label">Año:</span> ${hero.ageAppearance}</p>
                                <p class="comic-card-description" data-full-description="${hero.fullDescription}">
                                    <span class="comic-card-label">Descripción:</span> 
                                    ${hero.description.substring(0, 100)}${hero.description.length > 100 ? "..." : ""}
                                </p>
                                <show-more></show-more>
                            </div>
                        </div>
                    `
                }).join('');
        } catch (error) {
            console.error('Error al renderizar las tarjetas:', error);
            this.showError();
        }
    }

    showError() {
        const cardsGrid = this.querySelector('.cards-grid');
        if (cardsGrid) {
            cardsGrid.innerHTML = `
                <div class="col-span-full flex justify-center items-center p-8">
                    <div class="comic-error">
                        <p class="font-bold text-xl text-center" style="font-family: 'Bangers', cursive;">¡OOPS! ERROR</p>
                        <p class="text-center">No pudimos encontrar a los superhéroes. ¡Parece que están luchando contra el mal en otro lugar!</p>
                    </div>
                </div>
            `;
        }
    }
}

customElements.define('cards-component', CardsComponent);