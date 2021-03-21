import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropInProgressComponent } from './drop-in-progress.component';

describe('DropInProgressComponent', () => {
  let component: DropInProgressComponent;
  let fixture: ComponentFixture<DropInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropInProgressComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
