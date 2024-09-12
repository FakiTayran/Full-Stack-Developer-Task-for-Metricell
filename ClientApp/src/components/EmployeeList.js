import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Table, Pagination, Form, Container, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import {
    incrementValues,
    getSumOfABCValues
} from '../apiServices/listService';
import {
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
} from '../apiServices/employeeService';
import './EmployeeList.css'; 

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState({ name: '', value: 0 });
    const [updateEmployeeData, setUpdateEmployeeData] = useState({ name: '', value: 0 });
    const [sumABC, setSumABC] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); 
    const [pageSize, setPageSize] = useState(5); 
    const [totalEmployees, setTotalEmployees] = useState(0); 
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('name'); 

    const loadEmployees = useCallback(async () => {
        try {
            const { employees, totalCount } = await fetchEmployees(currentPage, pageSize, sortField);
            setEmployees(employees);
            setTotalEmployees(totalCount); 
            setTotalPages(Math.ceil(totalCount / pageSize)); 
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        }
    }, [currentPage, pageSize, sortField]);

    useEffect(() => {
        loadEmployees();
    }, [currentPage, pageSize, sortField, loadEmployees]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        setCurrentPage(1); 
    };

    const handleSortChange = (e) => {
        setSortField(e.target.value);
        setCurrentPage(1); // Reset to the first page when sorting changes
    };

    const handleAddEmployee = async () => {
        try {
            await addEmployee(newEmployee);
            setNewEmployee({ name: '', value: 0 });
            loadEmployees();
            toast.success('Employee added successfully!');
        } catch (err) {
            toast.error(`Error adding employee: ${err.message}`);
        }
    };

    const handleUpdateEmployee = async () => {
        try {
            await updateEmployee(updateEmployeeData);
            setUpdateEmployeeData({ name: '', value: 0 });
            loadEmployees();
            setShowModal(false);
            toast.success('Employee updated successfully!');
        } catch (err) {
            toast.error(`Error updating employee: ${err.message}`);
        }
    };

    const handleDeleteEmployee = async () => {
        try {
            await deleteEmployee(employeeToDelete.name);
            setShowDeleteConfirm(false);
            loadEmployees();
            toast.success('Employee deleted successfully!');
        } catch (err) {
            toast.error(`Error deleting employee: ${err.message}`);
        }
    };

    const handleIncrementValues = async () => {
        try {
            await incrementValues();
            loadEmployees();
            toast.success('Employee values incremented successfully!');
        } catch (err) {
            toast.error(`Error incrementing values: ${err.message}`);
        }
    };

    const handleGetSumOfABCValues = async () => {
        try {
            const sum = await getSumOfABCValues();
            setSumABC(sum);
            toast.success('Sum of A, B, C retrieved successfully!');
        } catch (err) {
            toast.error(`Error retrieving sum: ${err.message}`);
        }
    };

    const openUpdateModal = (employee) => {
        setUpdateEmployeeData(employee);
        setShowModal(true);
    };

    const openDeleteConfirmModal = (employee) => {
        setEmployeeToDelete(employee);
        setShowDeleteConfirm(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setShowDeleteConfirm(false);
    };

    return (
        <Container fluid>
            <Row>
                <Col xs={12} md={3} className="sidebar">
                    <Button className="sidebar-button" onClick={handleIncrementValues}>
                        Increment Employee Values
                    </Button>
                    <Button className="sidebar-button" onClick={handleGetSumOfABCValues}>
                        Get Sum of A, B, C
                    </Button>
                    {sumABC !== null && (
                        <div className="result-label">
                            {sumABC === 0
                                ? 'Value is less than 11172'
                                : `Sum of A, B, C: ${sumABC}`}
                        </div>
                    )}
                </Col>
                <Col xs={12} md={9} className="main-content">
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    
                    <input
                        type="text"
                        placeholder="Name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Value"
                        value={newEmployee.value}
                        onChange={(e) => setNewEmployee({ ...newEmployee, value: parseInt(e.target.value) })}
                    />
                    <br></br>
                    <br></br>
                    <Button onClick={handleAddEmployee}>Add Employee</Button>
                    <br></br>
                    <br></br>
                    <h2>Employees</h2>

                    <Row>
                        <Col md={4}>
                            <Form.Group controlId="pageSizeSelect">
                                <Form.Label>Page Size</Form.Label>
                                <Form.Control as="select" value={pageSize} onChange={handlePageSizeChange}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="sortSelect">
                                <Form.Label>Sort By</Form.Label>
                                <Form.Control as="select" value={sortField} onChange={handleSortChange}>
                                    <option value="name">Name</option>
                                    <option value="value">Value</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="table-container">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.name}>
                                        <td>{employee.name}</td>
                                        <td>{employee.value}</td>
                                        <td>
                                            <Button variant="primary" onClick={() => openUpdateModal(employee)}>Update</Button>{' '}
                                            <Button variant="danger" onClick={() => openDeleteConfirmModal(employee)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    <Pagination>
                        {[...Array(totalPages).keys()].map(pageNumber => (
                            <Pagination.Item
                                key={pageNumber + 1}
                                active={pageNumber + 1 === currentPage}
                                onClick={() => handlePageChange(pageNumber + 1)}
                            >
                                {pageNumber + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>

                    <p>Total Employees: {totalEmployees}</p>

                    <Modal show={showModal} onHide={closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Employee</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input
                                type="text"
                                placeholder="Name"
                                value={updateEmployeeData.name}
                                onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, name: e.target.value })}
                                disabled
                            />
                            <input
                                type="number"
                                placeholder="New Value"
                                value={updateEmployeeData.value}
                                onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, value: parseInt(e.target.value) })}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleUpdateEmployee}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showDeleteConfirm} onHide={closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete {employeeToDelete?.name}?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDeleteEmployee}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
            <ToastContainer />
        </Container>
    );
}

export default EmployeeList;
