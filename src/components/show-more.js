import { deleteHero } from "../services/heroesServices";
import { putHero } from "../services/heroesServices";
import Swal from 'sweetalert2';

export class ShowMore extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    connectedCallback() {
        this.eventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="flex justify-center mt-4">
                <button class="comic-button">¡Ver más!</button>
            </div>
        `;
    }

    showModal() {
        console.log('ShowModal called');
        const card = this.closest('.comic-card');
        console.log('Card found:', card);
        
        if (!card) {
            console.error('No card found');
            return;
        }
    
        const heroId = card.dataset.id;
        const hero = {
            name: card.querySelector('.comic-card-header').textContent,
            alias: card.querySelector('.comic-info:nth-child(1)').textContent.replace('Nombre Clave:', '').trim(),
            house: card.querySelector('.comic-info:nth-child(2)').textContent.replace('Casa:', '').trim(),
            ageAppearance: card.querySelector('.comic-info:nth-child(3)').textContent.replace('Año:', '').trim(),
            description: card.querySelector('.comic-card-description').textContent.replace('Descripción:', '').trim(),
            image: card.querySelector('.comic-card-image').style.backgroundImage.slice(4, -1).replace(/"/g, ""),
            fullDescription: card.querySelector('.comic-card-description').getAttribute('data-full-description')
        };
    
        console.log('Hero data:', hero);
    
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn';
        modal.innerHTML = `
            <div class="bg-white p-6 max-w-2xl w-11/12 relative border-3 border-black shadow-lg animate-scaleIn">
                <button class="absolute top-2 right-2 text-2xl font-bold cursor-pointer hover:text-red-600 transition-colors">×</button>
                <div class="h-64 w-full bg-cover bg-center border-3 border-black mb-4" style="background-image: url('${hero.image}')"></div>
                <div class="space-y-2">
                    <h2 class="font-bangers text-3xl text-center mb-4">${hero.name}</h2>
                    <p class="comic-info"><span class="comic-card-label">Nombre Clave:</span> ${hero.alias}</p>
                    <p class="comic-info"><span class="comic-card-label">Casa:</span> ${hero.house}</p>
                    <p class="comic-info"><span class="comic-card-label">Año de Aparición:</span> ${hero.ageAppearance}</p>
                    <p class="comic-info"><span class="comic-card-label">Descripción:</span> ${hero.description}</p>
                    <p class="comic-info"><span class="comic-card-label">Descripción Completa:</span></p>
                    <p class="comic-info">${hero.fullDescription}</p>
                    <div class="flex justify-around mt-4">
                        <button class="delete-button bg-red-600 text-white px-4 py-4 rounded hover:bg-red-700 transition-colors flex items-center gap-2 font-bangers text-lg">
                            <i class="fas fa-trash-can"></i>
                        </button>
                        <button class="edit-button bg-blue-600 text-white px-4 py-4 rounded hover:bg-blue-700 transition-colors flex items-center gap-2 font-bangers text-lg">
                            <i class="fas fa-pen-to-square"></i>
                        </button>
                    </div>
                </div>
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
    
        // Agregar evento para el botón de eliminar
        const deleteButton = modal.querySelector('.delete-button');
        deleteButton.addEventListener('click', async () => {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });
    
            if (result.isConfirmed) {
                try {
                    const response = await deleteHero(heroId);
                    if (response.ok) {
                        // Cerrar el modal
                        modal.remove();
                        // Eliminar la tarjeta del DOM
                        card.remove();
                        // Mostrar mensaje de éxito
                        Swal.fire(
                            '¡Eliminado!',
                            'El héroe ha sido eliminado.',
                            'success'
                        );
                    } else {
                        throw new Error('Error al eliminar');
                    }
                } catch (error) {
                    Swal.fire(
                        'Error',
                        'No se pudo eliminar el héroe.',
                        'error'
                    );
                }
            }
        });
    
        // Agregar evento para el boton de editar 
        const editButton = modal.querySelector('.edit-button');
        editButton.addEventListener('click', () => {
            modal.innerHTML = `
            <div class="bg-white p-6 max-w-2xl w-11/12 relative border-3 border-black shadow-lg animate-scaleIn">
                <form id="editHeroForm" class="space-y-2">
                    <div class="h-64 w-full bg-cover bg-center border-3 border-black mb-4" style="background-image: url('${hero.image}')"></div>
                    <div class="space-y-2">
                        <h2 class="font-bangers text-3xl text-center mb-4">
                            <input type="text" name="name" value="${hero.name}" class="w-auto p-2 border-2 border-black rounded">
                        </h2>
                        <p class="comic-info">
                            <span class="comic-card-label">Nombre Clave:</span>
                            <input type="text" name="alias" value="${hero.alias}" class="w-auto p-2 border-2 border-black rounded">
                        </p>
                        <p class="comic-info">
                            <span class="comic-card-label">Casa:</span>
                            <select name="house" class="w-auto p-2 border-2 border-black rounded">
                                <option value="DC" ${hero.house === 'DC' ? 'selected' : ''}>DC</option>
                                <option value="Marvel" ${hero.house === 'Marvel' ? 'selected' : ''}>Marvel</option>
                            </select>
                        </p>
                        <p class="comic-info">
                            <span class="comic-card-label">Año de Aparición:</span>
                            <input type="number" name="ageAppearance" value="${hero.ageAppearance}" class="w-auto p-2 border-2 border-black rounded">
                        </p>
                        <p class="comic-info">
                            <span class="comic-card-label">Descripción:</span>
                            <input type="text" name="description" value="${hero.description}" class="w-auto p-2 border-2 border-black rounded">
                        </p>
                        <p class="comic-info">
                            <span class="comic-card-label">Descripción Completa:</span>
                            <textarea name="fullDescription" class="w-full p-2 border-2 border-black rounded">${hero.fullDescription}</textarea>
                        </p>
                        <div class="flex justify-around mt-4">
                            <button type="button" class="cancel-button bg-red-600 text-white px-4 py-4 rounded hover:bg-red-700 transition-colors flex items-center gap-2 font-bangers text-lg">
                                <i class="fas fa-times"></i>
                            </button>
                            <button type="submit" class="confirm-button bg-blue-600 text-white px-4 py-4 rounded hover:bg-blue-700 transition-colors flex items-center gap-2 font-bangers text-lg">
                                <i class="fas fa-check"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>`;

            const form = modal.querySelector('#editHeroForm');
            const cancelButton = modal.querySelector('.cancel-button');
            
            cancelButton.addEventListener('click', () => {
                modal.remove();
            });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const updatedHero = {
                    name: formData.get('name'),
                    alias: formData.get('alias'),
                    house: formData.get('house'),
                    ageAppearance: formData.get('ageAppearance'),
                    description: formData.get('description'),
                    fullDescription: formData.get('fullDescription'),
                    image: hero.image
                };

                try {
                    const response = await putHero(heroId, updatedHero);
                    if (response.ok) {
                        modal.remove();
                        card.querySelector('.comic-card-header').textContent = updatedHero.name;
                        card.querySelector('.comic-info:nth-child(1)').textContent = `Nombre Clave: ${updatedHero.alias}`;
                        card.querySelector('.comic-info:nth-child(2)').textContent = `Casa: ${updatedHero.house}`;
                        card.querySelector('.comic-info:nth-child(3)').textContent = `Año: ${updatedHero.ageAppearance}`;
                        card.querySelector('.comic-card-description').textContent = `Descripción: ${updatedHero.description}`;
                        card.querySelector('.comic-card-description').setAttribute('data-full-description', updatedHero.fullDescription);
                        
                        const labels = card.querySelectorAll('.comic-card-label');
                        labels.forEach(label => {
                            label.style.fontWeight = 'bold';
                            label.style.color = '#2563eb';
                            label.style.fontFamily = 'Bangers, cursive';
                            label.style.fontSize = '1.1em';
                            label.style.textTransform = 'uppercase';
                        });
                        
                        await Swal.fire({
                            title: '¡Actualizado!',
                            text: 'El héroe ha sido actualizado.',
                            icon: 'success'
                        });
                    } else {
                        throw new Error('Error al actualizar');
                    }
                } catch (error) {
                    console.error('Error al actualizar:', error);
                    await Swal.fire({
                        title: 'Error',
                        text: 'No se pudo actualizar el héroe.',
                        icon: 'error'
                    });
                }
            });
        });
    }

    eventListeners() {
        const button = this.querySelector('.comic-button');
        if (button) {
            button.addEventListener('click', () => this.showModal());
        }
    }

}


customElements.define("show-more", ShowMore);


