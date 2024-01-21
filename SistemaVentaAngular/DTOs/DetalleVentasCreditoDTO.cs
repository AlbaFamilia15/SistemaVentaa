namespace SistemaVentaAngular.DTOs
{
    public class DetalleVentasCreditoDTO
    {
        public int? IdProducto { get; set; }
        public string? DescripcionProducto { get; set; }
        public int? Cantidad { get; set; }
        public string? PrecioTexto { get; set; }
        public string? TotalTexto { get; set; }
        public int? CantidadML { get; set; }
        public string? CustomerName { get; set; }
        public string? Cost { get; set; }

    }
}
