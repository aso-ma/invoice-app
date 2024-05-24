using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.Json.Serialization;
using AutoMapper.Configuration.Annotations;
using Microsoft.EntityFrameworkCore;

namespace Invoice.Models {

    public class InvoiceModel {
        [Key]
        public int Id {get; set;}
        public string Title {get; set;}
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt {get; set;} 
        public virtual ICollection<InvoiceItem> Items {get; set;}
        public int CustomerId {get; set;}
        public virtual Customer Customer {get; set;}
        
    }

}