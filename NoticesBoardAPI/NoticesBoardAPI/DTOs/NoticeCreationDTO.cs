using System.ComponentModel.DataAnnotations;

namespace NoticesBoardAPI.DTOs
{
    /// <summary>
    /// Use this when creating a new Notice entity
    /// </summary>
    public class NoticeCreationDTO
    {
        [Required(ErrorMessage = "You must fill the {0} field")]
        [StringLength(maximumLength: 150)]
        public required string Title { get; set; }

        public DateTime UploadDate { get; set; }
        public required string Description { get; set; }

        public int CategoryId { get; set; }
        public int CityId { get; set; }

        public IFormFile? ImageFile { get; set; }

        public required string UserId { get; set; }
    }
}
