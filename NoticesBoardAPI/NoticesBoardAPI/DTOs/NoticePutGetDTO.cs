namespace NoticesBoardAPI.DTOs
{
    public class NoticePutGetDTO
    {
        public NoticeDTO Notice { get; set; } = null!;
        public UserDTO UserDTO {get;set;}
    }
}
