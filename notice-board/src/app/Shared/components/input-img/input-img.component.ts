import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { toBase64 } from '../../Functions/toBase64';
import { OutletContext } from '@angular/router';

@Component({
  selector: 'app-input-img',
  imports: [MatButtonModule],
  templateUrl: './input-img.component.html',
  styleUrl: './input-img.component.css'
})
export class InputImgComponent {

  @Input({required: true})
  title!: string;

  @Input()
  imageURL?: string;

  @Output()
  selectedImageFile = new EventEmitter<File>();
  

  imageBase64?: string;

  change(event: Event){
      const input = event.target as HTMLInputElement;

      if (input.files && input.files.length > 0){
        const file: File = input.files[0];
        toBase64(file).then((value: string) => this.imageBase64 = value)
        .catch ( (error) => console.log(error));
        
        this.selectedImageFile.emit(file);
        this.imageURL = undefined;
      }
  }
}
