import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLength'
})
export class MaxLengthPipe implements PipeTransform {

  transform(value: string, limit: number = 30): string {
    if (!value) return '';  // If the value is empty, return an empty string

    // If the string length is less than or equal to the limit, return the original string
    if (value.length <= limit) {
      return value;
    }

    // Truncate at the limit, but avoid cutting in the middle of a word
    let truncated = value.substring(0, limit);

    // Find the last space character within the limit range
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    // If a space exists, truncate at the space, otherwise truncate at the original limit
    if (lastSpaceIndex !== -1) {
      truncated = truncated.substring(0, lastSpaceIndex);
    }

    return truncated + '...';  // Add ellipsis at the end
  }

}
