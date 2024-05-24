using Invoice.Services;
using Microsoft.AspNetCore.Mvc;

namespace Invoice.Controllers {
    
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    public class ProductsController: Controller {

        private readonly IProductService _productService;

        public ProductsController(IProductService service) {
            _productService = service;
        }

        [HttpGet(Name = nameof(GetProductsAsync))]
        public async Task<IActionResult> GetProductsAsync(CancellationToken ct) {
            var products = await _productService.GetProducts(ct);
            return Ok(products);
        }

    }
}