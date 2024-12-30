import { Injectable } from '@angular/core';
import { CategoryDTO } from '../notices/models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: CategoryDTO[] = [
    { id: 1, name: 'Buy' },
    { id: 2, name: 'Sale' },
    { id: 3, name: 'Free' },
    { id: 4, name: 'Service' }
  ];

  getCategories(): CategoryDTO[] {
    return this.categories;
  }

  getCategoryById(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  }
}
