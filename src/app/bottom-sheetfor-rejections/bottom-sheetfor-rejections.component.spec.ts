import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheetforRejectionsComponent } from './bottom-sheetfor-rejections.component';

describe('BottomSheetforRejectionsComponent', () => {
  let component: BottomSheetforRejectionsComponent;
  let fixture: ComponentFixture<BottomSheetforRejectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomSheetforRejectionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomSheetforRejectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
