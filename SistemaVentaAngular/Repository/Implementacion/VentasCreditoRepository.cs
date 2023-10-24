using Microsoft.EntityFrameworkCore;
using SistemaVentaAngular.Models;
using SistemaVentaAngular.Repository.Contratos;
using System.Globalization;

namespace SistemaVentaAngular.Repository.Implementacion
{
    public class VentasCreditoRepository : IVentasCreditoRepository
    {
        private readonly DBVentaAngularContext _dbcontext;
        public VentasCreditoRepository(DBVentaAngularContext context)
        {
            _dbcontext = context;
        }

        public async Task<VentasCredito> Registrar(VentasCredito entidad)
        {
            VentasCredito VentaGenerada = new VentasCredito();

            //usaremos transacion, ya que si ocurre un error en algun insert a una tabla, debe reestablecer todo a cero, como si no hubo o no existió ningun insert
            using (var transaction = _dbcontext.Database.BeginTransaction())
            {
                int CantidadDigitos = 4;
                try
                {
                    foreach (DetalleVentasCredito dv in entidad.DetalleVentasCredito)
                    {
                        Producto producto_encontrado = _dbcontext.Productos.Where(p => p.IdProducto == dv.IdProducto).First();

                        producto_encontrado.Stock = producto_encontrado.Stock - dv.Cantidad;
                        _dbcontext.Productos.Update(producto_encontrado);
                    }
                    await _dbcontext.SaveChangesAsync();


                    NumeroDocumento correlativo = _dbcontext.NumeroDocumentos.First();

                    correlativo.UltimoNumero = correlativo.UltimoNumero + 1;
                    correlativo.FechaRegistro = DateTime.Now;

                    _dbcontext.NumeroDocumentos.Update(correlativo);
                    await _dbcontext.SaveChangesAsync();


                    string ceros = string.Concat(Enumerable.Repeat("0", CantidadDigitos));
                    string numeroVenta = ceros + correlativo.UltimoNumero.ToString();
                    numeroVenta = numeroVenta.Substring(numeroVenta.Length - CantidadDigitos, CantidadDigitos);

                    entidad.NumeroDocumento = numeroVenta;

                    await _dbcontext.VentasCredito.AddAsync(entidad);
                    await _dbcontext.SaveChangesAsync();

                    VentaGenerada = entidad;

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw;
                }
            }

            return VentaGenerada;
        }

        public async Task<List<VentasCredito>> Historial(string buscarPor, string numeroVenta, string fechaInicio, string fechaFin, string customerName)
        {
            IQueryable<VentasCredito> query = _dbcontext.VentasCredito;

            if (buscarPor == "fecha")
            {

                DateTime fech_Inicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-PE"));
                DateTime fech_Fin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", new CultureInfo("es-PE"));

                var result = query.Where(v =>
                    v.FechaRegistro.Value.Date >= fech_Inicio.Date &&
                    v.FechaRegistro.Value.Date <= fech_Fin.Date
                )
                .Include(dv => dv.DetalleVentasCredito)
                    .ThenInclude(p => p.IdProductoNavigation)
                .ToList();

                if (!String.IsNullOrEmpty(customerName))
                {
                    result = result.FindAll(v => v.DetalleVentasCredito.Any(x => x.CustomerName == customerName));
                }

                result.ForEach(v =>
                {
                    v.customerName = v.DetalleVentasCredito != null && v.DetalleVentasCredito.Count > 0 ? v.DetalleVentasCredito.First().CustomerName : null;
                });

                return result;

            }
            else
            {
                var result = query.Where(v => v.NumeroDocumento == numeroVenta)
                  .Include(dv => dv.DetalleVentasCredito)
                  .ThenInclude(p => p.IdProductoNavigation)
                  .ToList();

                if (!String.IsNullOrEmpty(customerName))
                {
                    result = result.FindAll(v => v.DetalleVentasCredito.Any(x => x.CustomerName == customerName));
                }

                result.ForEach(v =>
                {
                    v.customerName = v.DetalleVentasCredito != null && v.DetalleVentasCredito.Count > 0 ? v.DetalleVentasCredito.First().CustomerName : null;
                });

                return result;
            }


        }

        public async Task<List<DetalleVentasCredito>> Reporte(DateTime FechaInicio, DateTime FechaFin)
        {
            List<DetalleVentasCredito> listaResumen = await _dbcontext.DetalleVentasCredito
                .Include(p => p.IdProductoNavigation)
                .Include(v => v.IdVentasCreditoNavigation)
                .Where(dv => dv.IdVentasCreditoNavigation.FechaRegistro.Value.Date >= FechaInicio.Date && dv.IdVentasCreditoNavigation.FechaRegistro.Value.Date <= FechaFin.Date)
                .ToListAsync();

            return listaResumen;
        }

        public async Task<VentasCredito> Update(VentasCredito entidad)
        {
            using (var transaction = _dbcontext.Database.BeginTransaction())
            {
                try
                {
                    var ventasCredito = await _dbcontext.VentasCredito.FirstOrDefaultAsync(x => x.IdVentasCredito == entidad.IdVentasCredito);
                    if (ventasCredito != null)
                    {
                        ventasCredito.IsPaid = entidad.IsPaid;
                        _dbcontext.VentasCredito.Update(ventasCredito);
                    }
                    await _dbcontext.SaveChangesAsync();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                }
            }
            return entidad;
        }
        public async Task<VentasCredito> GetByIdAsync(string id)
        {
            return await _dbcontext.VentasCredito.Where(e => e.NumeroDocumento == id)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var entity = await _dbcontext.VentasCredito.Where(x => x.NumeroDocumento.Equals(id)).FirstOrDefaultAsync();
            if (entity != null)
            {
                entity.isDelete = true;
                await _dbcontext.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}

