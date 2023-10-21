import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooternavComponent } from './footernav.component';

describe('FooternavComponent', () => {
  let component: FooternavComponent;
  let fixture: ComponentFixture<FooternavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooternavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooternavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
