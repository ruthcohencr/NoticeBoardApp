using NoticesBoardAPI.Entities;

namespace NoticesBoardAPI.Repositories.Notices
{
    public interface INoticesRepository
    {
        Task<List<Notice>> GetNoticesAsync();

        Task<Notice?> GetNoticeByIdAsync(int id);

        Task CreateAsync(Notice noticeDTO);
        List<Notice> GetNotices();
        Task<IEnumerable<Notice>> GetNoticesByUserId(string userId);
        Task<bool> Delete(int id);
        Task<bool> UpdateAsync(Notice noticeToUpdate);
    }
}
