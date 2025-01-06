import { Pipe, PipeTransform } from '@angular/core';
import { CityService } from '../../../services/city.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'cityName'
})
export class CityNamePipe implements PipeTransform {

  constructor(private cityService: CityService){}

  transform(cityId: number): Observable<string> {
    return this.cityService.getCityNameById(cityId);
  }
}
