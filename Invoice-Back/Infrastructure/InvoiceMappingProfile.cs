using AutoMapper;
using Invoice.Models;

namespace Invoice.Infrastructure {
    public class InvoiceMappingProfile: Profile {

        public InvoiceMappingProfile() {
            CreateMap<InvoiceModel, InvoiceSummary>()
                .ForMember(
                    dest => dest.TotalPrice, 
                    opt => opt.MapFrom(
                        src => src.Items.Sum(i => i.Count * i.Product.Price)
                    )
                )
                .ForMember(
                   dest => dest.Customer,
                   opt => opt.MapFrom(src => src.Customer.Name) 
                );

        }

        

    }
}