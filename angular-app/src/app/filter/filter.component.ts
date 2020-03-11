import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { SelectItem, MessageService } from 'primeng/api';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [MessageService]
})
export class FilterComponent implements OnInit, OnDestroy {

  @Output()
  selectedAppsEmitter = new EventEmitter<String[]>() // Selected Apps sent to parent

  selectedApps: String[] = []  // Selected Apps
  suggestions: String[] = [] // Suggestions to display

  applicationSets: SelectItem[] = []  // List of application sets
  selectedApplicationSet: String // Selected applicationSet

  appSubscription: Subscription
  appSetsSubscription: Subscription
  appSetSubscription: Subscription

  nameSet: String = ""
  
  constructor(private dataService: DataService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadAppSets()
  }

  ngOnDestroy(){
    if (this.appSubscription){
      this.appSubscription.unsubscribe()
    }
    if (this.appSetsSubscription){
      this.appSetsSubscription.unsubscribe()
    }
    if (this.appSetSubscription){
      this.appSetSubscription.unsubscribe()
    }
  }

  filterAppsMultiple(event: any): void {    
    this.appSubscription = this.dataService.loadApps().subscribe(
      (data: Array<String>) => {
        this.suggestions = data.filter(app => app.toLowerCase().includes(event.query.toLowerCase()))
      }
    )
  }

  generate(event: any) {
    let temp = this.selectedApps
    this.selectedApps = []
    this.selectedApps = temp
    this.selectedAppsEmitter.emit(this.selectedApps)
  }

  reset(event: any) {
    this.selectedApps = []
    this.selectedApplicationSet = ""
    this.nameSet = ""
    this.selectedAppsEmitter.emit([])
  }

  save(event: any) {
    if (this.nameSet.length > 0){
      this.dataService.createApplicationSet(this.nameSet, this.selectedApps)
        .subscribe(
          {
            next: (data:any) => { 
              this.messageService.add({severity:'success', summary: 'Successfully saved!'})
              this.loadAppSets() },
            error: (error:any) => { this.messageService.add({severity:'error', summary: 'Error while saving'}) },
            complete: () => { this.nameSet = "" }          
          } 
        )
    }
  }

  loadAppSets(){
    this.appSetsSubscription = this.dataService.loadAppSets()
      .subscribe({
        next:(data:Array<String>) => {
          data.map( (value:String) => this.applicationSets.push({value: value.toString(), label: value.toString() }))
        },
        error:(error:any) => {this.messageService.add({severity:'error', summary: 'Error', detail:"Can't load ApplicationSets" });}
      })
  }
  
  loadAppSet(event: any) {
    if (this.selectedApplicationSet.length>0) {
      this.selectedApps = []
      this.appSetSubscription = this.dataService.loadAppSet(this.selectedApplicationSet)
        .subscribe(
          (response: any) => {
            response.applications.map( (value:String) => this.selectedApps.push(value))
            this.selectedAppsEmitter.emit(this.selectedApps)
          }
        )

    }
  }

}

