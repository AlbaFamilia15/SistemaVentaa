namespace SistemaVentaAngular.DTOs
{
    public class VentasCreditoDTO
    {
        public int IdVentasCredito { get; set; }
        public string? NumeroDocumento { get; set; }
        public string? TipoPago { get; set; }
        public string? FechaRegistro { get; set; }
        public string? TotalTexto { get; set; }

        public virtual ICollection<DetalleVentasCreditoDTO>? DetalleVentasCredito { get; set; }
    }
}
