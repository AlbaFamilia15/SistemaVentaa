namespace SistemaVentaAngular.DTOs
{
    public class DetalleVentaDTO
    {
        public int? IdProducto { get; set; }
        public string? DescripcionProducto { get; set; }
        public int? Cantidad { get; set; }
        public decimal? PrecioTexto { get; set; }
        public decimal? TotalTexto { get; set; }
        public int? CantidadML { get; set; }
    }
}
