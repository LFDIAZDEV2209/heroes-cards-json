import { getHeroes } from "../services/heroesServices";
import "./show-more.js";

export class CardComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    async render() {
        try {
            const heroes = await getHeroes();
            const comicEffects = ["POW!", "BAM!", "ZOOM!", "WHAM!", "BOOM!", "ZAP!"]

            this.innerHTML = heroes
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
            console.error('Error al cargar los héroes:', error);
            this.innerHTML = `
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

customElements.define('cards-component', CardComponent);