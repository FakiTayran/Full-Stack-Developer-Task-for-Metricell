const API_URL = process.env.REACT_APP_API_URL + "list";

export const incrementValues = async () => {
    try {
        const response = await fetch(`${API_URL}/increment-values`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error('Failed to increment employee values');
        }
    } catch (error) {
        console.error('Error incrementing values:', error);
        throw error;
    }
};

export const getSumOfABCValues = async () => {
    try {
        const response = await fetch(`${API_URL}/sum-abc`);
        if (!response.ok) {
            throw new Error('Failed to get sum of ABC employee values');
        }
        const result = await response.json();
        return result.sum;
    } catch (error) {
        console.error('Error getting sum of ABC values:', error);
        throw error;
    }
};
