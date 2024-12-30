using System.ComponentModel.DataAnnotations;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace NoticesBoardAPI.Entities
{
    public class Notice
    {
        public int Id { get; set; }


        [Required(ErrorMessage = "You must fill the {0} field")]
        [StringLength(maximumLength: 150)]
        public required string Title { get; set; }

        public DateTime UploadDate { get; set; }
        public required string Description { get; set; }

        public int CategoryId { get; set; }
        public int CityId { get; set; }

        public string? ImageFile { get; set; }

        public string? UserId { get; set; }
    }
}