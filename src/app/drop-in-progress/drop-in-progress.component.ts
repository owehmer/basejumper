import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Drop } from '../contracts/drop';
import { Basejumper } from '../contracts/jumper';
import { JumperComponent } from '../jumper/jumper.component';
import { interval, Subject } from 'rxjs';
import { randomIntFromInterval } from '../helper/math';
import * as Matter from 'matter-js';
import { Render } from 'matter-js';
import { takeUntil } from 'rxjs/operators';

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
export class DropInProgressComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  drop!: Drop;

  @Input()
  jumpers!: Basejumper[];

  world: Matter.World | undefined;

  @ViewChildren(JumperComponent)
  private _jumperComponents!: QueryList<JumperComponent>;

  @ViewChild('goal')
  private _goal!: ElementRef<HTMLElement>;

  private _gameField: GameFieldSize | undefined;
  private readonly _gameIsRunning$ = new Subject<boolean>();

  private _engine: Matter.Engine | undefined;

  constructor(
    private _elemRef: ElementRef<HTMLElement>,
    private _cd: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this._gameIsRunning$.next(false);
  }

  ngAfterViewInit(): void {
    this._gameField = {
      left: this._elemRef.nativeElement.offsetLeft,
      right: this._elemRef.nativeElement.offsetWidth,
      top: this._elemRef.nativeElement.offsetTop,
      bottom: this._elemRef.nativeElement.offsetHeight
    };
    this._initMatterJs({ debugMode: false });

    for (const jumper of this.jumpers) {
      if (!jumper.body) {
        continue;
      }

      const x = randomIntFromInterval(this._gameField.left, this._gameField.right);
      const y = randomIntFromInterval(this._gameField.top, this._gameField.top + 100);

      Matter.Body.setPosition(jumper.body, { x, y });
      Matter.Body.setAngularVelocity(jumper.body, 0.05);
      Matter.Body.applyForce(jumper.body,
        { x, y },
        {
          x: randomIntFromInterval(-400, 400) / 100,
          y: randomIntFromInterval(1, 10) / 100
        }
      );
    }

    this._gameIsRunning$.next(true);

    interval(60).pipe(
      takeUntil(this._gameIsRunning$)
    ).subscribe(() => {
      if (this._engine !== undefined) {
        Matter.Engine.update(this._engine);
        this._cd.detectChanges();
      }
    });

    this._cd.detectChanges();
  }

  ngOnDestroy(): void {
    this._gameIsRunning$.next(false);
    Matter.Events.off(this._engine, 'collisionStart', null as any);
  }

  trackById(index: number, item: Basejumper): number {
    return item.id;
  }

  private _initBoundaries(world: Matter.World): { boundaryLeft: Matter.Body; boundaryRight: Matter.Body; boundaryBottom: Matter.Body } {
    if (this._gameField === undefined) {
      throw new Error('Initialize game field first!');
    }

    const boundaryLeft = Matter.Bodies.rectangle(this._gameField.left, this._gameField.bottom / 2, 10, this._gameField.bottom, { restitution: 0.2 });
    const boundaryRight = Matter.Bodies.rectangle(this._gameField.right, this._gameField.bottom / 2, 10, this._gameField.bottom, { restitution: 1 });
    const boundaryBottom = Matter.Bodies.rectangle(this._gameField.right / 2, this._gameField.bottom - 30, this._gameField.right, 10, { restitution: 0.99 });

    Matter.Body.setStatic(boundaryLeft, true);
    Matter.Body.setStatic(boundaryRight, true);
    Matter.Body.setStatic(boundaryBottom, true);
    // TODO: Top Boundary or more gravity

    Matter.World.add(world, boundaryLeft);
    Matter.World.add(world, boundaryRight);
    Matter.World.add(world, boundaryBottom);
    return { boundaryLeft, boundaryRight, boundaryBottom };
  }

  private _initMatterJs({ debugMode = false }: { debugMode: boolean }): void {
    if (this._gameField === undefined) {
      throw new Error('Initialize game field first!');
    }

    const engine = Matter.Engine.create();
    const world = engine.world;
    this._engine = engine;
    this.world = world;

    world.gravity = {
      x: 0,
      y: 1,
      scale: 0.00001
    };

    if (debugMode) {
      const render = Render.create({
        element: this._elemRef.nativeElement,
        engine: engine,
        options: {
          width: this._gameField.right,
          height: this._gameField.bottom,
          showVelocity: true,
          showAngleIndicator: true
        } as any
      });

      Render.run(render);
    }

    const { boundaryLeft, boundaryRight, boundaryBottom } = this._initBoundaries(world);

    this._initBoundaryCollisionPhysics(engine, boundaryRight, boundaryLeft, boundaryBottom);

    this._cd.detectChanges();
  }

  private _initBoundaryCollisionPhysics(engine: Matter.Engine, boundaryRight: Matter.Body, boundaryLeft: Matter.Body, boundaryBottom: Matter.Body): void {
    const boundaries = [boundaryRight, boundaryLeft];

    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;

      // Left and right boundary
      for (const pair of pairs.filter(p => boundaries.includes(p.bodyA) || boundaries.includes(p.bodyB))) {
        const box = boundaries.includes(pair.bodyA) ? pair.bodyB : pair.bodyA;
        Matter.Body.setVelocity(box, {
          x: box.velocity.x * -1,
          y: box.velocity.y
        });
      }

      // Bottom
      for (const pair of pairs.filter(p => p.bodyA === boundaryBottom || p.bodyB === boundaryBottom)) {
        const box = pair.bodyA === boundaryBottom ? pair.bodyB : pair.bodyA;
        Matter.Body.setVelocity(box, { x: 0, y: 0 });
        Matter.Body.setStatic(box, true);
        box.collisionFilter = {
          group: -1,
          category: 2,
          mask: 0
        };

        const jumpersStillFalling = this.jumpers.some(j => j.body === undefined || !j.body.isStatic);
        if (!jumpersStillFalling) {
          this._gameIsRunning$.next(false);
          Matter.Events.off(this._engine, 'collisionStart', null as any);
        }
      }
    });
  }
}
