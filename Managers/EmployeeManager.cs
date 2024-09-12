using System;
using System.Collections.Generic;
using Microsoft.Data.Sqlite;
using InterviewTest.Model;

public class EmployeeManager : IEmployeeService
{
    private readonly string _connectionString;

    public EmployeeManager()
    {
        var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
        _connectionString = connectionStringBuilder.ConnectionString;
    }
    public IEnumerable<Employee> GetAllEmployees()
    {
        try
        {
            var employees = new List<Employee>();
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "SELECT * FROM Employees";

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var employee = new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        };
                        employees.Add(employee);
                    }
                }
            }
            return employees;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving employees", ex);
        }
    }

    public EmployeePagedResultDTO GetEmployees(int pageNumber, int pageSize, string sortColumn = "Name")
    {
        var employees = new List<Employee>();
        var totalCount = 0;

        using (var connection = new SqliteConnection(_connectionString))
        {
            connection.Open();

            var countCmd = connection.CreateCommand();
            countCmd.CommandText = "SELECT COUNT(*) FROM Employees";
            totalCount = Convert.ToInt32(countCmd.ExecuteScalar());

            var command = connection.CreateCommand();
            command.CommandText = $@"
                SELECT Name, Value 
                FROM Employees 
                ORDER BY {sortColumn} 
                LIMIT @pageSize OFFSET @offset";
            
            command.Parameters.AddWithValue("@pageSize", pageSize);
            command.Parameters.AddWithValue("@offset", (pageNumber - 1) * pageSize);

            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    employees.Add(new Employee
                    {
                        Name = reader.GetString(0),
                        Value = reader.GetInt32(1)
                    });
                }
            }
        }

        return new EmployeePagedResultDTO
        {
            Employees = employees,
            TotalCount = totalCount
        };
    }

    public Employee GetEmployee(string name)
    {
        try
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "SELECT * FROM Employees WHERE Name = @name";
                command.Parameters.AddWithValue("@name", name);

                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        };
                    }
                }
            }
            return null;
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while retrieving the employee with name {name}", ex);
        }
    }

    public void AddEmployee(Employee employee)
    {
        try
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "INSERT INTO Employees (Name, Value) VALUES (@name, @value)";
                command.Parameters.AddWithValue("@name", employee.Name);
                command.Parameters.AddWithValue("@value", employee.Value);
                command.ExecuteNonQuery();
            }
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while adding a new employee", ex);
        }
    }

    public void UpdateEmployee(Employee employee)
    {
        try
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "UPDATE Employees SET Value = @value WHERE Name = @name";
                command.Parameters.AddWithValue("@name", employee.Name);
                command.Parameters.AddWithValue("@value", employee.Value);
                command.ExecuteNonQuery();
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while updating the employee with name {employee.Name}", ex);
        }
    }

    public void DeleteEmployee(string name)
    {
        try
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "DELETE FROM Employees WHERE Name = @name";
                command.Parameters.AddWithValue("@name", name);
                command.ExecuteNonQuery();
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while deleting the employee with name {name}", ex);
        }
    }

    public void IncrementValues()
    {
        try
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = @"
                    UPDATE Employees
                    SET Value = CASE 
                        WHEN Name LIKE 'E%' THEN Value + 1
                        WHEN Name LIKE 'G%' THEN Value + 10
                        ELSE Value + 100
                    END";
                command.ExecuteNonQuery();
            }
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while incrementing employee values", ex);
        }
    }

    public int GetSumOfABCValues()
    {
        try
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = @"
                    SELECT SUM(Value) AS TotalSum
                    FROM Employees
                    WHERE Name LIKE 'A%' OR Name LIKE 'B%' OR Name LIKE 'C%'
                    HAVING SUM(Value) >= 11171";

                var result = command.ExecuteScalar();
                return result != DBNull.Value ? Convert.ToInt32(result) : 0;
            }
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while calculating the sum of employee values for names starting with A, B, or C", ex);
        }
    }

    
}
