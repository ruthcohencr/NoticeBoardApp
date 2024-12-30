import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoticeCreationDTO, NoticeDTO } from '../models/notice.models';
import { NoticeFormComponent } from "../../Shared/components/notice-form/notice-form.component";
import { NoticesService } from '../../services/notices.service';
import { extractErrors } from '../../Shared/Functions/extractErrors';
import { DisplayErrorsComponent } from "../../Shared/component/display-errors/display-errors.component";


@Component({
  selector: 'app-create-notice',
  imports: [MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NoticeFormComponent, DisplayErrorsComponent],
  templateUrl: './create-notice.component.html',
  styleUrl: './create-notice.component.css'
})
export class CreateNoticeComponent {
  
    router = inject(Router);
    noticesService = inject(NoticesService);
    errors: string[] = [];

  saveChanges(notice: NoticeCreationDTO){

    this.noticesService.create(notice).subscribe({
        next: () => {
          console.log('creating the notice:', notice);
          this.router.navigate(['/notices']); 
        },
        error: err => {
          const errors = extractErrors(err);
          this.errors = errors;
          console.log(errors);
        }});
  }
}
