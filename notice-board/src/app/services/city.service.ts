import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { CityDTO } from '../notices/models/city.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private baseURL = environment.apiURL + '/cities';
  private cityListSubject: BehaviorSubject<CityDTO[]> = new BehaviorSubject<CityDTO[]>([]);

  private cityList: { [key: number]: string } = {};

  constructor(private http: HttpClient) { }

  getCities(): Observable<CityDTO[]> {
    return this.http.get<CityDTO[]>(this.baseURL).pipe(
      tap(cities => {
        this.cityListSubject.next(cities);  // Update the BehaviorSubject with new data
      })
    );
  }

  getCityNameById(id: number): Observable<string> {
    return this.cityListSubject.asObservable().pipe(
      map(cities => {
        const city = cities.find(c => c.id === id);
        return city ? city.name : 'Unknown City';
      })
    );
  }
}
