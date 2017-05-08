import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";

import { ListComponent } from "./list/list.component";
import { SaveComponent } from "./save/save.component";

const routes: Routes = [
    { path: "", component: ListComponent },
    { path: "create", component: SaveComponent },
    { path: "update/:id", component: SaveComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }