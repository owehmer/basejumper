import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JumperComponent } from './jumper.component';
import { Basejumper } from '../contracts/jumper';

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
    component.jumper = new Basejumper('test', 1, 1, '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
