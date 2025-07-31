using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

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

                // TODO: Implement your file retrieval logic here
                // This could involve:
                // - Validating the file ID format
                // - Checking if the file exists in your storage (database, file system, cloud storage)
                // - Retrieving file metadata and content
                // - Applying any necessary authorization checks

                // Example implementation (replace with your actual logic):
                var filePath = await GetFilePathById(fileId);
                
                if (string.IsNullOrEmpty(filePath) || !System.IO.File.Exists(filePath))
                {
                    _logger.LogWarning("File not found for ID: {FileId}", fileId);
                    return NotFound($"File with ID '{fileId}' not found");
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
