import { inject, Injectable } from '@angular/core';
import { NoticeCreationDTO, NoticeDTO } from '../notices/models/notice.models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { SecurityService } from '../security/security.service';

@Injectable({
  providedIn: 'root'
})
export class NoticesService {

  constructor() { }

  private http = inject(HttpClient);
  private securityService = inject(SecurityService);

  private baseURL = environment.apiURL + '/notices';

  public getAll(): Observable<NoticeDTO[]> {
    return this.http.get<NoticeDTO[]>(this.baseURL);
  }

  public create(notice: NoticeCreationDTO) {

    const userId = this.securityService.getCurrentUserId()
    
    if (!userId) {
      throw new Error('Unable to retrieve user ID from token');
    }

    notice.userId = userId;

    const formData = this.buildFormData(notice);
    return this.http.post(this.baseURL, formData);
  }

  public getNoticesByUser(): Observable<NoticeDTO[]> {
    const token = this.securityService.getJWTToken();

    if (!token) {
      throw new Error('User is not authenticated');
    }
    const userId = this.securityService.getCurrentUserEmail();

    if (!userId) {
      throw new Error('Unable to retrieve user ID from token');
    }

    return this.http.get<NoticeDTO[]>(`${this.baseURL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`  // Send the token in the Authorization header
      }
    });

    //return this.http.get<NoticeDTO[]>(`${this.baseURL}/user/${userId}`);
  }

  // public putGetNotice(id: number): Observable<NoticeDTO>{
  //   return this.http.get<NoticeDTO>(`${this.baseURL}/putget/${id}`);
  // }

  public update(id: number, notice: NoticeCreationDTO){
    const formData = this.buildFormData(notice);
    return this.http.put(`${this.baseURL}/${id}`, formData);
  }
  
  public getById(id: number): Observable<NoticeDTO>{
    return this.http.get<NoticeDTO>(`${this.baseURL}/${id}`);
  }

  public delete(id: number){
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  
  private buildFormData(notice: NoticeCreationDTO): FormData {
    const formData = new FormData();

    formData.append('title', notice.title);
    formData.append('description', notice.description);
    formData.append('uploadDate', new Date().toISOString().split('T')[0]); // spliting and getting only the date
    formData.append('cityId', notice.cityId.toString());
    formData.append('categoryId', notice.categoryId.toString());
    formData.append('userId', notice.userId);

    if (notice.imageFile){
      formData.append('imageFile', notice.imageFile);
    }

    return formData;
  }

}
