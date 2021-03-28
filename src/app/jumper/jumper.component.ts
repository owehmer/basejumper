import { Component, HostBinding, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Basejumper } from '../contracts/jumper';
import * as Matter from 'matter-js';
import { Vector } from 'matter-js';

@Component({
  selector: 'app-jumper',
  templateUrl: './jumper.component.html',
  styleUrls: ['./jumper.component.scss']
  // No OnPush because of the rotation
})
export class JumperComponent implements OnDestroy, OnChanges {
  @Input()
  jumper!: Basejumper;

  @Input()
  world: Matter.World | undefined;

  @HostBinding('style.left.px')
  get topX(): number | undefined {
    const body = this.jumper.body;
    if (body === undefined) {
      return undefined;
    }
    const a = Vector.sub(body.bounds.min, body.position);
    console.warn('VEC', a);
    return body.bounds.min.x; //- (a.x);
  }

  @HostBinding('style.top.px')
  get topY(): number | undefined {
    const body = this.jumper.body;
    if (body === undefined) {
      return undefined;
    }
    return body.bounds.min.y;
  }

  @HostBinding('style.width.px')
  get width(): number | undefined {
    const body = this.jumper.body;
    if (body === undefined) {
      return undefined;
    }
    const x = Vector.sub(body.bounds.min, body.bounds.max).x;
    return Math.abs(x);
  }

  @HostBinding('style.height.px')
  get height(): number | undefined {
    const body = this.jumper.body;
    if (body === undefined) {
      return undefined;
    }
    const y = Vector.sub(body.bounds.min, body.bounds.max).y;
    return Math.abs(y);
  }

  rotation(): string {
    let deg = 0;
    if (this.jumper.body !== undefined) {
      deg = this.jumper.body.angle * 180 / Math.PI;
    }
    return `rotate(${deg}deg)`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.world !== undefined) {
      try {
        this.jumper.detachMatterBody();
      } catch (e) {
      }
      if (this.world !== undefined) {
        this.jumper.attachMatterBody(this.world);
      }
    }
  }

  ngOnDestroy(): void {
    try {
      this.jumper.detachMatterBody();
    } catch (e) {
    }
  }
}
