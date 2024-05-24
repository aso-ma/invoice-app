using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using Invoice.Models;
using Microsoft.AspNetCore.Hosting;

namespace Invoice.Services {
    public class JsonFileInvoiceService
    {
        public JsonFileInvoiceService(IWebHostEnvironment webHostEnvironment)
        {
            WebHostEnvironment = webHostEnvironment;
        }

        public IWebHostEnvironment WebHostEnvironment { get; }

        private string InvoicesFileName => Path.Combine(WebHostEnvironment.WebRootPath, "data", "invoices.json");
        private string ProductsFileName => Path.Combine(WebHostEnvironment.WebRootPath, "data", "products.json");
        private string CustomersFileName => Path.Combine(WebHostEnvironment.WebRootPath, "data", "customers.json");

        public IEnumerable<InvoiceModel> GetInvoices()
        {
            using var jsonFileReader = File.OpenText(InvoicesFileName);

            // JsonSerializerSettings settings = new JsonSerializerSettings
            // {
            //     DateParseHandling = DateParseHandling.DateTime
            // };
            // return JsonConvert.DeserializeObject<List<InvoiceModel>>(jsonFileReader.ReadToEnd(), settings);

            return JsonSerializer.Deserialize<InvoiceModel[]>(jsonFileReader.ReadToEnd(),
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    Converters = { new CustomDateTimeConverter("yyyy-MM-ddTHH:mm:ss") }
                });
        }

        public IEnumerable<Product> GetProducts() {
            using var jsonFileReader = File.OpenText(ProductsFileName);
            return JsonSerializer.Deserialize<Product[]>(
                jsonFileReader.ReadToEnd(),
                new JsonSerializerOptions {PropertyNameCaseInsensitive = true}
            );
        }

        public IEnumerable<Customer> GetCustomers() {
            using var jsonFileReader = File.OpenText(CustomersFileName);
            return JsonSerializer.Deserialize<Customer[]>(
                jsonFileReader.ReadToEnd(),
                new JsonSerializerOptions {PropertyNameCaseInsensitive = true}
            );
        }

        
    }

    public class CustomDateTimeConverter : JsonConverter<DateTime>
{
    private readonly string _format; // Specify your custom date format here

    public CustomDateTimeConverter(string format)
    {
        _format = format;
    }

    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return DateTime.ParseExact(value, _format, CultureInfo.InvariantCulture);
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(_format)); // Adjust format for output if needed
    }
}
}