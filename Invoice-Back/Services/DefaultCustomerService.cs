using Invoice.Models;
using Microsoft.EntityFrameworkCore;

namespace Invoice.Services {
    public class DefaultCustomerService: ICustomerService {

        private readonly InvoiceApiContext _context;

        public DefaultCustomerService (InvoiceApiContext context) {
            _context = context;
        }

        public async Task<IEnumerable<Customer>> GetCustomers(CancellationToken ct) {
            var customers = await _context.Customers.ToListAsync();
            return customers;
        }
    }
}