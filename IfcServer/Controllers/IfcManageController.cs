using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Xbim.Ifc;
using Xbim.Ifc4.Interfaces;
using Xbim.Common.Geometry;
using Xbim.Ifc4.Kernel;
using IfcServer.Models;

namespace IfcServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IfcManageController : ControllerBase
    {
        private readonly ILogger<IfcManageController> _logger;
        private readonly IConfiguration _configuration;

        public IfcManageController(ILogger<IfcManageController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet("getIfcFile/{fileId}")]
        public async Task<IActionResult> GetFileById(string fileId)
        {
            try
            {
                _logger.LogInformation("Requesting file with ID: {FileId}", fileId);

                if (string.IsNullOrWhiteSpace(fileId))
                {
                    _logger.LogWarning("File ID is null or empty");
                    return BadRequest("File ID is required");
                }

                var filePath = await GetFilePathById(fileId);

                if (string.IsNullOrEmpty(filePath) || !System.IO.File.Exists(filePath))
                {
                    _logger.LogWarning("File not found for ID: {FileId}", fileId);
                    return NotFound($"File with ID '{fileId}' not found");
                }

                using (var model = IfcStore.Open(filePath))
                {
                    var txn = model.BeginTransaction("Translate to Origin");

                    // Получаем объект IfcSite (корень координат)
                    var site = model.Instances.OfType<IIfcSite>().FirstOrDefault();
                    if (site == null)
                    {
                        Console.WriteLine("IfcSite не найден.");
                    }

                    var crsRef = model.Instances.OfType<IIfcCoordinateReferenceSystem>().FirstOrDefault();
                    var crs = model.Instances.OfType<IIfcProjectedCRS>().FirstOrDefault();
                    var epsgCode = 0;
                    if (crs != null)
                    {
                        epsgCode = GetEpsgCode(crs.Name);
                    }
                    var mapConversion = model.Instances.OfType<IIfcMapConversion>().FirstOrDefault();
                    var easting = 0.0;
                    var northing = 0.0;
                    if(mapConversion != null)
                    {
                        easting = mapConversion.Eastings;
                        northing = mapConversion.Northings;
                    }

                    var zeroPointInBaseCRS = new GeoLocation
                    {
                        Latitude = northing,
                        Longitude = easting
                    };

                    // Получаем текущее смещение (Offset) сайта
                    var sitePlacement = site.ObjectPlacement as IIfcLocalPlacement;
                    
                    var axisPlacement = sitePlacement?.RelativePlacement as IIfcAxis2Placement3D;

                    if (axisPlacement == null)
                    {
                        Console.WriteLine("Размещение сайта не определено.");
                    }

                    // Получаем координаты смещения
                    double x = axisPlacement.Location.X;
                    double y = axisPlacement.Location.Y;
                    double z = axisPlacement.Location.Z;

                    // Вычисляем обратный вектор смещения
                    var translation = new XbimVector3D(-x, -y, -z);

                    //// Перемещаем все продукты (объекты) модели
                    //foreach (var prod in model.Instances.OfType<IIfcProduct>())
                    //{
                    //    var placement = prod.ObjectPlacement as IIfcLocalPlacement;
                    //    var axis = placement?.RelativePlacement as IIfcAxis2Placement3D;
                    //    if (axis != null)
                    //    {
                    //        axis.Location.X += translation.X;
                    //        axis.Location.Y += translation.Y;
                    //        axis.Location.Z += translation.Z;
                    //    }
                    //}

                    //txn.Commit();

                    //// Сохраняем изменённый IFC в новый файл
                    //model.SaveAs("output_to_origin.ifc");
                    //Console.WriteLine("Модель успешно сдвинута к началу координат и сохранена.");
                }

                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                var fileName = Path.GetFileName(filePath);
                var contentType = GetContentType(fileName);

                _logger.LogInformation("Successfully retrieved file: {FileName} for ID: {FileId}", fileName, fileId);

                return File(fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving file with ID: {FileId}", fileId);
                return StatusCode(500, "An error occurred while retrieving the file");
            }
        }

        private int GetEpsgCode(string crsName)
        {
            try
            {
                var sbst = crsName.ToLower().Substring(crsName.ToLower().IndexOf("epsg") + 4);
                string code = "";
                foreach (var item in sbst)
                {
                    if (Char.IsDigit(item))
                    {
                        code += item;
                    }
                    else if (Char.IsPunctuation(item))
                    {
                        continue;
                    }
                    else
                    {
                        break;
                    }
                }
                if(int.TryParse(code, out var epsg))
                {
                    return epsg;
                }
                return -1;
            }
            catch
            {
                return -1;                
            }
        }

        private async Task<string> GetFilePathById(string fileId)
        {
            // Get the base directory from appsettings.json
            var baseDirectory = _configuration["IfcFileDirectoryPath"];

            if (string.IsNullOrEmpty(baseDirectory))
            {
                _logger.LogError("IfcFileDirectoryPath is not configured in appsettings.json");
                throw new InvalidOperationException("IfcFileDirectoryPath is not configured");
            }

            var filePath = Path.Combine(baseDirectory, $"{fileId}.ifc");

            return await Task.FromResult(filePath);
        }

        private static string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return extension switch
            {
                ".ifc" => "application/octet-stream",
                ".pdf" => "application/pdf",
                ".txt" => "text/plain",
                ".json" => "application/json",
                ".xml" => "application/xml",
                _ => "application/octet-stream"
            };
        }
    }
}
