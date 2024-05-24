using Invoice.Models;

namespace Invoice.Services {
    public interface ICustomerService {
        Task<IEnumerable<Customer>> GetCustomers(CancellationToken ct);
    }
}