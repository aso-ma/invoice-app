
using Invoice.Models;

namespace Invoice.Services {
    public interface IInvoiceService {
        Task<IEnumerable<InvoiceSummary>> GetInvoicesAsync(CancellationToken ct);
        Task<InvoiceModel> GetInvoiceAsync(int invoiceId, CancellationToken ct);
        Task<int> CreateInvoiceAsync(InvoiceModelForm invoiceModelForm, CancellationToken ct);
        Task DeleteInvoiceAsync(int invoiceId, CancellationToken ct);
        Task<int> UpdateInvoiceAsync(int invoiceId, InvoiceModelForm invoiceModel, CancellationToken ct);

    }
}