import { Component } from '@angular/core';
import { NoticesSearchComponent } from "../notices/notices-search/notices-search.component";

@Component({
  selector: 'app-landing-page',
  imports: [ NoticesSearchComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
