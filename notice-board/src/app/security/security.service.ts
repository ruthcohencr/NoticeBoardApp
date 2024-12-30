import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthenticationResponseDTO, UserCredentialsDTO } from './security.models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  private http = inject(HttpClient);
  private baseURL = environment.apiURL + '/users';
  private readonly keyToken = 'token';
  private readonly keyExpiration = 'token-expiration'; 

  nameidentifierClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

  register(credentials: UserCredentialsDTO) : Observable<AuthenticationResponseDTO>{
    return this.http.post<AuthenticationResponseDTO>(`${this.baseURL}/register`, credentials)
    .pipe(
      tap(authenticationResponse => this.storeToken(authenticationResponse))
    );   
  }

  login(credentials: UserCredentialsDTO) : Observable<AuthenticationResponseDTO>{
    return this.http.post<AuthenticationResponseDTO>(`${this.baseURL}/login`, credentials)
    .pipe(
      tap(authenticationResponse => this.storeToken(authenticationResponse)),
    );   
  }

  storeToken(authenticationResponse: AuthenticationResponseDTO){
      localStorage.setItem(this.keyToken, authenticationResponse.token);
      localStorage.setItem(this.keyExpiration, authenticationResponse.expiration.toString());
  }

  isLoggedIn(): boolean {
    const token = this.getJWTToken();
    
    if (!token){
      return false;
    }
    
    const expiration = localStorage.getItem(this.keyExpiration)!;
    const expirationDate = new Date(expiration);

    if (expirationDate <= new Date())
    {
      this.logout();
      return false;
    }

    return true;
  }

  logout(){
    localStorage.removeItem(this.keyExpiration);
    localStorage.removeItem(this.keyToken);
  }

  getCurrentUserEmail(): string | null {
    const token = this.getJWTToken();
    
    if (!token) {return null};

    const dataToken = this.decodeJwtToken(token);
    return dataToken?.userId || null;

  }

  getJWTToken(): string | null {
    return localStorage.getItem(this.keyToken);
  }

  hasRole(role: string): boolean {
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    return userRoles.includes(role);
  }

  getCurrentUserId(): string | null {
    return this.getJWTClaim(this.nameidentifierClaim);  // contains the GUID of the user
  }

  getJWTClaim(field: string): string {
    const token = this.getJWTToken();
    if (!token) {return ''};

    const dataToken = JSON.parse(atob(token.split('.')[1]));
    return dataToken[field];
  }

  private decodeJwtToken(token: string): any {
    const payload = token.split('.')[1]; // JWT payload is the second part
    const decodedPayload = atob(payload); // Base64 decode the payload
    return JSON.parse(decodedPayload); // Parse it as JSON
  }

}
