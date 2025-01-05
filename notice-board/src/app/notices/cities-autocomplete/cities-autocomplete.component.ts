import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CityAutoCompleteDTO } from '../models/city-auto-complete.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-cities-autocomplete',
  imports: [MatFormFieldModule, MatAutocompleteModule, ReactiveFormsModule, FormsModule, MatToolbarModule, MatInputModule],
  templateUrl: './cities-autocomplete.component.html',
  styleUrl: './cities-autocomplete.component.css'
})
export class CitiesAutocompleteComponent implements OnInit{
    
  @Output()
  postCity = new EventEmitter<CityAutoCompleteDTO>();

  constructor(private cityService: CityService){}

    cities: CityAutoCompleteDTO[] = [];

    citiesOriginal = this.cities;

    selectedCity!: CityAutoCompleteDTO;

    control = new FormControl();

    ngOnInit(): void {

      this.cityService.getCities().subscribe( serverCities => {
        this.cities = serverCities;
        this.citiesOriginal = [...serverCities];
      });


      this.control.valueChanges.pipe(
          debounceTime(300), // Wait for 300ms after the user stops typing
          distinctUntilChanged() // Only react to value changes, not repeated values
            ).subscribe(value => {
              
              if (!value){
                            
                this.cities = [...this.citiesOriginal];
                return;
              }
    
              const searchTerm = typeof value === 'string' ? value.toLowerCase(): '';       

              if (searchTerm)
    
                this.cities = this.citiesOriginal.filter(city =>
             //     city.name.toLocaleLowerCase().includes(searchTerm)  // Filter based on the name
                  city.name.toLowerCase().includes(searchTerm)  // Filter based on the name
                );
            });
    }

    handleSelection(event: MatAutocompleteSelectedEvent){
      this.selectedCity = event.option.value;
      this.postCity.emit(this.selectedCity);
    }

    displayFn(city: CityAutoCompleteDTO): string {
      return city ? city.name : '';
    }

    clearCitySelection(): void {
      this.control.setValue('');
      this.selectedCity = null!; 
      this.cities = [...this.citiesOriginal]; 
    }

}
