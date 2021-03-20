import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JumperComponent } from './jumper.component';



@NgModule({
  declarations: [JumperComponent],
  exports: [
    JumperComponent
  ],
  imports: [
    CommonModule
  ]
})
export class JumperModule { }
