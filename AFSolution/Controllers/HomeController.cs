using AFSolution.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace AFSolution.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        // add new view dashboard
        [Authorize]
        public IActionResult Dashboard()
        {
            return View();
        }


        // sample get Data
        public async Task<IActionResult> GetData()
        {
            // In a real app, you'd get data from a service or database. Provide 25 samples
            var fileData = new List<FileViewModel>
        {
            new FileViewModel { Id = 1, FileName = "File 3843843 Sample", Status = "Active", Date = "2025-07-19" },
            new FileViewModel { Id = 2, FileName = "File Sample 2222", Status = "Pending", Date = "2025-07-18" },
            new FileViewModel { Id = 3, FileName = "Archived Report Q2", Status = "Inactive", Date = "2025-06-30" },
            new FileViewModel { Id = 4, FileName = "Final Draft Project X", Status = "Active", Date = "2025-07-20" },
            new FileViewModel { Id = 5, FileName = "Meeting Notes 2025", Status = "Pending", Date = "2025-07-21" },
            new FileViewModel { Id = 6, FileName = "Budget Report 2025", Status = "Active", Date = "2025-07-22" },
            new FileViewModel { Id = 7, FileName = "Client Feedback", Status = "Pending", Date = "2025-07-23" },
            new FileViewModel { Id = 8, FileName = "Project Plan", Status = "Active", Date = "2025-07-24" },
            new FileViewModel { Id = 9, FileName = "Design Mockups", Status = "Inactive", Date = "2025-07-25" },
            new FileViewModel { Id = 10, FileName = "Research Findings", Status = "Active", Date = "2025-07-26" },
            new FileViewModel { Id = 11, FileName = "User Stories", Status = "Pending", Date = "2025-07-27" },
            new FileViewModel { Id = 12, FileName = "Sprint Retrospective", Status = "Active", Date = "2025-07-28" },
            new FileViewModel { Id = 13, FileName = "Risk Assessment", Status = "Inactive", Date = "2025-07-29" },
            new FileViewModel { Id = 14, FileName = "Compliance Report", Status = "Active", Date = "2025-07-30" },
            new FileViewModel { Id = 15, FileName = "Training Materials", Status = "Pending", Date = "2025-07-31" },
            new FileViewModel { Id = 16, FileName = "Sales Data Q1", Status = "Active", Date = "2025-08-01" },
            new FileViewModel { Id = 17, FileName = "Marketing Strategy", Status = "Pending", Date = "2025-08-02" },
            new FileViewModel { Id = 18, FileName = "Product Roadmap", Status = "Active", Date = "2025-08-03" },
            new FileViewModel { Id = 19, FileName = "Customer Support Logs", Status = "Inactive", Date = "2025-08-04" },
            new FileViewModel { Id = 20, FileName = "Vendor Contracts", Status = "Active", Date = "2025-08-05" },
            new FileViewModel { Id = 21, FileName = "IT Security Audit", Status = "Pending", Date = "2025-08-06" },
            new FileViewModel { Id = 22, FileName = "System Performance Report", Status = "Active", Date = "2025-08-07" },
            new FileViewModel { Id = 23, FileName = "Data Backup Logs", Status = "Inactive", Date = "2025-08-08" },
        };

            // Simulate a network delay to see the loading state
            await Task.Delay(1500);

            // Return the data as a JSON response with a 200 OK status.
            return Ok(fileData);
        }

        // ACTION: Serves a mock file for download
        [HttpGet]
        public IActionResult DownloadFile(int id)
        {
            // 1. Mockup: In a real application, you would retrieve the actual file 
            // from a database, blob storage (like Azure or S3), or a file system.
            var fileContent = $"This is the mock BIR file content for record ID: {id}.\nGenerated on: {DateTime.Now}";

            // 2. Convert the file content to a byte array.
            var fileBytes = Encoding.UTF8.GetBytes(fileContent);

            // 3. Set the filename that the user will see.
            var fileName = $"BIR_File_{id}.txt";

            // 4. Return a FileResult. 
            // The content type "application/octet-stream" is a generic binary file type
            // that prompts the browser to download the file rather than display it.
            return File(fileBytes, "application/octet-stream", fileName);
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            // 1. Validate the user
            if (model.Email == "sample@email.com" && model.Otp == "123456")// TO BE REPLACED BY YOUR OTP VALIDATION LOGIC
            {
                // 2. Create claims - these are pieces of information about the user
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, model.Email),
                    new Claim("UserEmailAddress", model.Email),
                    // You can add more claims here, like roles
                    // new Claim(ClaimTypes.Role, "Admin"),
                };

                // 3. Create the identity and principal
                var claimsIdentity = new ClaimsIdentity(
                    claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true, // Make the cookie persistent across browser sessions
                    ExpiresUtc = DateTimeOffset.UtcNow.AddHours(12)
                };

                // 4. Sign the user in, which creates the authentication cookie
                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties);

                // 5. Return success. The JavaScript will handle the redirect.
                return Ok(new { message = "Login successful" });
            }

            return Unauthorized(new { message = "Invalid email or OTP" });
        }

        [Authorize] // Ensure only logged-in users can log out
        public async Task<IActionResult> Logout()
        {
            // Clears the authentication cookie
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            // Redirect the user back to the login page
            return RedirectToAction("Index", "Home");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
