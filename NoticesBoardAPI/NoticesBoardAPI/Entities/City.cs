using Microsoft.AspNetCore.Antiforgery;
using System.ComponentModel.DataAnnotations;

namespace NoticesBoardAPI.Entities
{
    public class City
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "You must fill the {0} field")]
        //[StringLength(maximumLength: 10)]
        public required string Name { get; set; }

        //[Range(minimum: 18, maximum: 120)]
        //public int Age { get; set; }


        //[Phone]
        //public string Phone     { get; set; }
    }
}
