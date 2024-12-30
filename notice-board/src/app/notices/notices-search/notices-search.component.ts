import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InputImgComponent } from '../../Shared/components/input-img/input-img.component';
import { CategoryDTO } from '../models/category.model';
import { NoticesListComponent } from "../../Shared/components/notices-list/notices-list.component";
import { NoticesSearchDTO } from "../notices-search/notices-search.models";
import { NoticesService } from '../../services/notices.service';
import { NoticeDTO } from '../models/notice.models';
import { environment } from '../../../environments/environment.development';
import { CategoryService } from '../../services/category.service';
import { CitiesAutocompleteComponent } from "../cities-autocomplete/cities-autocomplete.component";
import { CityAutoCompleteDTO } from '../models/city-auto-complete.model';




@Component({
  selector: 'app-notices-search',
  imports: [MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCheckbox,
    CommonModule, MatSelectModule, FormsModule, NoticesListComponent, CitiesAutocompleteComponent],
  templateUrl: './notices-search.component.html',
  styleUrl: './notices-search.component.css'
})

export class NoticesSearchComponent implements OnInit {
  
  handleCitySelection(city: CityAutoCompleteDTO) {
    this.form.controls.cityId.setValue(city.id); // todo change to id
  }

  //allows me to examine the url i am in 
  activatedRoute = inject(ActivatedRoute);

  //allows me to update the url
  location = inject(Location);

  noticesService = inject(NoticesService);
  noticesOriginal: NoticeDTO[] = [];
  noticesList = this.noticesOriginal;

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    title: '',
    categoryId: 0,
    city: '',
    cityId: 0,
    containsImage: false
  })

  categories: CategoryDTO[] = [];

  constructor(private categoryService: CategoryService){
    const notices = this.noticesService.getAll().subscribe(notices => {
      this.noticesList = this.noticesOriginal = notices;
      //this.noticesList = this.noticesOriginal;
    });

  }

  ngOnInit(): void {

    console.log("onInit")
      this.readValuesFromURL();
      this.filterNotice(this.form.value as NoticesSearchDTO);

      this.form.valueChanges.subscribe(values => {
          this.noticesList = this.noticesOriginal;
          this.filterNotice(values as NoticesSearchDTO);
          this.writeParametersInTheURL();
      })

      this.categories = this.categoryService.getCategories();
  }
  
  readValuesFromURL(){
      this.activatedRoute.queryParams.subscribe((params: any) => {
        
        let obj: any = {};
        
        if (params.title){
          obj.title = params.title;
        }
        if (params.categoryId){
          obj.categoryId = Number(params.categoryId);
        }
        if (params.containsImage){
          obj.containsImage = Boolean(params.containsImage);
        }
        if (params.city){
          obj.cityId = params.cityId;
        }
        
        this.form.patchValue(obj);
      });
  }

  writeParametersInTheURL(){
    let queryString = [];

    const valuesOfForm = this.form.value as NoticesSearchDTO;

    if (valuesOfForm.title){
      queryString.push(`title=${encodeURIComponent(valuesOfForm.title)}`);
    }

    if (valuesOfForm.categoryId){
      queryString.push(`categoryId=${valuesOfForm.categoryId}`);
    }

    if (valuesOfForm.city){
      queryString.push(`cityId=${encodeURIComponent(valuesOfForm.cityId)}`);
    }

    if (valuesOfForm.containsImage){
      queryString.push(`containsImage=${valuesOfForm.containsImage}`);
    }

    // todo replace to 'board-notices/search'
    // this.location.replaceState('my-notices/search',queryString.join('&'));
    this.location.replaceState('notices/search',queryString.join('&'));
  }

  filterNotice(values: NoticesSearchDTO) {
    console.log(values);
    
    this.filterByTitle(values);

    this.filterByCategory(values);

    this.filterByContainAnImage(values);

    this.filterByCityName(values);

  }

  private filterByCityName(values: NoticesSearchDTO) {
    if (values.cityId) {
      this.noticesList = this.noticesList.filter(notice => notice.cityId == values.cityId);
    }
  }

  private filterByContainAnImage(values: NoticesSearchDTO) {
    if (values.containsImage) {
      this.noticesList = this.noticesList.filter(notice => notice.imageFile !== null);
    }
  }

  private filterByCategory(values: NoticesSearchDTO) {
    if (values.categoryId !== 0) {
      this.noticesList = this.noticesList.filter(notice => notice.categoryId === values.categoryId);
    }
  }

  private filterByTitle(values: NoticesSearchDTO) {
    if (values.title) {
      this.noticesList = this.noticesList.filter(
        notice => notice.title.toLowerCase()
          .indexOf(values.title.toLowerCase()) != -1);
    }
  }

  clear() {
    this.form.patchValue({
      title: '',
      categoryId: 0,
      cityId: 0,
      containsImage: false
    });
  }
}
