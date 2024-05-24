using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Invoice.Models {

    public class InvoiceItem {
        [Key]
        public int Id {get; set;}
        public int ProductId { get; set;}
        public virtual Product Product { get; set;}
        public int Count {get; set;}
        [JsonIgnore]
        public int InvoiceModelId { get; set; } 
        [JsonIgnore]
        public virtual InvoiceModel InvoiceModel { get; set; }
        
    }

}