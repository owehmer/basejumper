import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JumperComponent } from './jumper.component';

describe('JumperComponent', () => {
  let component: JumperComponent;
  let fixture: ComponentFixture<JumperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JumperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JumperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
