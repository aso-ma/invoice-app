using Invoice.Services;
using Microsoft.AspNetCore.Mvc;

namespace Invoice.Controllers {
    
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    public class CustomersController: Controller {

        private readonly ICustomerService _customerService;

        public CustomersController(ICustomerService service) {
            _customerService = service;
        }

        [HttpGet(Name = nameof(GetCustomersAsync))]
        public async Task<IActionResult> GetCustomersAsync(CancellationToken ct) {
            var customers = await _customerService.GetCustomers(ct);
            return Ok(customers);
        }

    }
}