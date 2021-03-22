import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Basejumper } from '../contracts/jumper';

@Component({
  selector: 'app-jumper',
  templateUrl: './jumper.component.html',
  styleUrls: ['./jumper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JumperComponent implements AfterViewInit, OnDestroy {
  @Input()
  jumper!: Basejumper;

  @ViewChild('body')
  private _bodyRef!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.jumper.attachElement(this._bodyRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.jumper.detachElement();
  }
}
