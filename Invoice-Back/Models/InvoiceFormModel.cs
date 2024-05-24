using System.Text.Json.Serialization;

namespace Invoice.Models {
    public class InvoiceModelForm {
        public int Id {get; set;}
        public string Title {get; set;}
        public int CustomerId {get; set;}
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt {get; set;} 
        public ICollection<InvoiceItemForm> Items {get; set;}
    }

    public class InvoiceItemForm {
        public int Id {get; set;}
        public int ProductId {get; set;}
        public int Count {get; set;}
    
    }
}