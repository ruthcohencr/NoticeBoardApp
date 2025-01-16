import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AuthorizedComponent } from "../../../security/authorized/authorized.component";
import { SecurityService } from '../../../security/security.service';
import { LowerCasePipe } from '@angular/common';
import { ClaimTypes } from '../../../security/security.models';

@Component({
  selector: 'app-menu',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, RouterLink, AuthorizedComponent, LowerCasePipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  userId = ClaimTypes.userId; // email
  securityService = inject(SecurityService);
}
