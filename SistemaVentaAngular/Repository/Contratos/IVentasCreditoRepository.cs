using SistemaVentaAngular.DTOs;
using SistemaVentaAngular.Models;

namespace SistemaVentaAngular.Repository.Contratos
{
    public interface IVentasCreditoRepository
    {
        Task<VentasCredito> Registrar(VentasCredito entidad);
        Task<List<VentasCredito>> Historial(string buscarPor, string numeroVenta, string fechaInicio, string fechaFin, string customerName);
        Task<List<DetalleVentasCredito>> Reporte(DateTime FechaInicio, DateTime FechaFin);
        Task<List<DetalleVentasCredito>> DayReporte(DateTime FechaInicio, DateTime FechaFin, int day);
        Task<VentasCredito> Update(VentasCredito entidad);
        Task<VentasCredito> GetByIdAsync(string id);
        Task<bool> DeleteAsync(string id);
    }
}
