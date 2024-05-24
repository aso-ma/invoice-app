using Invoice.Models;

namespace Invoice.Services {

    public class DatabaseSeederService {

        private readonly InvoiceApiContext _context;
        private readonly JsonFileInvoiceService _jsonService;

        public DatabaseSeederService (
            InvoiceApiContext context,
            JsonFileInvoiceService jsonService
        ) {
            _context = context;
            _jsonService = jsonService; 
        }   

        public void Seed() {
            // Seed Products
            foreach (var product in _jsonService.GetProducts()) {
                _context.Products.Add(product);
            }
            // Seed Customers
            foreach (var customer in _jsonService.GetCustomers()) {
                _context.Customers.Add(customer);
            }

            foreach (var invoice in _jsonService.GetInvoices()) {
                // invoice.Items = new List<InvoiceItem>(invoice.Items);
                _context.Invoices.Add(invoice);
            }

            _context.SaveChanges();


        }


    }

}