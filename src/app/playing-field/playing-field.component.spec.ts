import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayingFieldComponent } from './playing-field.component';

describe('PlayingFieldComponent', () => {
  let component: PlayingFieldComponent;
  let fixture: ComponentFixture<PlayingFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayingFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayingFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
