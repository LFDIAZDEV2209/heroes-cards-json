const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://server-heroes.onrender.com';
const myHeader = new Headers({
    'Content-Type': 'application/json',
});

export const getHeroes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/heroes`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        } else if (response.status === 401) {
            console.error('Url is not valid');
        } else if (response.status === 404) {
            console.error('Url is not found');
        } else if (response.status === 500) {
            console.error('Internal server error');
        } else {
            console.error('Something went wrong');
        }
    } catch (error) {
        console.error('Error fetching heroes:', error);
    }
}

export const postHero = async (data) => {
    try {
        return await fetch(`${API_BASE_URL}/heroes`, {
            method: 'POST',
            headers: myHeader,
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Error creating hero:', error.message);
        throw error;        
    }
}

export const putHero = async (id, data) => {
    try {
        return await fetch(`${API_BASE_URL}/heroes/${id}`, {
            method: 'PUT',
            headers: myHeader,
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Error updating hero:', error.message);
        throw error;
    }
}

export const deleteHero = async (id) => {
    try {
        return await fetch(`${API_BASE_URL}/heroes/${id}`, {
            method: 'DELETE',
            headers: myHeader,
        });
    } catch (error) {
        console.error('Error deleting hero:', error.message);
        throw error;
    }
}

export const getSearchHero = async (searchTerm) => {
    try {
        const response = await fetch(`${API_BASE_URL}/heroes`);
        if (response.status === 200) {
            const data = await response.json();
            const lower = searchTerm.toLowerCase();
            return data.filter(hero =>
                hero.name.toLowerCase().includes(lower) ||
                hero.alias.toLowerCase().includes(lower) ||
                (hero.house && hero.house.toLowerCase().includes(lower))
            );
        } else if (response.status === 401) {
            console.error('Url is not valid');
        } else if (response.status === 404) {
            console.error('Url is not found');
        } else if (response.status === 500) {
            console.error('Internal server error');
        } else {
            console.error('Something went wrong');
        }
    } catch (error) {
        console.error('Error searching hero:', error.message);
    }
}