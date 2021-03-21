import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropInProgressComponent } from './drop-in-progress.component';
import { JumperModule } from '../jumper/jumper.module';


@NgModule({
  declarations: [DropInProgressComponent],
  exports: [
    DropInProgressComponent
  ],
  imports: [
    CommonModule,
    JumperModule
  ]
})
export class DropInProgressModule {
}
