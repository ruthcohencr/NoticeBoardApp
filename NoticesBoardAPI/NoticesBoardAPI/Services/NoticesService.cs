using NoticesBoardAPI.Entities;
using NoticesBoardAPI.Repositories.Notices;

namespace NoticesBoardAPI.Services
{
    public class NoticesService
    {
        private readonly INoticesRepository _noticesRepository;
        public NoticesService(INoticesRepository noticesRepository)
        {
            _noticesRepository = noticesRepository;
        }

        public async Task AddNoticeAsync(Notice notice)
        {
            await _noticesRepository.CreateAsync(notice);
        }

        public async Task<Notice> GetNoticeByIdAsync(int id)  // change all to NoticeDTO
        {
            Notice? notice = await _noticesRepository.GetNoticeByIdAsync(id);
            return notice;
        }

        public Task<List<Notice>> GetNoticesAsync()
        {
            return _noticesRepository.GetNoticesAsync();
        }

        public List<Notice> GetNotices()
        {
            var notices = _noticesRepository.GetNotices();
            return notices;
        }

        public async Task<IEnumerable<Notice>> GetNoticesByUserId(string userId)
        {
            return await _noticesRepository.GetNoticesByUserId(userId);

        }

        public async Task<bool> Delete(int id)
        {
            return await _noticesRepository.Delete(id);
        }

        public async Task<bool> UpdateNotices(Notice noticeToUpdate)
        {
            return await _noticesRepository.UpdateAsync(noticeToUpdate);
        }
    }
}
