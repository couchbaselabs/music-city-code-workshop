import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from "./app.routing";

import { AppComponent } from './app.component';
import { SaveComponent } from './save/save.component';
import { ListComponent } from './list/list.component';

@NgModule({
    declarations: [
        AppComponent,
        SaveComponent,
        ListComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }