using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaVentaAngular.DTOs;
using SistemaVentaAngular.Models;
using SistemaVentaAngular.Repository.Contratos;
using SistemaVentaAngular.Repository.Implementacion;
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
        public async Task<IActionResult> Historial(string buscarPor, string? numeroVenta, string? fechaInicio, string? fechaFin, string? customerName)
        {
            Response<List<VentasCreditoDTO>> _response = new Response<List<VentasCreditoDTO>>();

            numeroVenta = numeroVenta is null ? "" : numeroVenta;
            fechaInicio = fechaInicio is null ? "" : fechaInicio;
            fechaFin = fechaInicio is null ? "" : fechaFin;
            customerName = customerName is null ? "" : customerName;

            try
            {

                List<VentasCreditoDTO> vmHistorialVenta = _mapper.Map<List<VentasCreditoDTO>>(await _ventasCreditoRepository.Historial(buscarPor, numeroVenta, fechaInicio, fechaFin, customerName));

                if (vmHistorialVenta.Count > 0)
                {
                    _response = new Response<List<VentasCreditoDTO>>() { status = true, msg = "ok", value = vmHistorialVenta };

                }
                else
                {
                    _response = new Response<List<VentasCreditoDTO>>() { status = false, msg = "No se pudo registrar la VentasCredito" };
                }

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
            Response<List<VentasCreditReporteDTO>> _response = new Response<List<VentasCreditReporteDTO>>();
            DateTime _fechaInicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-PE"));
            DateTime _fechaFin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", new CultureInfo("es-PE"));

            try
            {

                List<VentasCreditReporteDTO> listaReporte = _mapper.Map<List<VentasCreditReporteDTO>>(await _ventasCreditoRepository.Reporte(_fechaInicio, _fechaFin));
                var sum = listaReporte.Select(x => x.Total).ToList();
              
                decimal totalSum = sum.Sum(report => Convert.ToDecimal(report));

                if (listaReporte.Count > 0)
                    _response = new Response<List<VentasCreditReporteDTO>>() { status = true, msg = "ok", value = listaReporte, totalVentas = totalSum };
                else
                    _response = new Response<List<VentasCreditReporteDTO>>() { status = false, msg = "No se pudo registrar la VentasCredito" };

                return StatusCode(StatusCodes.Status200OK, _response);
            }
            catch (Exception ex)
            {
                _response = new Response<List<VentasCreditReporteDTO>>() { status = false, msg = ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);

            }

        }
        
        [HttpGet]
        [Route("DayReporte")]
        public async Task<IActionResult> DayReporte(string? fechaInicio, string? fechaFin, int? day)
        {
            Response<List<VentasCreditReporteDTO>> _response = new Response<List<VentasCreditReporteDTO>>();
            DateTime _fechaInicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-PE"));
            DateTime _fechaFin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", new CultureInfo("es-PE"));

            try
            {

                List<VentasCreditReporteDTO> listaReporte = _mapper.Map<List<VentasCreditReporteDTO>>(await _ventasCreditoRepository.DayReporte(_fechaInicio, _fechaFin,(int)day));
                var sum = listaReporte.Select(x => x.Total).ToList();
              
                decimal totalSum = sum.Sum(report => Convert.ToDecimal(report));

                if (listaReporte.Count > 0)
                    _response = new Response<List<VentasCreditReporteDTO>>() { status = true, msg = "ok", value = listaReporte, totalVentas = totalSum };
                else
                    _response = new Response<List<VentasCreditReporteDTO>>() { status = false, msg = "No se pudo registrar la VentasCredito" };

                return StatusCode(StatusCodes.Status200OK, _response);
            }
            catch (Exception ex)
            {
                _response = new Response<List<VentasCreditReporteDTO>>() { status = false, msg = ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);

            }

        }

        [HttpPost]
        [Route("Update")]
        public async Task<IActionResult> Update([FromBody] VentasCreditoDTO request)
        {
            Response<VentasCreditoDTO> _response = new Response<VentasCreditoDTO>();
            try
            {

                VentasCredito venta_creada = await _ventasCreditoRepository.Update(_mapper.Map<VentasCredito>(request));
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
        [HttpPost]
        [Route("Delete")]
        public async Task<IActionResult> Delete([FromBody] VentasCreditoDTO request)
        {
            Response<string> _response = new Response<string>();
            try
            {
                var entity = await _ventasCreditoRepository.GetByIdAsync(request.NumeroDocumento);
                if (entity != null)
                {
                    bool respuesta = await _ventasCreditoRepository.DeleteAsync(request.NumeroDocumento);
                    if (respuesta)
                        _response = new Response<string>() { status = true, msg = "ok", value = "" };
                    else
                        _response = new Response<string>() { status = false, msg = "No se pudo eliminar el vento credito", value = "" };
                }

                return StatusCode(StatusCodes.Status200OK, _response);
            }
            catch (Exception ex)
            {
                _response = new Response<string>() { status = false, msg = ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }


    }
}
