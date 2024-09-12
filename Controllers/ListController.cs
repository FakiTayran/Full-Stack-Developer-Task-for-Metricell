using Microsoft.AspNetCore.Mvc;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ListController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public ListController(IEmployeeService employeeService)
        {
             _employeeService = employeeService;
        }

       [HttpPost("increment-values")]
        public IActionResult IncrementValues()
        {
            try
            {
                _employeeService.IncrementValues();
                return Ok("Employee values have been successfully incremented.");
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("sum-abc")]
        public IActionResult GetSumOfABCValues()
        {
            try
            {
                var sum = _employeeService.GetSumOfABCValues();
                return Ok(new { sum });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
