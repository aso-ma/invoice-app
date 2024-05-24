using Invoice.Models;
using Microsoft.EntityFrameworkCore;

namespace Invoice.Services { 

    public class DefaultProductService: IProductService {

        private readonly InvoiceApiContext _context;

        public DefaultProductService (InvoiceApiContext context) {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetProducts(CancellationToken ct) {
            var products = await _context.Products.ToListAsync();
            return products;
        }
    }
}