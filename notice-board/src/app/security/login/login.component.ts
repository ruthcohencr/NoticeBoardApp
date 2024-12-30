import { Component, inject } from '@angular/core';
import { SecurityService } from '../security.service';
import { Router } from '@angular/router';
import { UserCredentialsDTO } from '../security.models';
import { AuthenticationFormComponent } from "../authentication-form/authentication-form.component";
import { extractErrors } from '../../Shared/Functions/extractErrors';
import { DisplayErrorsComponent } from "../../Shared/component/display-errors/display-errors.component";

@Component({
  selector: 'app-login',
  imports: [AuthenticationFormComponent, DisplayErrorsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

    securityService = inject(SecurityService);
    router = inject(Router);
    errors: string[] = [];

    login(credentials: UserCredentialsDTO){
        this.securityService.login(credentials).subscribe({
          next: ()=> {
            this.router.navigate(['/']);
          },
          error: (err) => {            
              const errors = extractErrors(err);
              console.log('Errors:', this.errors);
              this.errors = errors;
          }
        });
      }
}
