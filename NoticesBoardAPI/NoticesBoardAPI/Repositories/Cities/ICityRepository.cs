using NoticesBoardAPI.Entities;

namespace NoticesBoardAPI.Repositories.City
{
    public interface ICityRepository
    {
        Task<List<Entities.City>> GetCitiesAsync();

        Task<Entities.City?> GetCityByIdAsync(int id);
    }
}
