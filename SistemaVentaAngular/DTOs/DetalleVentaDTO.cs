﻿namespace SistemaVentaAngular.DTOs
{
    public class DetalleVentaDTO
    {
        public int? IdProducto { get; set; }
        public string? DescripcionProducto { get; set; }
        public int? Cantidad { get; set; }
        public string? PrecioTexto { get; set; }
        public string? TotalTexto { get; set; }
        public string? CantidadML { get; set; }
        public string? Cost { get; set; }
    }
}
