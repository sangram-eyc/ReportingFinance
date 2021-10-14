import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'lib-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent {
  @Input() width: number = 202;
  @Input() height: number = 202;
  @Input() margin: number = 30;
  _data: number[];
  _colors: string[] = ["#57E188", "#42C9C2", "#FF9831", "#FF736A", "#E7E7EA"];
  @Input() fileSummaries: string[] = [];
  @Input() set colors(value: string[]) {
    if (value && value.length <= 0) {
      return;
    }
    this._colors = value;
    this.renderSVG();
  }
  @Input() set data(value: number[]) {
    if (value && value.length <= 0) {
      return;
    }
    this._data = value;
    this.renderSVG();
  }
  totalFilesNumber: number = 600;
  @Input() totalFilesNumberFontSize: number = 39;
  @Input() totalFilesText: string = "TOTAL FILES";
  @Input() totalFilesTextFontSize: number = 12;
  @Input() totalExpected: string = "EXPECTED";

  renderSVG() {
    this.totalFilesNumber = this._data && this._data.reduce((total, index) => total + index);
    const radius = Math.min(this.width, this.height) / 2 - this.margin;
    d3.select("#donut").selectAll("*").remove();
    const svg = d3.select("#donut")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(${this.width / 2},${this.height / 2})`);

    const asciiStart = 97;

    const data_map: any =
      this._data?.length > 0 ?
        this._data.map((d, index) => [String.fromCharCode(asciiStart + index), d])
        : [];

    const color: any = d3.scaleOrdinal().range(this._colors);
    const pie = d3.pie().value(d => d[1]);
    const data_ready = pie(data_map as any);

    svg.selectAll('whatever')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc().innerRadius(100).outerRadius(radius) as any)
      .attr('fill', d => color(d.data[0]))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", `${this.totalFilesNumberFontSize}px`)
      .attr("style", "font-family: EYInterstate; line-height: 46px; text-align: center; letter-spacing: -2.01152px; fill: #2E2E3C;")
      .text(this.totalFilesNumber);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", `${this.totalFilesTextFontSize}px`)
      .attr("style", "font-family: EYInterstate; line-height: 16px; text-align: center; fill: #747480;")
      .attr("x", "0")
      .attr("y", "15")
      .text(this.totalFilesText);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", `${this.totalFilesTextFontSize}px`)
      .attr("style", "font-family: EYInterstate; line-height: 16px; text-align: center; fill: #747480;")
      .attr("x", "0")
      .attr("y", "30")
      .text(this.totalExpected);
  }

  trackItem(index: number, item: any) {
    return item.trackId;
  }

}
