import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Basejumper } from '../contracts/jumper';

@Component({
  selector: 'app-jumper',
  templateUrl: './jumper.component.html',
  styleUrls: ['./jumper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JumperComponent implements OnInit, OnDestroy {
  @Input()
  jumper!: Basejumper;

  constructor(private _elemRef: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
    this.jumper.attachElement(this._elemRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.jumper.detachElement();
  }
}
