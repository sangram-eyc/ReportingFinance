import { Component, OnInit, ViewChild } from '@angular/core';
import { FilingCardComponent } from '../../../../../../src/app/shared/filing-card/filing-card.component';
import { RegulatoryReportingFilingService } from '../services/regulatory-reporting-filing.service';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

@Component({
  selector: 'lib-regulatory-reporting-filing',
  templateUrl: './regulatory-reporting-filing.component.html',
  styleUrls: ['./regulatory-reporting-filing.component.scss']
})
export class RegulatoryReportingFilingComponent implements OnInit {

  @ViewChild('activeSlick', {static: false}) activeSlick: SlickCarouselComponent;

  constructor(
    private filingService: RegulatoryReportingFilingService
  ) { }

  activeFilings: any[] = [];
  activeLeftBtnDisabled = true;
  activeRightBtnDisabled = false;
  slideConfig = {
    slidesToShow: 4,
    arrows: false,
    dots: true,
    infinite: false,
    responsive: [
      {
        breakpoint: 1860,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      }, 
      {
        breakpoint: 1859,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }, {
        breakpoint: 1421,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }, {
        breakpoint: 1420,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }, {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }, {
        breakpoint: 999,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },{
        breakpoint: 0,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
    // responsive: [
    //   {
    //     breakpoint: 2100,
    //     settings: {
    //       slidesToShow: 4,
    //       slidesToScroll: 4
    //     }
    //   }, {
    //     breakpoint: 2099,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 3
    //     }
    //   }, {
    //     breakpoint: 1666,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 3
    //     }
    //   }, {
    //     breakpoint: 1665,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 2
    //     }
    //   }, {
    //     breakpoint: 1231,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 2
    //     }
    //   }, {
    //     breakpoint: 1230,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1
    //     }
    //   },{
    //     breakpoint: 0,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1
    //     }
    //   }
    // ]
  };

  ngOnInit(): void {
    this.getFilingsData();
    
  }

  afterChange(e) {
    console.log(e);
    if (e.currentSlide === 0) {
      this.activeLeftBtnDisabled = true;
    } else {
      this.activeLeftBtnDisabled = false;
    }
    const slides = e.slick.$slides;
    if (slides[slides.length - 1].classList.contains('slick-active')) {
      this.activeRightBtnDisabled = true;
    } else {
      this.activeRightBtnDisabled = false;
    }
  }

  activePrevSlide() {
    const currentSlide = this.activeSlick.slides[0].carousel.currentIndex;
    if (currentSlide > 0) {
      this.activeSlick.slickPrev();
    }
    console.log(this.activeSlick.slides[0]);
  } 

  activeNextSlide() {
    const currentSlide = this.activeSlick.slides[0].carousel.currentIndex;
    if (currentSlide > 0) {
      this.activeSlick.slickPrev();
    }
  }

  getFilingsData() {
    this.filingService.getFilings().subscribe(resp => {
      resp['data'].forEach((item) => {
        const eachitem: any  = {
          name: item.name + ' // ' + item.period,
          dueDate: item.dueDate,
          startDate: item.startDate,
          comments: item.comments,
          status: item.status
        };
        if (eachitem.startDate !== null) {
          this.activeFilings.push(eachitem);
        }
      });
      console.log(this.activeFilings);
      console.log(this.activeFilings.length);
    });

  }


}
