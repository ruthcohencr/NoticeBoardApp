import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { NoticeCreationDTO, NoticeDTO } from '../../../notices/models/notice.models';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputImgComponent } from "../input-img/input-img.component";
import { CategoryDTO } from '../../../notices/models/category.model';
import { CitiesAutocompleteComponent } from "../../../notices/cities-autocomplete/cities-autocomplete.component";
import { CityAutoCompleteDTO } from '../../../notices/models/city-auto-complete.model';
import { CityDTO } from '../../../notices/models/city.model';
import { CategoryService } from '../../../services/category.service';
import { CityService } from '../../../services/city.service';

@Component({
  selector: 'app-notice-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, RouterLink,
    CommonModule, MatButtonModule, MatSelectModule, FormsModule, InputImgComponent, CitiesAutocompleteComponent],
  templateUrl: './notice-form.component.html',
  styleUrl: './notice-form.component.css'
})

export class NoticeFormComponent implements OnInit {

  router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  @Input()
  model?: NoticeDTO;

  @Output()
  postForm = new EventEmitter<NoticeCreationDTO>();

  cities: CityDTO[] = [];
  categories: CategoryDTO[] = [];
  selectedCityId: number | null = null;
  

  noticeForm = this.formBuilder.group({
    title: ['', { validators: [Validators.required] }],
    description: ['', { validators: [Validators.maxLength(100)] }],
    imageFile: new FormControl<null | File | string>(null),
    categoryId: [0, Validators.required],
    cityId: [0, Validators.required],
    userId: [''],
    //  userPhone: [null]
  });

  // I am doing it here so I can load the model to the form
  ngOnInit(): void {
    if (this.model !== undefined) {
      this.noticeForm.patchValue(this.model);
    }

    this.categories = this.categoryService.getCategories();
  }

  getErrorMessagesForName(): string {

    let field = this.noticeForm.controls.title;
    if (field.hasError('required')) {
      return "The title field is required"
    }
    return "";
  }

  getErrorMessagesForDescription(): string {

    let field = this.noticeForm.controls.description;
    if (field.hasError('maxLength')) {
      return "Description cannot exceed 100 characters";
    }
    return "";
  }

  handleFileSelection(file: File) {
    this.noticeForm.controls.imageFile.setValue(file);
  }

  handleCitySelection(city: CityAutoCompleteDTO){
    this.noticeForm.controls.cityId.setValue(city.id);
  }

  saveChanges() {

    if (this.noticeForm.valid) {
      console.log('valid', this.noticeForm.value);

      const notice = this.noticeForm.value as NoticeCreationDTO;

      if (typeof notice.imageFile === "string") {
        notice.imageFile = undefined;
      }

      this.postForm.emit(notice);
    }

    this.router.navigate(['/my-notices']);

  }
}

