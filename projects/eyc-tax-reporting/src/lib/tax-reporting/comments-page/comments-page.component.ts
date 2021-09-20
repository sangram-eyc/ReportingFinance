import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'comments-page',
  templateUrl: './comments-page.component.html',
  styleUrls: ['./comments-page.component.scss']
})

export class CommentsPagecomponent implements OnInit {

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
  ) {}

  pageName:string = 'Comments-Page';
  fundName; 
  productCycleId;
  productCycleName;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.fundName = params.name
      this.productCycleId = params.id
      this.productCycleName = params.prodCycleName
    });
  }

  backtoCycleView(){
    this.location.back();
  }
}
