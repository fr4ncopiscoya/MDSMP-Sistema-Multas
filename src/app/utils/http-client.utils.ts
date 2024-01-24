import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class HttpClientUtils{
    urlApi: string = environment.apiBackEndURL;
    urlPide : string = environment.apiUtilitarios;
    urlApiMaster: string = environment.apiMaster;

    constructor(private httpClient: HttpClient, private router: Router){}

    getQuery(query: string){
        const url = `${this.urlApi + query}`;
        return this.httpClient.get(url);
    }

    postQuery(query: string, params: any){
        const url = `${this.urlApi + query}`;
        return this.httpClient.post(url, params);
    }

    postQueryMaster(query: string, params: any){
        const url = `${this.urlApiMaster + query}`;
        return this.httpClient.post(url, params);
    }

    postQueryPide(query: string, params: any){
        const url = `${this.urlPide + query}`;
        return this.httpClient.post(url, params);
    }
}