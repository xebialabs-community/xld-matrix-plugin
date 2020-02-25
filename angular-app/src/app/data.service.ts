import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private API_ROOT:String = '/api/extension/matrix';

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  /*
  * Load Applications
  */
  loadApps(): Observable<Object> {
    return this.http.get<XldResponse>(this.API_ROOT + '/applications', this.httpOptions)
            .pipe(map((data:XldResponse) => data.entity))
  }

  /*
  * Load DeployedApp for a specific app
  */
  loadDeployedApp(appName: String): Observable<Object>{
    return this.http.get<XldResponse>(this.API_ROOT + '/deployedApplications?namePattern=' + appName, this.httpOptions)
            .pipe(map((data:XldResponse) => data.entity))
  }

  /*
  * Load configuration
  */
  loadConfiguration(): Observable<Object>{
    return this.http.get<XldResponse>(this.API_ROOT + '/configuration',this.httpOptions)
            .pipe(map((data:XldResponse) => data.entity))
  }

  /*
  * Load ApplicationSet
  */
  loadAppSets(): Observable<Object>{
    return this.http.get<XldResponse>(this.API_ROOT + '/applicationSets', this.httpOptions)
            .pipe(map((data: XldResponse) => data.entity))
  }

  /*
  * Load a specific applicationSet
  */
  loadAppSet(path: String): Observable<Object>{
    return this.http.get(this.API_ROOT + '/applicationSet?path=' + path, this.httpOptions)
            .pipe(map((data:XldResponse) => data.entity))
  }

  /*
  * Create an applicationSet
  */
  createApplicationSet(name:String, apps:Array<String>){
    let body = {
      name: name,
      apps: apps
    }
    return this.http.post(this.API_ROOT + '/createApplicationSet', body, this.httpOptions)
            .pipe(map((data:XldResponse) => data.entity))
  }

}

interface XldResponse {
  entity: Array<Object>
  stdout: String
  stderr: String
  exception: String
}