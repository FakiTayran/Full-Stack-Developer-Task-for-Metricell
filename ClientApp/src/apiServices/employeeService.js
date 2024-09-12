const API_URL = process.env.REACT_APP_API_URL + "employees";

export const fetchEmployees = async (page = 1, pageSize = 10, sort = "name") => {
    const url = `${API_URL}/GetEmployees?pageNumber=${page}&pageSize=${pageSize}&sortColumn=${sort}&_=${new Date().getTime()}`;
    console.log(`Fetching data from URL: ${url}`);
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        console.log('Received data:', data);
        
        return {
            employees: data.employees, 
            totalCount: data.totalCount  
        };
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error; 
    }
};

export const addEmployee = async (employee) => {
    try {
        const response = await fetch(`${API_URL}/AddEmployee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        });
        if (!response.ok) {
            throw new Error('Failed to add employee');
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        throw error;
    }
};

export const updateEmployee = async (employee) => {
    try {
        const response = await fetch(`${API_URL}/UpdateEmployee`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        });
        if (!response.ok) {
            throw new Error('Failed to update employee');
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};

export const deleteEmployee = async (name) => {
    try {
        const response = await fetch(`${API_URL}/DeleteEmployee/${name}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete employee with name: ${name}`);
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};
