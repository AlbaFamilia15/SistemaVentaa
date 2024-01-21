namespace SistemaVentaAngular.Models
{
    public partial class DetalleVentasCredito
    {
        public int IdDetalleVentasCredito { get; set; }
        public int? IdVentasCredito { get; set; }
        public int? IdProducto { get; set; }
        public int? Cantidad { get; set; }
        public decimal? Precio { get; set; }
        public decimal? Total { get; set; }
        public decimal? CantidadML { get; set; }
        public string? CustomerName { get; set; }
        public int? Cost { get; set; }
        public virtual Producto? IdProductoNavigation { get; set; }
        public virtual VentasCredito? IdVentasCreditoNavigation { get; set; }
    }
}
