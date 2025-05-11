export class FilterBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="filter-bar flex justify-center items-center p-4">
                <select 
                    name="house" 
                    id="house"
                    class="comic-select p-2 border-3 border-black rounded-lg font-bangers text-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option value="all">Todas las casas</option>
                    <option value="marvel">Marvel</option>
                    <option value="dc">DC</option>
                </select>
            </div>
        `
    }
}

customElements.define("filter-bar", FilterBar);