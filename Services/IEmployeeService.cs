using System.Collections.Generic;
using InterviewTest.Model;

public interface IEmployeeService
{
    IEnumerable<Employee> GetAllEmployees();
    EmployeePagedResultDTO GetEmployees(int pageNumber, int pageSize, string sortColumn = "Name");
    Employee GetEmployee(string name);
    void AddEmployee(Employee employee);
    void UpdateEmployee(Employee employee);
    void DeleteEmployee(string name);
    void IncrementValues();
    int GetSumOfABCValues();
}

