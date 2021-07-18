using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;


namespace ComplianceAPI.Controllers
{
    [Authorize]
    //[AuthorizeForScopes(Scopes = new string[] { "api://a5dea948-48cb-4f0d-87e5-d89d3482287c/access_as_user" })]
    [ApiController]
    [Route("[controller]/[action]")]
    public class ComplianceController : ControllerBase
    {

        [HttpGet]
        public IActionResult Get()
        {
            var bigCities = new List<string>()
                    {
                        "New York",
                        "London",
                        "Mumbai",
                        "Chicago"
                    };
            return Ok(bigCities);
        }

    }
}

