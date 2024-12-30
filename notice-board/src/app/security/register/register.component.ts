import { Component, inject } from '@angular/core';
import { SecurityService } from '../security.service';
import { Router } from '@angular/router';
import { UserCredentialsDTO } from '../security.models';
import { AuthenticationFormComponent } from "../authentication-form/authentication-form.component";
import { DisplayErrorsComponent } from "../../Shared/component/display-errors/display-errors.component";
import { extractErrors } from '../../Shared/Functions/extractErrors';

@Component({
  selector: 'app-register',
  imports: [AuthenticationFormComponent, DisplayErrorsComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  securityService = inject(SecurityService);
  router = inject(Router);
  errors: string[] = [];

  register(credentials: UserCredentialsDTO){
    this.securityService.register(credentials).subscribe({
      next: ()=> {
        this.router.navigate(['/']);
      },
      error: err =>{
        console.log(err);
        const errors = extractErrors(err);
        this.errors = errors;
      }
    });
  }

}
