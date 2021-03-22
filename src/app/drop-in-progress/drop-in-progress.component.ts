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
import { interval, Subject } from 'rxjs';
import { randomIntFromInterval } from '../helper/math';
import { takeUntil } from 'rxjs/operators';

interface Vector {
  xSpeed: number;
  ySpeed: number;
}

interface Coordinates {
  xPos: number;
  yPos: number;
  vector: Vector;
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

  private _gameIsRunning$ = new Subject<boolean>();

  constructor(
    private _elemRef: ElementRef<HTMLElement>,
    private _cd: ChangeDetectorRef
  ) {
    this._gameIsRunning$.next(false);
  }

  ngAfterViewInit(): void {
    this._gameField = {
      left: this._elemRef.nativeElement.offsetLeft,
      right: this._elemRef.nativeElement.offsetWidth - 100,
      top: this._elemRef.nativeElement.offsetTop,
      bottom: this._elemRef.nativeElement.offsetHeight
    };

    for (const jumper of this.jumpers) {
      const id = jumper.id;
      this._positionMapping[id] = {
        yPos: this._gameField.top,
        xPos: randomIntFromInterval(this._gameField.left, this._gameField.right - jumper.width),
        vector: {
          ySpeed: jumper.weight,
          xSpeed: randomIntFromInterval(-5, 5)
        }
      };
    }
    this._gameIsRunning$.next(true);
    this._cd.detectChanges();

    interval(60).pipe(
      takeUntil(this._gameIsRunning$)
    ).subscribe(() => {
      this.updateJumperPositions();
      this._cd.detectChanges();
    });

    interval(1000).pipe(
      takeUntil(this._gameIsRunning$)
    ).subscribe(() => {
      const gf = this._gameField;
      if (gf === undefined) {
        return;
      }

      const gameInProgress = this.jumpers
        .map(j => ({ jumper: j, yCoord: this.getJumperYCoord(j.id) }))
        .some(({ jumper, yCoord }) => yCoord < (gf.bottom - jumper.height - 32));

      if (!gameInProgress) {
        this._gameIsRunning$.next(false);
        alert('Game is finished!');
      }
    });
  }

  ngOnDestroy(): void {
    this._gameIsRunning$.next(false);
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

  getJumperVector(jumperId: number): Vector {
    if (this._positionMapping === undefined) {
      throw new Error('Mapping hasnt been initialized yet!');
    }
    return this._positionMapping[jumperId].vector;
  }

  setJumperVectorXSpeed(jumperId: number, newSpeed: number): void {
    if (this._positionMapping === undefined) {
      return;
    }
    this._positionMapping[jumperId].vector.xSpeed = newSpeed;
  }

  updateJumperPositions(): void {
    if (this._gameField === undefined) {
      throw new Error('Cannot update jumpers position if no game field is available!');
    }

    const { bottom, left, right } = this._gameField;

    for (const jumper of this.jumpers) {
      const vector = this.getJumperVector(jumper.id);
      const { ySpeed } = vector;
      let { xSpeed } = vector;

      let currYPos = this.getJumperYCoord(jumper.id);

      if (currYPos < (bottom - jumper.height - 32)) {
        currYPos = currYPos + ySpeed;
      } else {
        currYPos = bottom - jumper.height - 32;
      }
      this._positionMapping[jumper.id].yPos = currYPos;

      if (currYPos === (bottom - jumper.height - 32)) {
        continue;
      }

      // check left wall
      const currXPos = this.getJumperXCoord(jumper.id);
      const newXPos = currXPos + xSpeed;

      // Wall bounce
      if (newXPos < left || newXPos > right) {
        xSpeed = xSpeed * -1;
        this.setJumperVectorXSpeed(jumper.id, xSpeed);
      }
      this._positionMapping[jumper.id].xPos = currXPos + xSpeed;
    }
  }

}
