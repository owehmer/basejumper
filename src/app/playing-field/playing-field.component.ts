import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Drop } from '../contracts/drop';
import { Basejumper } from '../contracts/jumper';

@Component({
  selector: 'app-playing-field',
  templateUrl: './playing-field.component.html',
  styleUrls: ['./playing-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayingFieldComponent {
  get dropExists(): boolean {
    return this._currentDrop !== null;
  }

  get dropAllowsRegistrations(): boolean {
    return this._currentDrop?.isRegistrationOpen ?? false;
  }

  get dropParticipants(): Basejumper[] | undefined {
    return this?._currentDrop?.participants;
  }

  private _currentDrop: Drop | null = null;

  startDrop(): void {
    if (this._currentDrop !== null) {
      alert('A drop already started!');
    }

    const time = new Date();
    const seconds = time.getSeconds();
    if (seconds < 55) {
      time.setSeconds(seconds + 5);
    } else {
      const minutes = time.getMinutes();
      time.setMinutes(minutes + 1);
      time.setSeconds(0);
    }

    this._currentDrop = new Drop(200, 200, time);
  }

  addJumper(): void {
    this._currentDrop?.addJumper(new Basejumper('Tharos', 10, 10, 'red'));
  }
}
