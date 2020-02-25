import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Application } from '../models/Application';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnDestroy {

  @Input()
  set selectedApps(apps :String[]){

    this.versions = []
    this.cols = []

    if (apps && apps.length>0){

      this.displayProgessBar = true
      
      let obs : Array<Observable<Object>> = []
      
      // Load configuration
      this.loadConfiguration()

      // Load deployedApp details
      for (let app of apps){
        let name = app.split('/')
        //console.log("Calling loadDeployedApp for " + name[name.length-1])
        obs.push(this.dataService.loadDeployedApp(name[name.length-1]))
      }
      
      this.appSubscription = forkJoin(obs).subscribe(
        (responseList => {

          //
          // responseList is an array containing the result of x calls to this.dataService.loadDeployedApp
          //

          //
          // headers is a temporary array used to build headers of the table (see variable 'cols')
          //
          var headers: String[] = []


          //
          // data is a temporary structure helping to build the final structure to display (see variable 'versions')
          // data contains one entry per app and for each app an array of deployed versions
          // data[x] = { appId: '/Applications/foo/myApp', versions:[ { env: '/Configuration/foo/MyCategory', version: '1.0' }, { env: '/Configuration/foo/MyCategory2', version: '2.0' } ]}
          //
          var data: any[]= []

          // Build the list of headers
          for (let listOfVersions of responseList){

            let temp:any = listOfVersions

            for (let item of temp){
            
              var envId:String = item["id"]
              var appId:String = envId.slice(envId.lastIndexOf('/')+1)
              var versionId:String = item["version"]
              versionId = versionId.slice(versionId.lastIndexOf('/')+1)
              var catId:String = item["category"]
              var displayWarning = false
              if (catId == "") {
                // The application is deployed to an environment that is not categorized
                // The deployed version will not be displayed
                // We set a warning for this app
                displayWarning = true
              }
              headers.push(catId) 

              // Check if appId already in data
              var foundAppId: any = {}
              for (let loop3 of data){
                //console.log("Checking " + loop3["appId"] + " with " + appId)
                if (loop3["appId"] == appId) {
                  foundAppId = loop3
                  break
                } 
              }

              //console.log("foundAppId:" + foundAppId)

              if (foundAppId.appId) {
                foundAppId.versions.push({"env": catId, "version": versionId})
              } else {
                let dataTemp = {
                  "appId": appId,
                  "versions" : [],
                  "warn": displayWarning
                }
                dataTemp.versions.push({"env": catId, "version": versionId})
                data.push(dataTemp)
                //console.log("Added a new row for " + appId)
              }

            }
          }

          // Set headers unique
          headers = [...new Set(headers)]
          // Add the first column
          this.cols = [{field:'app', header:'Applications'}]
          // Loop through configuration to get the order of the headers
          // let addUncategorized = false
          for (var c of this.configuration){
            if (headers.indexOf(c)>=0) {
              this.cols.push({ field: c, header: c.slice(c.lastIndexOf('/')+1)})
            } else {
              // Here the app is deployed to an environment that is not part of the configuration
              // Case ignored ()
            }
          }

          // set versions

          this.displayProgessBar = false
          this.versions = []
          for (let loop of data){
            let temp = {app: loop.appId, warn: loop.warn}
            for (let loop2 of loop.versions){
              let field = loop2.env
              let version = loop2.version
              temp[field] = version
            }
            this.versions.push(temp)
          }

          let now = new Date()
          this.lastUpdate = now.toDateString() + ' - ' + now.toLocaleTimeString()

        })
      )

    }
  } 

  cols: any[] = [] // columns to display
  versions: any[]= []  // data to display
  lastUpdate: String

  applications : Array<Application> = []
  deployedApplications : Array<Application> = []
  configuration:Array<String> = []

  // Subscriptions
  appSubscription: Subscription
  confSubscription: Subscription

  displayProgessBar: boolean = false

  constructor(private dataService: DataService) { }

  loadConfiguration(){
    this.confSubscription = this.dataService.loadConfiguration().subscribe(
      (result: any) => this.configuration = result
    )
  }

  ngOnDestroy(){
    if (this.confSubscription) {
      this.confSubscription.unsubscribe()
    }
    if (this.appSubscription) {
      this.appSubscription.unsubscribe()
    }
  } 

}