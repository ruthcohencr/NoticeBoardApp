using System.ComponentModel.DataAnnotations;

namespace NoticesBoardAPI.DTOs
{
    /// <summary>
    /// Use this for reading Notice entity
    /// </summary>
    public class NoticeDTO
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public DateTime UploadDate { get; set; }
        public required string Description { get; set; }

        public int CategoryId { get; set; }
        public int CityId { get; set; }

        public string? ImageFile { get; set; }

        public string? UserId { get; set; }
    }
}
