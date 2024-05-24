using System.Text.Json.Serialization;

namespace Invoice.Models {
    public class Customer {
        public int Id {get; set;}
        public string Name {get; set;}
        [JsonIgnore]
        public virtual ICollection<InvoiceModel> Invoices {get; set;}
    }
}