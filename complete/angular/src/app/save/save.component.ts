import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/Rx";

@Component({
    selector: 'app-save',
    templateUrl: './save.component.html',
    styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {

    public movie: any;

    public constructor(private http: Http, private location: Location, private route: ActivatedRoute) {
        this.movie = {
            "title": "",
            "genre": ""
        };
    }

    public ngOnInit() {
        this.route.params.subscribe(params => {
            this.http.get("http://localhost:3000/movies/" + params["id"])
                .map(result => result.json())
                .subscribe(result => {
                    if(result && result.length > 0) {
                        this.movie = result[0];
                    }
                });
        });
    }

    public save() {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        if(!this.movie.id) {
            this.http.post("http://localhost:3000/movies", JSON.stringify(this.movie), options)
                .subscribe(result => {
                    this.location.back();
                });
        } else {
            this.http.put("http://localhost:3000/movies/" + this.movie.id, JSON.stringify(this.movie), options)
                .subscribe(result => {
                    this.location.back();
                });
        }
    }

}
