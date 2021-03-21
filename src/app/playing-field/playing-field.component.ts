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
    return this.currentDrop !== null;
  }

  get dropAllowsRegistrations(): boolean {
    return this.currentDrop?.isRegistrationOpen ?? false;
  }

  get dropParticipants(): Basejumper[] | undefined {
    return this?.currentDrop?.participants;
  }

  get registrationDueTime(): Date | undefined {
    return this?.currentDrop?.registrationDueTime;
  }

  get gameIsInProgress(): boolean {
    return this.currentDrop !== null && this.currentDrop.registrationDueTime < appDate.getNow();
  }

  currentDrop: Drop | null = null;

  startDrop(): void {
    if (this.currentDrop !== null) {
      alert('A drop already started!');
      return;
    }

    this.currentDrop = new Drop(200, 200, appDate.add(appDate.getNow(), { seconds: 5 }));
  }

  addJumper(): void {
    this.currentDrop?.addJumper(new Basejumper('Tharos', 10, 10, 'red'));
  }
}
