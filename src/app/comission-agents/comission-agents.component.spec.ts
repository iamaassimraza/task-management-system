import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComissionAgentsComponent } from './comission-agents.component';

describe('ComissionAgentsComponent', () => {
  let component: ComissionAgentsComponent;
  let fixture: ComponentFixture<ComissionAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComissionAgentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComissionAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
