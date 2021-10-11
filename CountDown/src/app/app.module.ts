import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { CountDownComponent } from './countdown.component';

@NgModule({
  declarations: [
    CountDownComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [CountDownComponent]
})
export class AppModule { }
