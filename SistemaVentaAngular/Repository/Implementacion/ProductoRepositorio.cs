using Microsoft.EntityFrameworkCore;
using SistemaVentaAngular.DTOs;
using SistemaVentaAngular.Models;
using SistemaVentaAngular.Repository.Contratos;
using System.Linq;
using System.Linq.Expressions;

namespace SistemaVentaAngular.Repository.Implementacion
{
    public class ProductoRepositorio : IProductoRepositorio
    {
        private readonly DBVentaAngularContext _dbContext;

        public ProductoRepositorio(DBVentaAngularContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<IQueryable<Producto>> Consultar(Expression<Func<Producto, bool>> filtro = null)
        {
            IQueryable<Producto> queryEntidad = filtro == null ? _dbContext.Productos : _dbContext.Productos.Where(filtro);
            return queryEntidad;
        }

        public async Task<Producto> Crear(Producto entidad)
        {
            try
            {
                _dbContext.Set<Producto>().Add(entidad);
                await _dbContext.SaveChangesAsync();
                return entidad;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Editar(Producto entidad)
        {
            try
            {
                _dbContext.Update(entidad);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Eliminar(Producto entidad)
        {
            try
            {
                List<DetalleVentasCredito> detalleventascredito = new List<DetalleVentasCredito>();

                 detalleventascredito = _dbContext.DetalleVentasCredito.Where(p => p.IdProducto.Equals(entidad.IdProducto)).ToList();
                if (detalleventascredito.Any())
                {
                    foreach (var item in detalleventascredito)
                    {
                        _dbContext.DetalleVentasCredito.Remove(item);
                        await _dbContext.SaveChangesAsync();

                        VentasCredito ventasCredito = _dbContext.VentasCredito.Where(x => x.IdVentasCredito.Equals(item.IdVentasCredito)).First();
                        ventasCredito.Total = ventasCredito.Total - item.Total;
                        _dbContext.VentasCredito.Update(ventasCredito);
                        await _dbContext.SaveChangesAsync();
                    }
                    
                }

                List<DetalleVenta> detalleventa = new List<DetalleVenta>();
                detalleventa = _dbContext.DetalleVenta.Where(p => p.IdProducto.Equals(entidad.IdProducto)).ToList();
                if (detalleventa.Any())
                {
                    foreach (var item in detalleventa)
                    {
                        _dbContext.DetalleVenta.Remove(item);
                        await _dbContext.SaveChangesAsync();

                        Venta venta = _dbContext.Venta.Where(x => x.IdVenta.Equals(item.IdVenta)).First();
                        venta.Total = venta.Total - item.Total;
                        _dbContext.Venta.Update(venta);
                        await _dbContext.SaveChangesAsync();
                    }
                }
                _dbContext.Remove(entidad);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw;
            }
        }

        public async Task<Producto> Obtener(Expression<Func<Producto, bool>> filtro = null)
        {
            try
            {
                return await _dbContext.Productos.Where(filtro).FirstOrDefaultAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Upload(int idProducto, string fileName)
        {
            try
            {
                Producto data = await _dbContext.Productos.Where(x => x.IdProducto == idProducto).FirstOrDefaultAsync();
                if (data != null)
                {
                    if (string.IsNullOrEmpty(data.image))
                    {
                        data.image = fileName;
                        _dbContext.Update(data).Context.SaveChanges();
                        _dbContext.SaveChangesAsync().GetAwaiter().GetResult();
                        return true;
                    }
                }
                return true;


            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<Producto> GetProducto(Expression<Func<Producto, bool>> filtro = null)
        {
            try
            {
                return await _dbContext.Productos.Where(filtro).FirstOrDefaultAsync();
            }
            catch
            {
                throw;
            }
        }
    }
}
