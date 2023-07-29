using SistemaVentaAngular.Models;

namespace SistemaVentaAngular.Repository.Contratos
{
    public interface IVentasCreditoRepository
    {
        Task<VentasCredito> Registrar(VentasCredito entidad);
        Task<List<VentasCredito>> Historial(string buscarPor, string numeroVenta, string fechaInicio, string fechaFin);
        Task<List<DetalleVentasCredito>> Reporte(DateTime FechaInicio, DateTime FechaFin);
    }
}
