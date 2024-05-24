using Invoice.Models;

namespace Invoice.Services {

    public interface IProductService {
        Task<IEnumerable<Product>> GetProducts(CancellationToken ct);
    }


}