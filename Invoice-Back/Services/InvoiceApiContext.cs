using Invoice.Models;
using Microsoft.EntityFrameworkCore;

namespace Invoice {
    public class InvoiceApiContext: DbContext {

        public InvoiceApiContext(DbContextOptions options) : base(options) {}
        public DbSet<InvoiceModel> Invoices {get; set;}
        public DbSet<InvoiceItem> Items {get; set;}
        public DbSet<Product> Products {get; set;}
        public DbSet<Customer> Customers {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            modelBuilder.Entity<Customer>()
                .HasMany(c => c.Invoices)
                .WithOne(i => i.Customer)
                .HasForeignKey(i => i.CustomerId)
                .OnDelete(DeleteBehavior.SetNull);
                
            modelBuilder.Entity<InvoiceModel>()
                .HasMany(i => i.Items)
                .WithOne(i => i.InvoiceModel)
                .HasForeignKey(i => i.InvoiceModelId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Product>()
                .HasMany(p => p.InvoiceItems)
                .WithOne(i => i.Product)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.SetNull);

        }
    }

}