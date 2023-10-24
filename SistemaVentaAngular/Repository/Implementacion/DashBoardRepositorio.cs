using SistemaVentaAngular.Models;
using SistemaVentaAngular.Repository.Contratos;
using System.Globalization;

namespace SistemaVentaAngular.Repository.Implementacion
{
    public class DashBoardRepositorio : IDashBoardRepositorio
    {
        private readonly DBVentaAngularContext _dbcontext;
        public DashBoardRepositorio(DBVentaAngularContext context)
        {
            _dbcontext = context;
        }

        public async Task<int> TotalVentasUltimaSemana()
        {
            int total = 0;
            try
            {
                IQueryable<Venta> _ventaQuery = _dbcontext.Venta.AsQueryable();

                if (_ventaQuery.Count() > 0)
                {
                    DateTime? ultimaFecha = _dbcontext.Venta.OrderByDescending(v => v.FechaRegistro).Select(v => v.FechaRegistro).First();

                    ultimaFecha = ultimaFecha.Value.AddDays(-7);

                    IQueryable<Venta> query = _dbcontext.Venta.Where(v => v.FechaRegistro.Value.Date >= ultimaFecha.Value.Date);
                    total = query.Count();
                }

                return total;
            }
            catch
            {
                throw;
            }
        }
        public async Task<string> TotalIngresosUltimaSemana()
        {
            decimal resultado = 0;
            try
            {
                IQueryable<Venta> _ventaQuery = _dbcontext.Venta.AsQueryable();

                if (_ventaQuery.Count() > 0)
                {
                    DateTime? ultimaFecha = _dbcontext.Venta.OrderByDescending(v => v.FechaRegistro).Select(v => v.FechaRegistro).First();
                    ultimaFecha = ultimaFecha.Value.AddDays(-7);
                    IQueryable<Venta> query = _dbcontext.Venta.Where(v => v.FechaRegistro.Value.Date >= ultimaFecha.Value.Date);

                    resultado = query
                         .Select(v => v.Total)
                         .Sum(v => v.Value);
                }


                return Convert.ToString(resultado, new CultureInfo("es-PE"));
            }
            catch
            {
                throw;
            }


        }
        public async Task<int> TotalProductos()
        {
            try
            {
                IQueryable<Producto> query = _dbcontext.Productos;
                int total = query.Count();
                return total;
            }
            catch
            {
                throw;
            }
        }

        public async Task<Dictionary<string, int>> VentasUltimaSemana()
        {
            Dictionary<string, int> resultado = new Dictionary<string, int>();
            try
            {
                IQueryable<Venta> _ventaQuery = _dbcontext.Venta.AsQueryable();
                if (_ventaQuery.Count() > 0)
                {
                    DateTime? ultimaFecha = _dbcontext.Venta.OrderByDescending(v => v.FechaRegistro).Select(v => v.FechaRegistro).First();
                    ultimaFecha = ultimaFecha.Value.AddDays(-7);

                    IQueryable<Venta> query = _dbcontext.Venta.Where(v => v.FechaRegistro.Value.Date >= ultimaFecha.Value.Date);

                    resultado = query
                        .GroupBy(v => v.FechaRegistro.Value.Date).OrderBy(g => g.Key)
                        .Select(dv => new { fecha = dv.Key.ToString("dd/MM/yyyy"), total = dv.Count() })
                        .ToDictionary(keySelector: r => r.fecha, elementSelector: r => r.total);
                }


                return resultado;

            }
            catch
            {
                throw;
            }

        }
        public async Task<Dictionary<string, int>> VentasUltimaSemanaFilter(string filtertype, string? startdate, string? enddate)
        {
            Dictionary<string, int> resultado = new Dictionary<string, int>();
            try
            {
                IQueryable<Venta> _ventaQuery = _dbcontext.Venta.AsQueryable();

                if (_ventaQuery.Count() > 0)
                {
                    DateTime? startDate = null;
                    DateTime? endDate = null;

                    if (!string.IsNullOrEmpty(startdate))
                    {
                        startDate = DateTime.Parse(startdate);
                    }

                    if (!string.IsNullOrEmpty(enddate))
                    {
                        endDate = DateTime.Parse(enddate);
                    }


                    DateTime baseDate = DateTime.Today;

                    var today = baseDate;
                    var thisWeekStart = baseDate.AddDays(-(int)baseDate.DayOfWeek);
                    var thisWeekEnd = thisWeekStart.AddDays(7).AddSeconds(-1);
                    var thisMonthStart = baseDate.AddDays(1 - baseDate.Day);
                    var thisMonthEnd = thisMonthStart.AddMonths(1).AddSeconds(-1);

                    switch (filtertype)
                    {
                        case "Diario":
                            resultado = _ventaQuery.Where(v => v.FechaRegistro.Value.Date == today.Date).GroupBy(v => v.FechaRegistro.Value.Date).OrderBy(g => g.Key)
                        .Select(dv => new { fecha = dv.Key.ToString("dd/MM/yyyy"), total = dv.Count() })
                        .ToDictionary(keySelector: r => r.fecha, elementSelector: r => r.total);
                            break;
                        case "Semanal":
                            resultado = _ventaQuery.Where(v => v.FechaRegistro.Value.Date >= thisWeekStart.Date && v.FechaRegistro.Value.Date <= thisMonthEnd.Date).GroupBy(v => v.FechaRegistro.Value.Date).OrderBy(g => g.Key)
                        .Select(dv => new { fecha = dv.Key.ToString("dd/MM/yyyy"), total = dv.Count() })
                        .ToDictionary(keySelector: r => r.fecha, elementSelector: r => r.total);
                            break;
                        case "Mensual":
                            resultado = _ventaQuery.Where(v => v.FechaRegistro.Value.Date >= thisMonthStart.Date && v.FechaRegistro.Value.Date <= thisMonthEnd.Date).GroupBy(v => v.FechaRegistro.Value.Date).OrderBy(g => g.Key)
                        .Select(dv => new { fecha = dv.Key.ToString("dd/MM/yyyy"), total = dv.Count() })
                        .ToDictionary(keySelector: r => r.fecha, elementSelector: r => r.total);
                            break;
                        case "Rangopersonalizado":
                            if (startDate.HasValue && endDate.HasValue)
                            {
                                resultado = _ventaQuery.Where(v => v.FechaRegistro.Value.Date >= startDate.Value.Date && v.FechaRegistro.Value.Date <= endDate.Value.Date).GroupBy(v => v.FechaRegistro.Value.Date).OrderBy(g => g.Key)
                        .Select(dv => new { fecha = dv.Key.ToString("dd/MM/yyyy"), total = dv.Count() })
                        .ToDictionary(keySelector: r => r.fecha, elementSelector: r => r.total);
                            }
                            break;
                        default:
                            throw new ArgumentException("Invalid filter type");
                    }
                }



                return resultado;

            }
            catch
            {
                throw;
            }

        }

        public async Task<int> TotalVentasUltimaSemanaFilter(string filtertype, string? startdate, string? enddate)
        {
            int total = 0;
            try
            {
                IQueryable<Venta> _ventaQuery = _dbcontext.Venta.AsQueryable();

                if (_ventaQuery.Count() > 0)
                {
                    DateTime? startDate = null;
                    DateTime? endDate = null;

                    if (!string.IsNullOrEmpty(startdate))
                    {
                        startDate = DateTime.Parse(startdate);
                    }

                    if (!string.IsNullOrEmpty(enddate))
                    {
                        endDate = DateTime.Parse(enddate);
                    }


                    DateTime baseDate = DateTime.Today;

                    var today = baseDate;
                    var thisWeekStart = baseDate.AddDays(-(int)baseDate.DayOfWeek);
                    var thisWeekEnd = thisWeekStart.AddDays(7).AddSeconds(-1);
                    var thisMonthStart = baseDate.AddDays(1 - baseDate.Day);
                    var thisMonthEnd = thisMonthStart.AddMonths(1).AddSeconds(-1);

                    switch (filtertype)
                    {
                        case "Diario":
                            total = _ventaQuery.Count(v => v.FechaRegistro.Value.Date == today.Date);
                            break;
                        case "Semanal":
                            total = _ventaQuery.Count(v => v.FechaRegistro.Value.Date >= thisWeekStart.Date && v.FechaRegistro.Value.Date <= thisMonthEnd.Date);
                            break;
                        case "Mensual":
                            total = _ventaQuery.Count(v => v.FechaRegistro.Value.Date >= thisMonthStart.Date && v.FechaRegistro.Value.Date <= thisMonthEnd.Date);
                            break;
                        case "Rangopersonalizado":
                            if (startDate.HasValue && endDate.HasValue)
                            {
                                total = _ventaQuery.Count(v => v.FechaRegistro.Value.Date >= startDate.Value.Date && v.FechaRegistro.Value.Date <= endDate.Value.Date);
                            }
                            break;
                        default:
                            throw new ArgumentException("Invalid filter type");
                    }
                }

                return total;
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> TotalIngresosUltimaSemanaFilter(string filtertype, string? startdate, string? enddate)
        {
            decimal resultado = 0;
            try
            {
                IQueryable<Venta> _ventaQuery = _dbcontext.Venta.AsQueryable();

                if (_ventaQuery.Count() > 0)
                {
                    DateTime? startDate = null;
                    DateTime? endDate = null;

                    if (!string.IsNullOrEmpty(startdate))
                    {
                        startDate = DateTime.Parse(startdate);
                    }

                    if (!string.IsNullOrEmpty(enddate))
                    {
                        endDate = DateTime.Parse(enddate);
                    }


                    DateTime baseDate = DateTime.Today;

                    var today = baseDate;
                    var thisWeekStart = baseDate.AddDays(-(int)baseDate.DayOfWeek);
                    var thisWeekEnd = thisWeekStart.AddDays(7).AddSeconds(-1);
                    var thisMonthStart = baseDate.AddDays(1 - baseDate.Day);
                    var thisMonthEnd = thisMonthStart.AddMonths(1).AddSeconds(-1);

                    switch (filtertype)
                    {
                        case "Diario":
                            resultado = _ventaQuery.Where(v => v.FechaRegistro.Value.Date == today.Date).Select(v => v.Total)
                         .Sum(v => v.Value);
                            break;
                        case "Semanal":
                            resultado = _ventaQuery.Where(v => v.FechaRegistro.Value.Date >= thisWeekStart.Date && v.FechaRegistro.Value.Date <= thisMonthEnd.Date).Select(v => v.Total)
                         .Sum(v => v.Value);
                            break;
                        case "Mensual":
                            resultado = _ventaQuery.Where(v => v.FechaRegistro.Value.Date >= thisMonthStart.Date && v.FechaRegistro.Value.Date <= thisMonthEnd.Date).Select(v => v.Total)
                         .Sum(v => v.Value);
                            break;
                        case "Rangopersonalizado":
                            if (startDate.HasValue && endDate.HasValue)
                            {
                                resultado = _ventaQuery.Where(v => v.FechaRegistro.Value.Date >= startDate.Value.Date && v.FechaRegistro.Value.Date <= endDate.Value.Date).Select(v => v.Total)
                         .Sum(v => v.Value);
                            }
                            break;
                        default:
                            throw new ArgumentException("Invalid filter type");
                    }
                }

                return Convert.ToString(resultado, new CultureInfo("es-PE"));
            }
            catch
            {
                throw;
            }


        }
        public async Task<int> TotalProductosFilter(string filtertype, string? startdate, string? enddate)
        {
            int total = 0;
            try
            {
                IQueryable<Producto> _productQuery = _dbcontext.Productos.AsQueryable();

                if (_productQuery.Count() > 0)
                {
                    DateTime? startDate = null;
                    DateTime? endDate = null;

                    if (!string.IsNullOrEmpty(startdate))
                    {
                        startDate = DateTime.Parse(startdate);
                    }

                    if (!string.IsNullOrEmpty(enddate))
                    {
                        endDate = DateTime.Parse(enddate);
                    }


                    DateTime baseDate = DateTime.Today;

                    var today = baseDate;
                    var thisWeekStart = baseDate.AddDays(-(int)baseDate.DayOfWeek);
                    var thisWeekEnd = thisWeekStart.AddDays(7).AddSeconds(-1);
                    var thisMonthStart = baseDate.AddDays(1 - baseDate.Day);
                    var thisMonthEnd = thisMonthStart.AddMonths(1).AddSeconds(-1);

                    switch (filtertype)
                    {
                        case "Diario":
                            total = _productQuery.Count(v => v.FechaRegistro.Value.Date == today.Date);
                            break;
                        case "Semanal":
                            total = _productQuery.Count(v => v.FechaRegistro.Value.Date >= thisWeekStart.Date && v.FechaRegistro.Value.Date <= thisMonthEnd.Date);
                            break;
                        case "Mensual":
                            total = _productQuery.Count(v => v.FechaRegistro.Value.Date >= thisMonthStart.Date && v.FechaRegistro.Value.Date <= thisMonthEnd.Date);
                            break;
                        case "Rangopersonalizado":
                            if (startDate.HasValue && endDate.HasValue)
                            {
                                total = _productQuery.Count(v => v.FechaRegistro.Value.Date >= startDate.Value.Date && v.FechaRegistro.Value.Date <= endDate.Value.Date);
                            }
                            break;
                        default:
                            throw new ArgumentException("Invalid filter type");
                    }
                }

                return total;
            }
            catch
            {
                throw;
            }
        }

    }
}
