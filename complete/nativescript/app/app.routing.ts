import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ListComponent } from "./components/list/list.component";
import { SaveComponent } from "./components/save/save.component";

const routes: Routes = [
    { path: "", component: ListComponent },
    { path: "create", component: SaveComponent },
    { path: "update/:id", component: SaveComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }