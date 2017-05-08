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
        this.http.get("http://localhost:3000/movies")
            .map(result => result.json())
            .subscribe(result => {
                this.movies = result;
            });
    }

    public delete(id: string) {
        this.http.delete("http://localhost:3000/movies/" + id)
            .subscribe(result => {
                for(let i = 0; i < this.movies.length; i++) {
                    if(this.movies[i].id == id) {
                        this.movies.splice(i, 1);
                        break;
                    }
                }
            });
    }

    public create() {
        this.router.navigate(["/create"]);
    }

    public update(id: string) {
        this.router.navigate(["/update", id]);
    }

    public refresh(query?: any) {
        let url = "http://localhost:3000/movies";
        if(query && query.target.value) {
            url = "http://localhost:3000/search/?title=" + query.target.value;
        }
        this.http.get(url)
            .map(result => result.json())
            .subscribe(result => {
                this.movies = result;
            });
    }

}
