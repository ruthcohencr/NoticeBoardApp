import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesSearchComponent } from './notices-search.component';

describe('NoticesSearchComponent', () => {
  let component: NoticesSearchComponent;
  let fixture: ComponentFixture<NoticesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticesSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
