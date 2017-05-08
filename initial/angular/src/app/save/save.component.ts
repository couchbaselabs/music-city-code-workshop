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
        // STEP 05: Populating the Form with API Data
    }

    public save() {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        if(!this.movie.id) {
            // STEP 06: Creating a New Document in the Database
        } else {
            this.http.put("http://localhost:3000/movies/" + this.movie.id, JSON.stringify(this.movie), options)
                .subscribe(result => {
                    this.location.back();
                });
        }
    }

}
