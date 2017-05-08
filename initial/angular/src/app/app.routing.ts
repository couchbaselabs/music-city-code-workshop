import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";

import { ListComponent } from "./list/list.component";
import { SaveComponent } from "./save/save.component";

// STEP 08: Configuring the Angular Router
const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }