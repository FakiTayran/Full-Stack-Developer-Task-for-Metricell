using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet("GetEmployees")]
        public ActionResult<EmployeePagedResultDTO> GetEmployees(
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 10, 
            [FromQuery] string sortColumn = "Name")
        {
            try
            {
                var result = _employeeService.GetEmployees(pageNumber, pageSize, sortColumn);
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpGet("GetEmployee")]
        public ActionResult<IEnumerable<Employee>> GetAllEmployees([FromQuery] string name = null)
        {
            try
            {
                if (string.IsNullOrEmpty(name))
                {
                    return Ok(_employeeService.GetAllEmployees());
                }
                var employee = _employeeService.GetEmployee(name);
                if (employee == null)
                {
                    return NotFound($"Employee with name '{name}' not found.");
                }
                return Ok(employee);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("AddEmployee")]
        public IActionResult AddEmployee([FromBody] Employee employee)
        {
            try
            {
                if (employee == null || string.IsNullOrEmpty(employee.Name))
                {
                    return BadRequest("Employee data is invalid.");
                }

                _employeeService.AddEmployee(employee);
                return CreatedAtAction(nameof(GetAllEmployees), new { name = employee.Name }, employee);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("UpdateEmployee")]
        public IActionResult UpdateEmployee([FromBody] Employee employee)
        {
            try
            {
                if (employee == null || string.IsNullOrEmpty(employee.Name))
                {
                    return BadRequest("Employee data is invalid.");
                }

                var existingEmployee = _employeeService.GetEmployee(employee.Name);
                if (existingEmployee == null)
                {
                    return NotFound($"Employee with name '{employee.Name}' not found.");
                }

                _employeeService.UpdateEmployee(employee);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("DeleteEmployee/{name}")]
        public IActionResult DeleteEmployee(string name)
        {
            try
            {
                var employee = _employeeService.GetEmployee(name);
                if (employee == null)
                {
                    return NotFound($"Employee with name '{name}' not found.");
                }

                _employeeService.DeleteEmployee(name);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
