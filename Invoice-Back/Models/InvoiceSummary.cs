using System.Text.Json.Serialization;

namespace Invoice.Models {

    public class InvoiceSummary{
        public int Id {get; set;}
        public string? Title {get; set;}
        public string? Customer {get; set;}
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt {get; set;}
        [JsonPropertyName("total_price")]
        public decimal TotalPrice {get; set;}

    }
}