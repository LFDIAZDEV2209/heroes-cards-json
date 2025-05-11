import { postHero } from "../services/heroesServices";
import Swal from 'sweetalert2';

export class HeroAdd extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    connectedCallback() {
        this.eventListeners();
    }

    render() {
        this.innerHTML = `
            <button class="add-hero-button"></button>
        `;
    }

    showModalAdd() {
        const modal = document.createElement("div");
        modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn";
        modal.innerHTML = `
            <div class="bg-white p-6 max-w-2xl w-11/12 relative border-3 border-black shadow-lg animate-scaleIn">
                <button class="absolute top-2 right-2 text-2xl font-bold cursor-pointer hover:text-red-600 transition-colors">×</button>
                <h2 class="font-bangers text-3xl text-center mb-4">Agregar nuevo héroe</h2>
                <form id="hero-form" class="space-y-4">
                    <div>
                        <label class="block font-bold mb-1">Nombre</label>
                        <input 
                            type="text" 
                            name="name" 
                            class="w-full p-2 border-2 border-black rounded" 
                            required
                        >
                    </div>
                    <div>
                        <label class="block font-bold mb-1">Nombre Clave</label>
                        <input 
                            type="text" 
                            name="alias" 
                            class="w-full p-2 border-2 border-black rounded" 
                            required
                        >
                    </div>
                    <div>
                        <label class="block font-bold mb-1">Casa (DC/Marvel)</label>
                        <select 
                            name="house" 
                            class="w-full p-2 border-2 border-black rounded" 
                            required
                        >
                            <option value="DC">DC</option>
                            <option value="Marvel">Marvel</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold mb-1">Año de aparición</label>
                        <input 
                            type="number" 
                            name="ageAppearance" 
                            class="w-full p-2 border-2 border-black rounded" 
                            required
                        >
                    </div>
                    <div>
                        <label class="block font-bold mb-1">URL de la imagen</label>
                        <input 
                            type="url" 
                            name="image" 
                            class="w-full p-2 border-2 border-black rounded" 
                            placeholder="https://ejemplo.com/imagen.jpg"
                            required
                        >
                    </div>
                    <div>
                        <label class="block font-bold mb-1">Descripción</label>
                        <textarea 
                            name="description" 
                            class="w-full p-2 border-2 border-black rounded" 
                            required
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded font-bold hover:bg-blue-700 transition-colors"
                    >
                        Guardar Héroe
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Agregar evento para cerrar el modal
        const closeButton = modal.querySelector('button');
        closeButton.addEventListener('click', () => {
            modal.remove();
        });

        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        const form = modal.querySelector("#hero-form");
        form.addEventListener("submit", this.handleSubmit);
    }

    eventListeners() {
        const button = this.querySelector(".add-hero-button");
        button.addEventListener("click", () => {
            this.showModalAdd();
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const heroData = {
            name: formData.get("name"),
            alias: formData.get("alias"),
            house: formData.get("house"),
            ageAppearance: formData.get("ageAppearance"),
            description: formData.get("description"),
            image: formData.get("image"),
        };

        try {
            const response = await postHero(heroData);
            if (response.ok) {
                // Cerrar el modal
                const modal = document.querySelector('.fixed.inset-0');
                if (modal) modal.remove();

                // Mostrar alerta de éxito
                await Swal.fire({
                    title: "¡Éxito!",
                    text: "Héroe agregado correctamente",
                    icon: "success",
                    confirmButtonText: "¡Genial!"
                });

                // Actualizar la vista
                const cardsComponent = document.querySelector('cards-component');
                if (cardsComponent) {
                    cardsComponent.render();
                }
            } else {
                throw new Error("Server error");
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error al agregar héroe",
                icon: "error",
                confirmButtonText: "Intentar de nuevo"
            });
        }
    }
}

customElements.define("hero-add", HeroAdd);