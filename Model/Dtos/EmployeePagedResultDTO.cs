using System.Collections.Generic;

namespace InterviewTest.Model
{
    public class EmployeePagedResultDTO
    {
        public IEnumerable<Employee> Employees { get; set; }
        public int TotalCount { get; set; }
    }
}
