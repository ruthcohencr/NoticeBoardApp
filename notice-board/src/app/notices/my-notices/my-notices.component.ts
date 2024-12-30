import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
//import { AuthService } from '../../services/auth.service';
import { NoticesService } from '../../services/notices.service';
import { NoticeDTO } from '../models/notice.models';
import { NoticesListComponent } from "../../Shared/components/notices-list/notices-list.component";
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-my-notices',
  imports: [MatIconModule, MatButtonModule, RouterLink, NoticesListComponent],
  templateUrl: './my-notices.component.html',
  styleUrl: './my-notices.component.css'
})
export class MyNoticesComponent implements OnInit {
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  noticesService = inject(NoticesService);
  noticesOriginal: NoticeDTO[] = [];
  noticesList = this.noticesOriginal;


  constructor(private authService: SecurityService) {  
    this.loadNoticesForUser();
  }

  loadNoticesForUser() {
    //const userGuid = this.authService.getCurrentUserId();
    this.noticesService.getNoticesByUser().subscribe(notices => {
      this.noticesList = this.noticesOriginal = notices;
    });
  }

  deleteNotice(id: number): void {
    this.noticesList = this.noticesList.filter(notice => notice.id !== id);

    this.noticesService.delete(id).subscribe(() => {
      this.loadNoticesForUser();
    });
  }

  // isLoggedIn(): boolean{
  //     return this.authService.isLoggedIn();
  // }
}
