using Newtonsoft.Json;
using NoticesBoardAPI.Entities;

namespace NoticesBoardAPI.Repositories.City
{
    public class CityRepository : ICityRepository
    {
        private readonly string _jsonCitiesFilePath;

        public CityRepository()
        {
            _jsonCitiesFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "cities.json");

        }
        public async Task<List<Entities.City>> GetCitiesAsync()
        {
            if (!File.Exists(_jsonCitiesFilePath))
            {
                throw new FileNotFoundException("City data file not found.");
            }

            var jsonData = await File.ReadAllTextAsync(_jsonCitiesFilePath);

            var cities = JsonConvert.DeserializeObject<List<Entities.City>>(jsonData);
            return cities;
        }

        public async Task<Entities.City?> GetCityByIdAsync(int id)
        {
            var cities = await GetCitiesAsync();

            var city = cities.FirstOrDefault(c => c.Id == id);
            return city;
        }
    }
}
