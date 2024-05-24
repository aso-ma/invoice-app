using System.Text.Json;
using System.Text.Json.Serialization;
using Invoice.Models;
using Invoice.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Invoice.Controllers {
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    // [RequireHttps]
    public class InvoicesController : Controller { 

        private readonly IInvoiceService _invoiceService;

        public InvoicesController(IInvoiceService invoiceService) {
            _invoiceService = invoiceService;
        }

        [HttpGet(Name = nameof(GetInvoicesAsync))]
        public async Task<IActionResult> GetInvoicesAsync(CancellationToken ct) {
            var invoices = await _invoiceService.GetInvoicesAsync(ct);
            if (invoices == null) return NotFound();
            return Ok(invoices);
        }

        [HttpGet("{invoiceId}", Name = nameof(GetInvoiceByIdAsync))]
        public async Task<IActionResult> GetInvoiceByIdAsync(int invoiceId, CancellationToken ct){
            var entity = await _invoiceService.GetInvoiceAsync(invoiceId, ct);
            if (entity == null) return NotFound();
            return Ok(entity);
        }

        [HttpPost(Name = nameof(CreateInvoiceAsync))]
        public async Task<IActionResult> CreateInvoiceAsync([FromBody] InvoiceModelForm invoiceModel, CancellationToken ct) {
            if (invoiceModel == null || invoiceModel.Items == null || invoiceModel.Items.Count == 0) {
                return BadRequest("Invalid invoice data. Please provide a title and at least one item.");
            }

            try {
                var invoiceId = await _invoiceService.CreateInvoiceAsync(invoiceModel, ct);
                return Ok(new { id = invoiceId});
            } catch (InvalidOperationException) {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("{invoiceId}", Name = nameof(UpdateInvoiceAsync))]
        public async Task<IActionResult> UpdateInvoiceAsync(
            int invoiceId, 
            [FromBody] InvoiceModelForm invoiceModelForm,
            CancellationToken ct
        ) {
            try {
                var updatedInvoiceId = await _invoiceService.UpdateInvoiceAsync(
                    invoiceId, invoiceModelForm, ct
                );
                return Ok(new { id = invoiceId});
            } catch (InvalidOperationException) {
                return StatusCode(StatusCodes.Status404NotFound);
            }
        }

        [HttpDelete("{invoiceId}", Name = nameof(DeleteInvoiceAsync))]
        public async Task<IActionResult> DeleteInvoiceAsync(int invoiceId, CancellationToken ct) {
            await _invoiceService.DeleteInvoiceAsync(invoiceId, ct);
            return Ok();
        }
        
    }
}
