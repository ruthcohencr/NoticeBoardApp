import { Component, inject, Input } from '@angular/core';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-authorized',
  imports: [],
  templateUrl: './authorized.component.html',
  styleUrl: './authorized.component.css'
})
export class AuthorizedComponent {
   securityService = inject(SecurityService);

  @Input()
  role?: string;

  // constructor(private securityService: SecurityService){}

  isAuthorized(): boolean {

    if (!this.securityService.isLoggedIn()){
      return false;
    }

    if (this.role && !this.securityService.hasRole(this.role)) {
      return false;
    }

    return true;
  }
}
