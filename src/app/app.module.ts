import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PlayingFieldModule } from './playing-field/playing-field.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    PlayingFieldModule,
    RouterModule.forRoot([
      {
        path: '**',
        loadChildren: () => import('./playing-field/playing-field.module').then(m => m.PlayingFieldModule)
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
