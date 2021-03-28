import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Drop } from '../contracts/drop';
import { Basejumper } from '../contracts/jumper';
import { appDate } from '../helper/date/app-date';
import { randomIntFromInterval } from '../helper/math';

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
    const colors = [
      '#52308b',
      '#8e33af',
      '#e16e60',
      '#cea286',
      '#620b67',
      '#b87f44',
      '#03ccf9',
      '#4f1b02',
      '#df285f',
      '#498257',
      '#6f858c',
      '#639fd5',
      '#c31e0e',
      '#b56682',
      '#f0ae97',
      '#8560a2',
      '#f52682',
      '#189b0a',
      '#819b2a',
      '#3c941d',
      '#7cdf6e',
      '#33b240',
      '#696968',
      '#dede6a',
      '#a32f5c',
      '#4d87ce',
      '#56649c',
      '#29bb17',
      '#7579ab',
      '#ead35f'
    ];
    const names = [
      'Alister Wardle',
      'Asmaa Betts',
      'Abel Howarth',
      'Karim Taylor',
      'Evie Dawson',
      'Aqeel Good',
      'Ayomide Li',
      'Liana Mcbride',
      'Dana Daugherty',
      'Giuseppe Tyson',
      'Cayden Martins',
      'Kaif Huerta',
      'Eoghan Bouvet',
      'Rogan Bernal',
      'Lewys Coulson',
      'Bogdan Lowry',
      'Ayub Kirkpatrick',
      'Suleman Colley',
      'Carl Macdonald',
      'Helen Key'
    ];
    // const width = randomIntFromInterval(10, 50);
    // const height = randomIntFromInterval(10, 50);
    this.currentDrop?.addJumper(new Basejumper(
      names[randomIntFromInterval(0, names.length - 1)],
      25,
      25,
      colors[randomIntFromInterval(0, colors.length - 1)]
    ));
  }
}
