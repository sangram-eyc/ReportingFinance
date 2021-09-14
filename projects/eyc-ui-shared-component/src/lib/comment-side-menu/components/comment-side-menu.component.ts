import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { EycRrCommentApiService } from '../../services/eyc-rr-comment-api.service';
@Component({
  selector: 'lib-comment-side-menu',
  templateUrl: './comment-side-menu.component.html',
  styleUrls: ['./comment-side-menu.component.scss']
})


export class CommentSideMenuComponent implements OnInit, OnDestroy {

  appContainer;
  @Input() commentsData;
  @Input() filingName;
  @Input() show: boolean;
  @Input() entityId;

  @Output() showChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  // private _show: boolean;

  // @Input() set show(value: boolean) {
  //   this._show = value;
  //   this.viewComments(this._show);
  // }
 
  // get show(): boolean {
  //     return this._show;
  // }

  constructor(
    private commentService: EycRrCommentApiService
  ) {
    this.appContainer = document.getElementById('main-container');
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    console.log(this.entityId);
    if(this.entityId) {
      this.commentService.listComments(this.entityId).subscribe(resp => {
        this.commentsData = resp['data']
      });
    }
    if (changes.show) {
      this.viewComments();
    }
  }

  ngOnDestroy(): void {
    this.appContainer.style.paddingRight = '0';
  }

  viewComments() {
    if (this.show) {
      this.openComments();
    } else {
      this.closeComments();
    }
  }

  openComments() {
    console.log('Calling Open Comments');
    this.appContainer.style.paddingRight = '25%';
    console.log(this.appContainer);
    this.show = true;
    this.showChange.emit(this.show);
  }

  closeComments() {
    this.appContainer.style.paddingRight = '0';
    this.show = false;
    this.showChange.emit(this.show);
  }

  formatDate(timestamp) {
    const seconds = Math.floor((+new Date() - +new Date(timestamp)) / 1000);
    if (seconds < 29) {
      return 'Just now';
    } // less than 30 seconds ago will show as 'Just now'
    const intervals = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
    };
    let counter;
    for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      if (counter > 0) {
        if (counter === 1) {
            return counter + ' ' + i + ' ago'; // singular (1 day ago)
        } else {
            return counter + ' ' + i + 's ago'; // plural (2 days ago)
        }
      }
    }
  }
}
