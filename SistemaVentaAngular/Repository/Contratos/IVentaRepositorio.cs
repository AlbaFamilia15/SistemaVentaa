using SistemaVentaAngular.Models;
using System.Linq.Expressions;

namespace SistemaVentaAngular.Repository.Contratos
{
    public interface IVentaRepositorio
    {
        Task<Venta> Registrar(Venta entidad);
        Task<List<Venta>> Historial(string buscarPor,string numeroVenta, string fechaInicio, string fechaFin);
        Task<List<DetalleVenta>> Reporte(DateTime FechaInicio, DateTime FechaFin);
        Task<List<DetalleVenta>> DayReporte(DateTime FechaInicio, DateTime FechaFin, int day);
        Task<Venta> GetByIdAsync(string id);
        Task<bool> DeleteAsync(string id);

    }
}
