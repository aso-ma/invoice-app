using AutoMapper;
using Invoice.Infrastructure;
using Invoice.Models;
using Microsoft.EntityFrameworkCore;
namespace Invoice.Services {

    public class DefaultInvoiceService : IInvoiceService {

        private readonly InvoiceApiContext _context;
        private readonly IMapper _mapper;

        public DefaultInvoiceService(InvoiceApiContext context, IMapper mapper) {
            _context = context; 
            _mapper = mapper;
        }

        public async Task<IEnumerable<InvoiceSummary>> GetInvoicesAsync(CancellationToken ct) {
            var temp_invoices = await _context.Invoices
                .Include(i => i.Customer) 
                .Include(i => i.Items)
                .ThenInclude(ii => ii.Product)
                .ToListAsync(ct);
            return _mapper.Map<IEnumerable<InvoiceSummary>>(temp_invoices);
        }

        public async Task<InvoiceModel> GetInvoiceAsync(int invoiceId, CancellationToken ct) {
            var entity = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Items)
                .ThenInclude(ii => ii.Product)
                .FirstOrDefaultAsync(i => i.Id == invoiceId, ct);
            return entity;
        }

        public async Task<int> CreateInvoiceAsync(InvoiceModelForm invoiceModelForm, CancellationToken ct) {
            var invoice = new InvoiceModel
            {
                Title = invoiceModelForm.Title,
                CustomerId = invoiceModelForm.CustomerId,
                CreatedAt = invoiceModelForm.CreatedAt,
                Items = invoiceModelForm.Items.Select(i => new InvoiceItem
                {
                    ProductId = i.ProductId,
                    Count = i.Count
                }).ToList()
            };

            _context.Invoices.Add(invoice);
            var created = await _context.SaveChangesAsync(ct);
            if (created < 1) throw new InvalidOperationException("Could not create the Invoice.");
            return invoice.Id;
        }

        public async Task DeleteInvoiceAsync(int invoiceId, CancellationToken ct) {
            var invoiceModel = await _context.Invoices .SingleOrDefaultAsync(i => i.Id == invoiceId, ct);
            if (invoiceModel == null) return;
            _context.Invoices.Remove(invoiceModel);
            await _context.SaveChangesAsync();
        }

        public async Task<int> UpdateInvoiceAsync(int invoiceId, InvoiceModelForm invoiceModelForm, CancellationToken ct) {
            var existingEntity = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Items)
                .ThenInclude(ii => ii.Product)
                .FirstOrDefaultAsync(i => i.Id == invoiceId, ct);
            if (existingEntity == null) {
                throw new InvalidOperationException("There is no invoice associated with this Id.");
            }

            existingEntity.Title = invoiceModelForm.Title;
            existingEntity.CustomerId = invoiceModelForm.CustomerId;
            // existingEntity.Customer = _context.Customers.FirstOrDefault(c => c.Id == invoiceModelForm.CustomerId);

            var productIds = existingEntity.Items.Select(ii => ii.Product.Id).ToList();
            var receivedProductIds = invoiceModelForm.Items.Select(item => item.ProductId).ToList();

            var productsToRemove = productIds.Except(receivedProductIds).ToList();
            var itemsToRemove = existingEntity.Items.Where(item => productsToRemove.Contains(item.Product.Id)).ToList();
            foreach (var item in itemsToRemove) {
                existingEntity.Items.Remove(item);
                _context.Items.Remove(item);
            }

            var productsToAdd = receivedProductIds.Except(productIds).ToList();
            foreach (var productId in productsToAdd) {
                var count = invoiceModelForm.Items.Where(item => item.ProductId == productId).First().Count;
                existingEntity.Items.Add(new InvoiceItem {
                    ProductId = productId,
                    Count = count
                });
            }

            List<int> unchangedIds = productIds.Intersect(receivedProductIds).ToList();
            foreach(var productId in unchangedIds) {
                var count = invoiceModelForm.Items.Where(item => item.ProductId == productId).First().Count;
                var item = existingEntity.Items.FirstOrDefault(i => i.ProductId == productId);
                if (count != item.Count) {
                    item.Count = count;
                } 
            }
            
            await _context.SaveChangesAsync();
            return existingEntity.Id;
        }

  
    }

}