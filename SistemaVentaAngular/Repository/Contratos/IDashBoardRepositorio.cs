namespace SistemaVentaAngular.Repository.Contratos
{
    public interface IDashBoardRepositorio
    {
        Task<int> TotalVentasUltimaSemana();
        Task<string> TotalIngresosUltimaSemana();
        Task<int> TotalProductos();
        Task<Dictionary<string, int>> VentasUltimaSemana();
        Task<Dictionary<string, int>> VentasUltimaSemanaFilter(string filtertype, string? startdate, string? enddate);
        Task<int> TotalVentasUltimaSemanaFilter(string filtertype, string? startdate, string? enddate);
        Task<string> TotalIngresosUltimaSemanaFilter(string filtertype, string? startdate, string? enddate);
        Task<int> TotalProductosFilter(string filtertype, string? startdate, string? enddate);

    }
}
