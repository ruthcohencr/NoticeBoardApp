using Newtonsoft.Json;
using NoticesBoardAPI.Entities;

namespace NoticesBoardAPI.Repositories.Notices
{
    public class NoticesRepository : INoticesRepository
    {
        private readonly string _jsonNoticesFilePath;
        private List<Notice> _notices;

        public NoticesRepository()
        {
            _jsonNoticesFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "notices.json");
            _notices = LoadNoticesFromJson();
        }

        private List<Notice> LoadNoticesFromJson()
        {
            if (File.Exists(_jsonNoticesFilePath))
            {
                var jsonData = File.ReadAllText(_jsonNoticesFilePath);
                return JsonConvert.DeserializeObject<List<Notice>>(jsonData) ?? new List<Notice>();
            }
            return new List<Notice>();
        }

        public async Task CreateAsync(Notice notice)
        {
            // Generate a new ID for the new notice (simulating auto-increment behavior)
            notice.Id = _notices.Any() ? _notices.Max(n => n.Id) + 1 : 1;
            //_notices = LoadNoticesFromJson();
            _notices.Add(notice);

            await Task.Run(() => SaveNoticesToJson());
        }


        public List<Notice> GetNotices()
        {
            return _notices;
        }

        public async Task<Notice?> GetNoticeByIdAsync(int id)
        {
            // if it was DB, it could take more time
            return await Task.Run(() => _notices.Find(n => n.Id == id));
        }

        // I'll take the other approach using notices in memory
        public async Task<List<Notice>> GetNoticesAsync()
        {
            if (!File.Exists(_jsonNoticesFilePath))
            {
                throw new FileNotFoundException("notices data file not found.");
            }

            var jsonData = await File.ReadAllTextAsync(_jsonNoticesFilePath);

            var notices = JsonConvert.DeserializeObject<List<Notice>>(jsonData);
            return notices;
        }

        public async Task<IEnumerable<Notice>> GetNoticesByUserId(string userId)
        {
            var userNotices = await Task.Run(() => _notices.Where(n => n.UserId == userId).ToList());
            return userNotices;

        }

        public async Task<bool> Delete(int id)
        {
            var noticeToDelete = await GetNoticeByIdAsync(id);
            if (noticeToDelete == null)
            {
                return false;
            }

            _notices.Remove(noticeToDelete);

            SaveNoticesToJson();

            return true;

        }
        private void SaveNoticesToJson()
        {
            var jsonData = JsonConvert.SerializeObject(_notices, Formatting.Indented);
            File.WriteAllText(_jsonNoticesFilePath, jsonData);
        }

        public async Task<bool> UpdateAsync(Notice noticeToUpdate)
        {
            var noticeToDelete = await GetNoticeByIdAsync(noticeToUpdate.Id);
            if (noticeToDelete == null)
            {
                return false;
            }

            _notices.Remove(noticeToDelete);

            _notices.Add(noticeToUpdate);

            SaveNoticesToJson();

            return true;
        }
    }
}
