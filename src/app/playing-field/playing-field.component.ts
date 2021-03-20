import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Drop } from '../contracts/drop';
import { Basejumper } from '../contracts/jumper';
import { appDate } from '../helper/date/app-date';

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

  get registrationDueTime(): Date | undefined {
    return this?._currentDrop?.registrationDueTime;
  }

  private _currentDrop: Drop | null = null;

  startDrop(): void {
    if (this._currentDrop !== null) {
      alert('A drop already started!');
    }

    this._currentDrop = new Drop(200, 200, appDate.add(appDate.getNow(), { minutes: 1 }));
  }

  addJumper(): void {
    this._currentDrop?.addJumper(new Basejumper('Tharos', 10, 10, 'red'));
  }
}
