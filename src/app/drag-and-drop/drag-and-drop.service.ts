import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DragAndDropService {

    constructor(private http: HttpClient) { }

    public httpOptions = {
        headers: new HttpHeaders(
            {
                'Authorization': 'test-task'
            }
        )
    };

    uploadFile(arr: any[]): Observable<any> {

        let body = {
            resultArray: arr,
        }

        return this.http
            .post('http://193.243.158.230:4500/api/import', body, this.httpOptions);
    }
}
