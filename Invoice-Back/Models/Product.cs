using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Invoice.Models {
    public class Product() {
        [Key]
        public int Id {get; set;}
        public string Title {get; set;}
        public decimal Price {get; set;}
        [JsonIgnore]
        public ICollection<InvoiceItem> InvoiceItems { get; set; }

    }
}