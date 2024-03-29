﻿namespace SistemaVentaAngular.DTOs
{
    public class ProductoDTO
    {
        public int IdProducto { get; set; }
        public string? Nombre { get; set; }
        public int? IdCategoria { get; set; }
        public string? DescripcionCategoria { get; set; }
        public int? Stock { get; set; }
        public decimal? Precio { get; set; }
        public decimal? Precio3ML { get; set; }
        public decimal? Precio5ML { get; set; }
        public decimal? Precio10ML { get; set; }
        public decimal? Precio15ML { get; set; }
        public decimal? Precio30ML { get; set; }
        public decimal? Precio100ML { get; set; }
        public int? cantidadML { get; set; }
        public decimal? NetPrice { get; set; }
        public bool? isCantidad { get; set; }
        public string? image { get; set; }
        public string? imagePath { get; set; }
        public int? Cost { get; set; }
        public int? Cost3ML { get; set; }
        public int? Cost5ML { get; set; }
        public int? Cost10ML { get; set; }
        public int? Cost15ML { get; set; }
        public int? Cost30ML { get; set; }
        public int? Cost100ML { get; set; }
    }
}
