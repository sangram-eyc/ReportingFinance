import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'comments-details',
  templateUrl: './comments-details.component.html',
  styleUrls: ['./comments-details.component.scss']
})
export class CommentsDetailsComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) { }
  productCycleId;
  productCycleName;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.productCycleId = params.cycleId
      this.productCycleName = params.cycleName
    });
  }

  backtoCycleView() {
    this.router.navigate(['cycle-details',this.productCycleId,this.productCycleName]);
  }

}
