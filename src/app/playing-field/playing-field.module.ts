import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayingFieldComponent } from './playing-field.component';
import { RouterModule } from '@angular/router';
import { JumperModule } from '../jumper/jumper.module';
import { CountdownModule } from './countdown/countdown.module';
import { DropInProgressModule } from '../drop-in-progress/drop-in-progress.module';

@NgModule({
  declarations: [PlayingFieldComponent],
  imports: [
    CommonModule,
    JumperModule,
    RouterModule.forChild([{
      path: '**',
      component: PlayingFieldComponent
    }]),
    CountdownModule,
    DropInProgressModule
  ]
})
export class PlayingFieldModule {
}
