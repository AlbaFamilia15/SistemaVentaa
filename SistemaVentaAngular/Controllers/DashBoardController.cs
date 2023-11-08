using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaVentaAngular.DTOs;
using SistemaVentaAngular.Repository.Contratos;
using SistemaVentaAngular.Utilidades;

namespace SistemaVentaAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashBoardController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IDashBoardRepositorio _dashboardRepositorio;
        public DashBoardController(IDashBoardRepositorio dashboardRepositorio, IMapper mapper)
        {
            _mapper = mapper;
            _dashboardRepositorio = dashboardRepositorio;
        }

        [HttpGet]
        [Route("Resumen")]
        public async Task<IActionResult> Resumen()
        {
            Response<DashBoardDTO> _response = new Response<DashBoardDTO>();

            try
            {

                DashBoardDTO vmDashboard = new DashBoardDTO();

                vmDashboard.TotalVentas = await _dashboardRepositorio.TotalVentasUltimaSemana();
                vmDashboard.TotalIngresos = await _dashboardRepositorio.TotalIngresosUltimaSemana();
                vmDashboard.TotalProductos = await _dashboardRepositorio.TotalProductos();

                List<VentasSemanaDTO> listaVentasSemana = new List<VentasSemanaDTO>();

                foreach (KeyValuePair<string, int> item in await _dashboardRepositorio.VentasUltimaSemana())
                {
                    listaVentasSemana.Add(new VentasSemanaDTO()
                    {
                        Fecha = item.Key,
                        Total = item.Value
                    });
                }
                vmDashboard.VentasUltimaSemana = listaVentasSemana;

                _response = new Response<DashBoardDTO>() { status = true, msg = "ok", value = vmDashboard };
                return StatusCode(StatusCodes.Status200OK, _response);

            }
            catch (Exception ex)
            {
                _response = new Response<DashBoardDTO>() { status = false, msg = ex.Message, value = null };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }

        } 
        
        [HttpGet]
        [Route("ResumenFilter")]
        public async Task<IActionResult> ResumenFilter(string filtertype, string? startdate, string? enddate )
        {
            Response<DashBoardDTO> _response = new Response<DashBoardDTO>();

            try
            {

                DashBoardDTO vmDashboard = new DashBoardDTO();

                vmDashboard.TotalVentas = await _dashboardRepositorio.TotalVentasUltimaSemanaFilter(filtertype,startdate,enddate);
                vmDashboard.TotalVentasCredito = await _dashboardRepositorio.TotalVentasCreditoFilter(filtertype, startdate, enddate);
                vmDashboard.TotalIngresos = await _dashboardRepositorio.TotalIngresosUltimaSemanaFilter(filtertype, startdate, enddate);
                vmDashboard.TotalPaidIngresos = await _dashboardRepositorio.TotalPiadIngresosUltimaSemanaFilter(filtertype, startdate, enddate);
                vmDashboard.TotalProductos = await _dashboardRepositorio.TotalProductosFilter(filtertype, startdate, enddate);

                List<VentasSemanaDTO> listaVentasSemana = new List<VentasSemanaDTO>();

                foreach (KeyValuePair<string, int> item in await _dashboardRepositorio.VentasUltimaSemanaFilter(filtertype, startdate, enddate))
                {
                    listaVentasSemana.Add(new VentasSemanaDTO()
                    {
                        Fecha = item.Key,
                        Total = item.Value
                    });
                }
                vmDashboard.VentasUltimaSemana = listaVentasSemana;

                _response = new Response<DashBoardDTO>() { status = true, msg = "ok", value = vmDashboard };
                return StatusCode(StatusCodes.Status200OK, _response);

            }
            catch (Exception ex)
            {
                _response = new Response<DashBoardDTO>() { status = false, msg = ex.Message, value = null };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }

        }
    }
}
