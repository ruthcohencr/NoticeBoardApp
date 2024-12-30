using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using NoticesBoardAPI.DTOs;
using NoticesBoardAPI.Entities;
using NoticesBoardAPI.Repositories.City;

namespace NoticesBoardAPI.Controllers
{
    [ApiController]
    [Route("api/cities")]
    public class CitiesController : ControllerBase
    {
        private readonly ICityRepository _cityRepository;
        public CitiesController(ICityRepository repository)
        {
            this._cityRepository = repository;
        }

        [HttpGet(Name = "GetCities")]
        [OutputCache]
        public async Task<ActionResult<List<CityDTO>>> GetCities()
        {
            try
            {
                var cities = await _cityRepository.GetCitiesAsync();
                return Ok(cities);
            }
            catch (FileNotFoundException)
            {
                return NotFound("City data file not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id:int}")]
        [OutputCache]
        public async Task<ActionResult<City>> Get(int id)
        {
            try
            {
                var city = await _cityRepository.GetCityByIdAsync(id);

                if (city is null)
                {
                    return NotFound($"City with ID {id} not found.");
                }
                return Ok(city);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}
