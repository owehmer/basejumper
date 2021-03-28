import { Component, HostBinding, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Basejumper } from '../contracts/jumper';
import * as Matter from 'matter-js';

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
    const position = this.jumper.body?.position;
    if (position === undefined) {
      return undefined;
    }
    return position.x - (this.jumper.width * 2); // TODO: Get the correct positions via something like Vector.sub(body.bounds.min, body.position).x;
  }

  @HostBinding('style.top.px')
  get topY(): number | undefined {
    const position = this.jumper.body?.position;
    if (position === undefined) {
      return undefined;
    }
    return position.y - (this.jumper.height * 2);
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
