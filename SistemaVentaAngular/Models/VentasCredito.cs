namespace SistemaVentaAngular.Models
{
    public partial class VentasCredito
    {
        public VentasCredito()
        {
            DetalleVentasCredito = new HashSet<DetalleVentasCredito>();
        }

        public int IdVentasCredito { get; set; }
        public string? NumeroDocumento { get; set; }
        public string? TipoPago { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public decimal? Total { get; set; }

        public virtual ICollection<DetalleVentasCredito> DetalleVentasCredito { get; set; }

    }
}
