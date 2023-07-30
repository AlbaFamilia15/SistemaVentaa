using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaVentaAngular.DTOs;
using SistemaVentaAngular.Models;
using SistemaVentaAngular.Repository.Contratos;
using SistemaVentaAngular.Utilidades;
using System.Globalization;

namespace SistemaVentaAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentasCreditoController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly IVentasCreditoRepository _ventasCreditoRepository;

        public VentasCreditoController(IVentasCreditoRepository ventaRepositorio, IMapper mapper)
        {
            _mapper = mapper;
            _ventasCreditoRepository = ventaRepositorio;
        }


        [HttpPost]
        [Route("Registrar")]
        public async Task<IActionResult> Registrar([FromBody] VentasCreditoDTO request)
        {
            Response<VentasCreditoDTO> _response = new Response<VentasCreditoDTO>();
            try
            {

                VentasCredito venta_creada = await _ventasCreditoRepository.Registrar(_mapper.Map<VentasCredito>(request));
                request = _mapper.Map<VentasCreditoDTO>(venta_creada);

                if (venta_creada.IdVentasCredito != 0)
                    _response = new Response<VentasCreditoDTO>() { status = true, msg = "ok", value = request };
                else
                    _response = new Response<VentasCreditoDTO>() { status = false, msg = "No se pudo registrar la VentasCredito" };

                return StatusCode(StatusCodes.Status200OK, _response);
            }
            catch (Exception ex)
            {
                _response = new Response<VentasCreditoDTO>() { status = false, msg = ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        [HttpGet]
        [Route("Historial")]
        public async Task<IActionResult> Historial(string buscarPor, string? numeroVenta, string? fechaInicio, string? fechaFin)
        {
            Response<List<VentasCreditoDTO>> _response = new Response<List<VentasCreditoDTO>>();

            numeroVenta = numeroVenta is null ? "" : numeroVenta;
            fechaInicio = fechaInicio is null ? "" : fechaInicio;
            fechaFin = fechaInicio is null ? "" : fechaFin;

            try
            {

                List<VentasCreditoDTO> vmHistorialVenta = _mapper.Map<List<VentasCreditoDTO>>(await _ventasCreditoRepository.Historial(buscarPor, numeroVenta, fechaInicio, fechaFin));

                if (vmHistorialVenta.Count > 0)
                    _response = new Response<List<VentasCreditoDTO>>() { status = true, msg = "ok", value = vmHistorialVenta };
                else
                    _response = new Response<List<VentasCreditoDTO>>() { status = false, msg = "No se pudo registrar la VentasCredito" };

                return StatusCode(StatusCodes.Status200OK, _response);
            }
            catch (Exception ex)
            {
                _response = new Response<List<VentasCreditoDTO>>() { status = false, msg = ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);

            }

        }

        [HttpGet]
        [Route("Reporte")]
        public async Task<IActionResult> Reporte(string? fechaInicio, string? fechaFin)
        {
            Response<List<ReporteDTO>> _response = new Response<List<ReporteDTO>>();
            DateTime _fechaInicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-PE"));
            DateTime _fechaFin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", new CultureInfo("es-PE"));

            try
            {

                List<ReporteDTO> listaReporte = _mapper.Map<List<ReporteDTO>>(await _ventasCreditoRepository.Reporte(_fechaInicio, _fechaFin));

                if (listaReporte.Count > 0)
                    _response = new Response<List<ReporteDTO>>() { status = true, msg = "ok", value = listaReporte };
                else
                    _response = new Response<List<ReporteDTO>>() { status = false, msg = "No se pudo registrar la VentasCredito" };

                return StatusCode(StatusCodes.Status200OK, _response);
            }
            catch (Exception ex)
            {
                _response = new Response<List<ReporteDTO>>() { status = false, msg = ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);

            }

        }




    }
}
