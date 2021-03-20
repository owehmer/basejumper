import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from './countdown.component';


@NgModule({
  declarations: [CountdownComponent],
  exports: [
    CountdownComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CountdownModule {
}
