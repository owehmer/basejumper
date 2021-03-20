import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { appDate, TimeGranularity } from '../../helper/date/app-date';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownComponent implements OnChanges, OnDestroy {
  @Input()
  set destinationTime(val: Date) {
    this._destinationTime = val;
  }

  secondsToDeadline!: number;

  private _destinationTime!: Date;
  private _timeInterval$$: Subscription | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    this.resetTimeOnDestinationChange(changes.destinationTime);
  }

  ngOnDestroy(): void {
    if (this._timeInterval$$ !== undefined) {
      this._timeInterval$$.unsubscribe();
    }
  }

  private resetTimeOnDestinationChange(destinationTime: SimpleChange): void {
    if (this._timeInterval$$ !== undefined) {
      this._timeInterval$$.unsubscribe();
    }

    if (destinationTime === undefined) {
      return;
    }

    this._timeInterval$$ = interval(200).subscribe(() => {
      const now = appDate.getNow();

      if (now >= this._destinationTime) {
        this.secondsToDeadline = appDate.diffIn(now, this._destinationTime, TimeGranularity.second);
      } else {
        this.secondsToDeadline = 0;
      }
    });
  }
}
