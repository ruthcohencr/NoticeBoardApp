using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using NoticesBoardAPI.DTOs;
using NoticesBoardAPI.Entities;
using NoticesBoardAPI.Repositories.City;
using NoticesBoardAPI.Repositories.Notices;
using NoticesBoardAPI.Services;
using System.Security.Claims;

namespace NoticesBoardAPI.Controllers
{
    [ApiController]
    [Route("api/notices")]
    public class NoticesController : ControllerBase
    {
        private readonly IOutputCacheStore outputCacheStore;
        private readonly IMapper mapper;
        private const string cacheTag = "notices";
        private readonly NoticesService noticesService;
        private readonly IFileStorage fileStorage;
        private readonly string container = "notices";

        public NoticesController(IOutputCacheStore outputCacheStore,
            IMapper mapper,
            NoticesService noticeService,
            IFileStorage fileStorage)
        {
            this.outputCacheStore = outputCacheStore;
            this.mapper = mapper;
            this.noticesService = noticeService;
            this.fileStorage = fileStorage;
        }

        [HttpGet]
        [OutputCache(Tags = [cacheTag])] // So I'll be able to clean this specific cache
        public List<Notice> GetNoticesAsync()
        {
            var notices = noticesService.GetNotices();
            return notices;
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<Notice>>> GetNoticesByUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null) { return NotFound(); }

            var notices = await noticesService.GetNoticesByUserId(userId);

            if (notices == null)
            {
                return NotFound();
            }

            return Ok(notices);
        }

        [HttpGet("{id}", Name = "GetNoticeById")]
        public async Task<ActionResult<Notice?>> GetNoticeByIdAsync(int id)
        {
            try
            {
               // var notice = await _noticesRepository.GetNoticeByIdAsync(id);
                var notice = await noticesService.GetNoticeByIdAsync(id);

                if (notice is null)
                {
                    return NotFound($"City with ID {id} not found.");
                }
                return Ok(notice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Notice>> CreateNotice ([FromForm] NoticeCreationDTO noticeCreationDTO)
        {
            var notice = mapper.Map<Notice>(noticeCreationDTO);

            if (noticeCreationDTO.ImageFile is not null)
            {
                var url = await fileStorage.Store(container, noticeCreationDTO.ImageFile);
                notice.ImageFile = url;
            }
            if (notice == null)
            {
                return BadRequest("Invalid notice data."); // todo add validation
            }
            try
            {
                // Add the new notice to the service
                await noticesService.AddNoticeAsync(notice);
                await outputCacheStore.EvictByTagAsync(cacheTag, default);
                var noticeDTO = mapper.Map<NoticeDTO>(notice);
                return CreatedAtRoute("GetNoticeById", new { id = noticeDTO.Id }, noticeDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }            
        }

        [HttpGet("putget/{id}")]
        public async Task<ActionResult<NoticeDTO>> PutGet(int id)
        {
            var noticeToUpdate = await noticesService.GetNoticeByIdAsync(id);

            if (noticeToUpdate is null)
            {
                return NotFound();
            }

            return Ok(noticeToUpdate);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> Put (int id, [FromForm] NoticeCreationDTO noticeCreationDTO)
        {
            var noticeToUpdate = await noticesService.GetNoticeByIdAsync(id);

            if (noticeToUpdate is null)
            {
                return NotFound();
            }

            noticeToUpdate = mapper.Map(noticeCreationDTO, noticeToUpdate);

            if (noticeCreationDTO.ImageFile is not null)
            {
                noticeToUpdate.ImageFile = await fileStorage.Edit(noticeToUpdate.ImageFile,
                    container,
                    noticeCreationDTO.ImageFile);
            }

            bool updated = await noticesService.UpdateNotices(noticeToUpdate);

            if (!updated)
            {
                return NotFound();
            }

            await outputCacheStore.EvictByTagAsync(cacheTag, default);

            return NoContent(); 
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var successfulDelete = await noticesService.Delete(id);
            if (!successfulDelete)
            {
                return NotFound();
            }

            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return NoContent();
        }
    }

}
