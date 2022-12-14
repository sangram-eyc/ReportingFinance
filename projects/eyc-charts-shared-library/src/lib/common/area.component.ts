import { Component, Input, Output, EventEmitter, ElementRef, OnChanges, ChangeDetectionStrategy } from '@angular/core';
// import { select } from 'd3-selection';
import { select as d3Select } from 'd3-selection';
import { transition as d3Transition } from 'd3-transition';
d3Select.prototype.transition = d3Transition;
import { id } from '../utils/id';
import { AreaChartSeries } from '../models/chart-data.model';
import { BarOrientation } from './types/bar-orientation.enum';
import { Gradient } from './types/gradient.interface';

@Component({
  selector: 'g[eyc-charts-area]',
  template: `
    <svg:defs *ngIf="gradient">
      <svg:g
        eyc-charts-svg-linear-gradient
        [orientation]="barOrientation.Vertical"
        [name]="gradientId"
        [stops]="gradientStops"
      />
    </svg:defs>
    <svg:path class="area" [attr.d]="areaPath" [attr.fill]="gradient ? gradientFill : fill" [style.opacity]="opacity" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaComponent implements OnChanges {
  @Input() data: AreaChartSeries;
  @Input() path: string;
  @Input() startingPath: string;
  @Input() fill: string;
  @Input() opacity: number = 1;
  @Input() startOpacity: number = 0.5;
  @Input() endOpacity: number = 1;
  @Input() gradient: boolean = false;
  @Input() stops: Gradient[];
  @Input() animations: boolean = true;

  @Output() select = new EventEmitter();

  element: HTMLElement;
  gradientId: string;
  gradientFill: string;
  areaPath: string;
  animationsLoaded: boolean = false;
  gradientStops: Gradient[];
  hasGradient: boolean = false;

  barOrientation = BarOrientation;

  constructor(element: ElementRef) {
    this.element = element.nativeElement;
  }

  ngOnChanges(): void {
    this.update();

    if (!this.animationsLoaded) {
      this.loadAnimation();
      this.animationsLoaded = true;
    }
  }

  update(): void {
    this.gradientId = 'grad' + id().toString();
    this.gradientFill = `url(#${this.gradientId})`;

    if (this.gradient || this.stops) {
      this.gradientStops = this.getGradient();
      this.hasGradient = true;
    } else {
      this.hasGradient = false;
    }

    this.updatePathEl();
  }

  loadAnimation(): void {
    this.areaPath = this.startingPath;
    setTimeout(this.updatePathEl.bind(this), 100);
  }

  updatePathEl(): void {
    const node = d3Select(this.element).select('.area');

    if (this.animations) {
      node.transition().duration(750).attr('d', this.path);
    } else {
      node.attr('d', this.path);
    }
  }

  getGradient(): Gradient[] {
    if (this.stops) {
      return this.stops;
    }

    return [
      {
        offset: 0,
        color: this.fill,
        opacity: this.startOpacity
      },
      {
        offset: 100,
        color: this.fill,
        opacity: this.endOpacity
      }
    ];
  }
}
