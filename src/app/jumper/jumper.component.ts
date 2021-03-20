import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Basejumper } from '../contracts/jumper';

@Component({
  selector: 'app-jumper',
  templateUrl: './jumper.component.html',
  styleUrls: ['./jumper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JumperComponent {
  @Input()
  jumper!: Basejumper;
}
