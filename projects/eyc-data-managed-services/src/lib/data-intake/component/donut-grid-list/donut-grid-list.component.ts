import { Component, OnInit,ElementRef,Renderer2, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { DataManagedService } from '../../services/data-managed.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'lib-donut-grid-list',
  templateUrl: './donut-grid-list.component.html',
  styleUrls: ['./donut-grid-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonutGridListComponent implements OnInit {
  curDate;
  presentDate;
  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;
  constructor(private dataManagedService: DataManagedService,private elementRef: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMM. dd, yyyy', 'en');
    this.presentDate = new Date();
  }
  dateSub(presentDate) {
    let curDateVal = presentDate;
    curDateVal.setMonth(curDateVal.getMonth() - 1);
    this.curDate = formatDate(curDateVal, 'MMM. dd, yyyy', 'en');
  }
  
  dateAdd(presentDate) {
    let curDateVal = presentDate;
    curDateVal.setMonth(curDateVal.getMonth() + 1);
    this.curDate = formatDate(curDateVal, 'MMM. dd, yyyy', 'en');
  }

  dailyData(){
    this.renderer.setAttribute(this.dailyfilter.nativeElement,  'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement,  'color', 'secondary')
  }
  monthyData(){
    this.renderer.setAttribute(this.monthlyfilter.nativeElement,  'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement,  'color', 'secondary');
  } 
}
