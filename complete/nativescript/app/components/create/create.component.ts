import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/Rx";

@Component({
    selector: "create",
    moduleId: module.id,
    templateUrl: "create.component.html",
})
export class CreateComponent implements OnInit {

    public movie: any;

    public constructor(private http: Http, private location: Location) {
        this.movie = {
            "title": "",
            "genre": ""
        };
    }

    public ngOnInit() {}

    public save() {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        this.http.post("http://localhost:3000/movies", JSON.stringify(this.movie), options)
            .subscribe(result => {
                this.location.back();
            });
    }

}