using SistemaVentaAngular.Models;

namespace SistemaVentaAngular.DTOs
{
    public class VentasCreditReporteDTO
    {
        public string? NumeroDocumento { get; set; }
        public string? TipoPago { get; set; }
        public string? FechaRegistro { get; set; }
        public string? TotalVenta { get; set; }

        public string? Producto { get; set; }
        public int? Cantidad { get; set; }
        public string? Precio { get; set; }
        public string? Total { get; set; }
        public string? customerName { get; set; }
        public bool? isPaid { get; set; }
    }
}
