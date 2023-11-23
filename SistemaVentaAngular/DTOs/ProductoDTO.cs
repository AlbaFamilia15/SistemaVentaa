﻿namespace SistemaVentaAngular.DTOs
{
    public class ProductoDTO
    {
        public int IdProducto { get; set; }
        public string? Nombre { get; set; }
        public int? IdCategoria { get; set; }
        public string? DescripcionCategoria { get; set; }
        public int? Stock { get; set; }
        public string? Precio { get; set; }
        public int? cantidadML { get; set; }
        public decimal? NetPrice { get; set; }
        public bool? isCantidad { get; set; }
        public string? image { get; set; }
        public string? imagePath { get; set; }
        public int? Cost { get; set; }
    }
}
