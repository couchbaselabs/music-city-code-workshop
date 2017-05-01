import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { Router } from "@angular/router";
import "rxjs/Rx";

@Component({
    selector: "list",
    moduleId: module.id,
    templateUrl: "list.component.html",
})
export class ListComponent implements OnInit {

    public movies: any;

    public constructor(private http: Http, private router: Router) {
        this.movies = [];
    }

    public ngOnInit() {
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

}