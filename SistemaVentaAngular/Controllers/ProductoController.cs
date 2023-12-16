using AutoMapper;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaVentaAngular.DTOs;
using SistemaVentaAngular.Models;
using SistemaVentaAngular.Repository.Contratos;
using SistemaVentaAngular.Utilidades;
using System.Net.Http.Headers;
using System.IO;
using static System.Net.WebRequestMethods;

namespace SistemaVentaAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IProductoRepositorio _productoRepositorio;
        public ProductoController(IProductoRepositorio productoRepositorio, IMapper mapper)
        {
            _mapper = mapper;
            _productoRepositorio = productoRepositorio;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            Response<List<ProductoDTO>> _response = new Response<List<ProductoDTO>>();

            try
            {
                List<ProductoDTO> ListaProductos = new List<ProductoDTO>();
                IQueryable<Producto> query = await _productoRepositorio.Consultar();
                query = query.Include(r => r.IdCategoriaNavigation);

                ListaProductos = _mapper.Map<List<ProductoDTO>>(query.ToList());

                if (ListaProductos.Count > 0)
                {
                    foreach (var producto in ListaProductos)
                    {
                        if (producto.imagePath != null)
                        {
                            if (System.IO.File.Exists(producto.imagePath))
                            {
                                byte[] fileData = System.IO.File.ReadAllBytes(producto.imagePath);

                                string base64String = Convert.ToBase64String(fileData);
                                producto.imagePath = base64String;
                            }
                            else
                            {
                                producto.imagePath = string.Empty;
                            }
                         
                        }
                    }
                    _response = new Response<List<ProductoDTO>>() { status = true, msg = "ok", value = ListaProductos };
                }
                else
                    _response = new Response<List<ProductoDTO>>() { status = false, msg = "", value = null };

                return StatusCode(StatusCodes.Status200OK, _response);
            }
            catch (Exception ex)
            {
                _response = new Response<List<ProductoDTO>>() { status = false, msg = ex.Message, value = null };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }


        [HttpPost]
        [Route("Guardar")]
        public async Task<IActionResult> Guardar([FromBody] ProductoDTO request)
        {
            Response<ProductoDTO> _response = new Response<ProductoDTO>();
            try
            {
                Producto _producto = _mapper.Map<Producto>(request);

                Producto _productoCreado = await _productoRepositorio.Crear(_producto);

                if (_productoCreado.IdProducto != 0)
                    _response = new Response<ProductoDTO>() { status = true, msg = "ok", value = _mapper.Map<ProductoDTO>(_productoCreado) };
                else
                    _response = new Response<ProductoDTO>() { status = false, msg = "No se pudo crear el producto" };

                return StatusCode(StatusCodes.Status200OK, _response);
            }
            catch (Exception ex)
            {
                _response = new Response<ProductoDTO>() { status = false, msg = ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] ProductoDTO request)
        {
            Response<ProductoDTO> _response = new Response<ProductoDTO>();
            try
            {
                Producto _producto = _mapper.Map<Producto>(request);
                Producto _productoParaEditar = await _productoRepositorio.Obtener(u => u.IdProducto == _producto.IdProducto);

                if (_productoParaEditar != null)
                {

                    _productoParaEditar.Nombre = _producto.Nombre;
                    _productoParaEditar.IdCategoria = _producto.IdCategoria;
                    _productoParaEditar.Stock = _producto.Stock;
                    _productoParaEditar.Precio = _producto.Precio;
                    _productoParaEditar.NetPrice = _producto.NetPrice;
                    _productoParaEditar.isCantidad = _producto.isCantidad;
                    _productoParaEditar.Cost = _producto.Cost;
                    _productoParaEditar.Precio5ML = _producto.IdCategoria == 2 ?_producto.Precio5ML : 0;
                    _productoParaEditar.Precio10ML = _producto.IdCategoria == 2 ?_producto.Precio10ML : 0; 
                    _productoParaEditar.Precio15ML = _producto.IdCategoria == 2 ?_producto.Precio15ML : 0;
                    _productoParaEditar.Precio30ML = _producto.IdCategoria == 2 ?_producto.Precio30ML : 0;
                    _productoParaEditar.Precio100ML = _producto.IdCategoria == 2 ?_producto.Precio100ML : 0;

                    bool respuesta = await _productoRepositorio.Editar(_productoParaEditar);

                    if (respuesta)
                        _response = new Response<ProductoDTO>() { status = true, msg = "ok", value = _mapper.Map<ProductoDTO>(_productoParaEditar) };
                    else
                        _response = new Response<ProductoDTO>() { status = false, msg = "No se pudo editar el producto" };
                }
                else
                {
                    _response = new Response<ProductoDTO>() { status = false, msg = "No se encontró el producto" };
                }

                return StatusCode(StatusCodes.Status200OK, _response);
            }
            catch (Exception ex)
            {
                _response = new Response<ProductoDTO>() { status = false, msg = ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }



        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            Response<string> _response = new Response<string>();
            try
            {
                Producto _productoEliminar = await _productoRepositorio.Obtener(u => u.IdProducto == id);

                if (_productoEliminar != null)
                {

                    bool respuesta = await _productoRepositorio.Eliminar(_productoEliminar);

                    if (respuesta)
                        _response = new Response<string>() { status = true, msg = "ok", value = "" };
                    else
                        _response = new Response<string>() { status = false, msg = "No se pudo eliminar el producto", value = "" };
                }

                return StatusCode(StatusCodes.Status200OK, _response);
            }
            catch (Exception ex)
            {
                _response = new Response<string>() { status = false, msg = ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }
        [HttpPost]
        [Route("Upload/{idProducto:int}")]
        public async Task<IActionResult> Upload(IFormFile file, int idProducto)
        {
            Response<string> _response = new Response<string>();

            try
            {
                string currentDirectory = Environment.CurrentDirectory;
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(currentDirectory, folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    string filePath = Path.Combine(pathToSave, file.FileName);
                    bool exists = System.IO.Directory.Exists(pathToSave);

                    if (!exists)
                        System.IO.Directory.CreateDirectory(pathToSave);
                    using (Stream fileStream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(fileStream);
                    }
                    /*Get data by ID */
                    Producto _productoEliminar = await _productoRepositorio.Obtener(u => u.IdProducto == idProducto);
                    if (_productoEliminar != null)
                    {
                        _productoEliminar.image = fileName;
                        _productoEliminar.imagePath = filePath;
                    }
                    /* Update the data */
                    bool respuesta = await _productoRepositorio.Editar(_productoEliminar);
                    if (respuesta)
                        _response = new Response<string>() { status = true, msg = "ok", value = "" };
                    else
                        _response = new Response<string>() { status = false, msg = "", value = "" };
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
