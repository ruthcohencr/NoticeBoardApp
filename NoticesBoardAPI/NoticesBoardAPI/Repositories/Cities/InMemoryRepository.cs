using NoticesBoardAPI.Entities;

namespace NoticesBoardAPI.Repositories.City
{
    public class InMemoryRepository : ICityRepository
    {
        private List<Notice> _notices;
        private List<Entities.City> _cities;

        public InMemoryRepository()
        {
            _notices = new List<Notice>();
            _cities = new List<Entities.City>()
            {
                new Entities.City{ Id=1, Name="Tel-Aviv"},
                new Entities.City{ Id=2, Name="Jerusalem"},
                new Entities.City{ Id=3, Name="Holon"},
                new Entities.City{ Id=4, Name="Ramat-Hasharon"},
            };
        }

        public async Task<List<Entities.City>> GetCitiesAsync()
        {
            await Task.Delay(TimeSpan.FromSeconds(1));
            return _cities;
        }

        public async Task<Entities.City?> GetCityByIdAsync(int id)
        {
            await Task.Delay(TimeSpan.FromSeconds(3));
            return _cities.FirstOrDefault(c => c.Id == id);
        }
    }
}