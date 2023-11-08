namespace SistemaVentaAngular.DTOs
{
    public class DashBoardDTO
    {
        public int TotalVentas { get; set; }
        public string? TotalIngresos { get; set; }
        public string? TotalPaidIngresos { get; set; }
        public int TotalProductos { get; set; }
        public int TotalVentasCredito { get; set; }

        public List<VentasSemanaDTO>? VentasUltimaSemana { get; set; }
    }
}
