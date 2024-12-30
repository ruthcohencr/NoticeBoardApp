import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { NoticeCreationDTO, NoticeDTO } from '../models/notice.models';
import { NoticeFormComponent } from '../../Shared/components/notice-form/notice-form.component';
import { NoticesService } from '../../services/notices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-notice',
  imports: [NoticeFormComponent],
  templateUrl: './edit-notice.component.html',
  styleUrl: './edit-notice.component.css'
})
export class EditNoticeComponent implements OnInit {
  
  @Input({ transform: numberAttribute })
  id!: number;

  router = inject(Router);
  model?: NoticeDTO

  errors: string[] = [];
  noticesService = inject(NoticesService);

  ngOnInit(): void {
    // this.noticesService.putGetNotice(this.id).subscribe( response => {
    //   this.model = response;
    // });
    this.noticesService.getById(this.id).subscribe(notice => {
      this.model = notice;
    });
  }

  saveChanges(notice: NoticeCreationDTO){
    this.noticesService.update(this.id, notice).subscribe({
      next: () => {
        this.router.navigate(["/notices"]);
      },
      error: err => {
        // const errors = extractErrors(err);
        // this.errors = errors;
      }
    });
  }

}
