import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { appDate, TimeGranularity } from '../../helper/date/app-date';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownComponent implements OnChanges, OnDestroy {
  @Input()
  set destinationTime(val: Date | undefined) {
    this._destinationTime = val;
  }

  secondsToDeadline$: Observable<number | undefined> | undefined;

  private _destinationTime: Date | undefined;
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

    this.secondsToDeadline$ = interval(200).pipe(
      map(() => {
          const now = appDate.getNow();

          if (this._destinationTime !== undefined && now < this._destinationTime) {
            return Math.abs(appDate.diffIn(now, this._destinationTime, TimeGranularity.second));
          }
          return undefined;
        }
      ),
      startWith(undefined)
    );
  }
}
