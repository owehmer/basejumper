import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropInProgressComponent } from './drop-in-progress.component';
import { Drop } from '../contracts/drop';

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
    component.drop = new Drop(0, 0, new Date());
    component.jumpers = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
