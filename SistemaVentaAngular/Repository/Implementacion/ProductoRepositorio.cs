using Microsoft.EntityFrameworkCore;
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
                        //Producto producto = new Producto();
                        //producto.IdProducto = data.IdProducto;
                        //producto.image = fileName;
                        //producto.Nombre = data.Nombre;
                        //producto.IdCategoria = data.IdCategoria;
                        //producto.Stock = data.Stock;
                        //producto.Precio = data.Precio;
                        //producto.EsActivo = data.EsActivo;
                        //producto.FechaRegistro = data.FechaRegistro;
                        //producto.NetPrice = data.NetPrice;
                        //producto.cantidadML = data.cantidadML;
                        //producto.isCantidad = data.isCantidad;

                        //_dbContext.Productos.Update(producto);
                        //_dbContext.SaveChanges();
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
