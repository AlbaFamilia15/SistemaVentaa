using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaVentaAngular.DTOs;
using SistemaVentaAngular.Models;
using SistemaVentaAngular.Repository.Contratos;
using SistemaVentaAngular.Repository.Implementacion;
using SistemaVentaAngular.Utilidades;

namespace SistemaVentaAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ICategoriaRepositorio _categoriaRepositorio;
        public CategoriaController(ICategoriaRepositorio categoriaRepositorio, IMapper mapper)
        {
            _mapper = mapper;
            _categoriaRepositorio = categoriaRepositorio;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            Response<List<CategoriaDTO>> _response = new Response<List<CategoriaDTO>>();

            try
            {
                List<CategoriaDTO> _listaCategorias = new List<CategoriaDTO>();
                _listaCategorias = _mapper.Map<List<CategoriaDTO>>(await _categoriaRepositorio.Lista());

                if (_listaCategorias.Count > 0)
                    _response = new Response<List<CategoriaDTO>>() { status = true, msg = "ok", value = _listaCategorias };
                else
                    _response = new Response<List<CategoriaDTO>>() { status = false, msg = "sin resultados", value = null };


                return StatusCode(StatusCodes.Status200OK, _response);
            }
            catch (Exception ex)
            {
                _response = new Response<List<CategoriaDTO>>() { status = false, msg = ex.Message, value = null };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        [HttpPost]

        [Route("Guardar")]
        public async Task<IActionResult> Guardar([FromBody] CategoriaDTO request)
        {
            Response<CategoriaDTO> _response = new Response<CategoriaDTO>();
            try
            {
                List<CategoriaDTO> _listaCategorias = new List<CategoriaDTO>();
                _listaCategorias = _mapper.Map<List<CategoriaDTO>>(await _categoriaRepositorio.Lista());
                var isExist = _listaCategorias.Find(x => x.Descripcion == request.Descripcion);
                if (isExist == null)
                {
                    Categoria _categoria = _mapper.Map<Categoria>(request);
                    _categoria.EsActivo = true; 
                    Categoria _categoriaCreado = await _categoriaRepositorio.Crear(_categoria);

                    if (_categoriaCreado.IdCategoria != 0)
                        _response = new Response<CategoriaDTO>() { status = true, msg = "ok", value = _mapper.Map<CategoriaDTO>(_categoriaCreado) };
                    else
                        _response = new Response<CategoriaDTO>() { status = false, msg = "No se pudo crear el categoria" };

                    return StatusCode(StatusCodes.Status200OK, _response);
                }
                else
                {
                    _response = new Response<CategoriaDTO>() { status = false, msg = "la categoria ya existe" };
                    return StatusCode(StatusCodes.Status200OK, _response);
                }

            }
            catch (Exception ex)
            {
                _response = new Response<CategoriaDTO>() { status = false, msg = ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

    }
}
