import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { Http } from "@angular/http";
import { Router } from "@angular/router";
import "rxjs/Rx";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    public movies: any;

    public constructor(private http: Http, private router: Router, private location: Location) {
        this.movies = [];
    }

    public ngOnInit() {
        this.location.subscribe(() => {
            this.query();
        });
        this.query();
    }

    public query() {
        // STEP 01: Requesting Data from the RESTful API
    }

    public delete(id: string) {
        // STEP 02: Removing Data from the RESTful API
    }

    public create() {
        this.router.navigate(["/create"]);
    }

    public update(id: string) {
        this.router.navigate(["/update", id]);
    }

    public refresh(query?: any) {
        // STEP 03: Searching for Data in the RESTful API
    }

}
