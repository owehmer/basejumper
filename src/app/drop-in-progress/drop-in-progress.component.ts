import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Drop } from '../contracts/drop';
import { Basejumper } from '../contracts/jumper';
import { JumperComponent } from '../jumper/jumper.component';
import { interval, Subscription } from 'rxjs';
import { randomIntFromInterval } from '../helper/math';

interface Coordinates {
  xPos: number;
  yPos: number;
}

interface GameFieldSize {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

@Component({
  selector: 'app-drop-in-progress',
  templateUrl: './drop-in-progress.component.html',
  styleUrls: ['./drop-in-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropInProgressComponent implements AfterViewInit, OnDestroy {
  @Input()
  drop!: Drop;

  @Input()
  jumpers!: Basejumper[];

  @ViewChildren(JumperComponent)
  private _jumperComponents!: QueryList<JumperComponent>;

  @ViewChild('goal')
  private _goal!: ElementRef<HTMLElement>;

  private _positionMapping: Record<number, Coordinates> = {};

  private _gameField: GameFieldSize | undefined;
  private _positionUpdate$$: Subscription | undefined;

  constructor(
    private _elemRef: ElementRef<HTMLElement>,
    private _cd: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    this._gameField = {
      left: this._elemRef.nativeElement.offsetLeft,
      right: this._elemRef.nativeElement.offsetWidth,
      top: this._elemRef.nativeElement.offsetTop,
      bottom: this._elemRef.nativeElement.offsetHeight
    };

    for (const jumper of this.jumpers) {
      const id = jumper.id;
      this._positionMapping[id] = {
        yPos: this._gameField.top,
        xPos: randomIntFromInterval(this._gameField.left, this._gameField.right - jumper.width)
      };
    }
    this._cd.detectChanges();

    this._positionUpdate$$ = interval(60).subscribe(() => {
      this.updateJumperPositions();
      this._cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this._positionUpdate$$ !== undefined) {
      this._positionUpdate$$.unsubscribe();
    }
  }

  trackById(index: number, item: Basejumper): number {
    return item.id;
  }

  getJumperXCoord(jumperId: number): number {
    return this._positionMapping[jumperId]?.xPos || 0;
  }

  getJumperYCoord(jumperId: number): number {
    return this._positionMapping[jumperId]?.yPos || 0;
  }

  updateJumperPositions(): void {
    if (this._gameField === undefined) {
      throw new Error('Cannot update jumpers position if no game field is available!');
    }

    const bottom = this._gameField.bottom;

    for (const jumper of this.jumpers) {
      const speed = jumper.dropSpeed;
      const currYPos = this.getJumperYCoord(jumper.id);

      if (currYPos < (bottom - jumper.height - 32)) {
        this._positionMapping[jumper.id].yPos = currYPos + speed;
      }
    }

    const gameInProgress = this.jumpers.map(j => this.getJumperYCoord(j.id)).some(yCoord => yCoord < bottom);

    if (!gameInProgress && this._positionUpdate$$ !== undefined) {
      this._positionUpdate$$.unsubscribe();
      alert('Game is finished!');
    }
  }

}
