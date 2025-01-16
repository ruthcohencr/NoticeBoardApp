import { Component, Input, ChangeDetectionStrategy, inject, Output, EventEmitter } from '@angular/core';
import { UpperCasePipe, DatePipe, AsyncPipe, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CategoryService } from '../../../services/category.service';
import { CityService } from '../../../services/city.service';
import { CityDTO } from '../../../notices/models/city.model';
import { NoticeDTO } from '../../../notices/models/notice.models';
import { Observable } from 'rxjs';
import { AuthorizedComponent } from "../../../security/authorized/authorized.component";
import { RouterLink, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MaxLengthPipe } from './max-length.pipe';
import { CityNamePipe } from "./city-name.pipe";

@Component({
  selector: 'app-notices-list',
  imports: [UpperCasePipe, DatePipe, MatCardModule, AsyncPipe, MaxLengthPipe,
    CommonModule, AuthorizedComponent, RouterLink, MatButtonModule, CityNamePipe],
  templateUrl: './notices-list.component.html',
  styleUrl: './notices-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoticesListComponent {

  @Input()
  notices!: NoticeDTO[];

  @Input()
  role?: string;

  router = inject(Router);
  private categoryService = inject(CategoryService);

  @Output() delete = new EventEmitter<number>();

  getCategoryName(categoryId: number): string {
    return this.categoryService.getCategoryById(categoryId);
  }

  onDelete(id: number): void {
    this.delete.emit(id);
  }
}
