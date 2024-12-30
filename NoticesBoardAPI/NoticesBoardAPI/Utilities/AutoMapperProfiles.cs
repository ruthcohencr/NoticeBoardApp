using NoticesBoardAPI.DTOs;
using NoticesBoardAPI.Entities;
using AutoMapper;

namespace NoticesBoardAPI.Utilities
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            ConfigureNotices();
        }

        private void ConfigureNotices()
        {

            CreateMap<NoticeCreationDTO, Notice>()
                .ForMember(dest => dest.UserId, options => options.MapFrom(src => src.UserId))
                .ForMember(x => x.ImageFile, options => options.Ignore());

            CreateMap<Notice, NoticeDTO>();
            CreateMap<Notice, NoticeCreationDTO>()
                 .ForMember(dest => dest.UserId, options => options.MapFrom(src => src.UserId));

            CreateMap<NoticeCreationDTO, NoticeDTO>()
                .ForMember(dest => dest.UserId, options => options.MapFrom(src => src.UserId))
                .ForMember(x => x.ImageFile, options => options.Ignore());
        }
    }
}
