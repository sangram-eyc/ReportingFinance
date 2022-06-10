import { Component, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'lib-donut-tax-chart',
  templateUrl: './donut-tax-chart.component.html',
  styleUrls: ['./donut-tax-chart.component.css']
})
export class DonutTaxChartComponent {
  @Input() width: number = 135;
  @Input() height: number = 135;
  @Input() margin: number = 10;
  @Input() innerRadius: number = 80;
  @Input() svgTranslateLeft: number = 80;
  @Input() svgTranslateRight: number = 80;
  @Input() donut_id: string = "";
  
  // Mock API data stored in _data
  _data: number[];
  // Color code for donut chart
  _colors: string[] = ["#57E188", "#42C9C2", "#FF9831", "#FF736A", "#E7E7EA"];
  // fileSummaries used for legends iteration
  fileSummaries: string[] = [];

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
    this.fileSummaries = value && value.map(filesSummary => filesSummary['label']);
    this._data = value && value.map(files => files['value']);
    this.renderSVG();
  }
  totalFilesNumber: number = 600;
  @Input() totalFilesNumberFontSize: number = 39;
  @Input() totalFilesText: string = "TOTAL FILES";
  @Input() totalFilesTextFontSize: number = 12;
  @Input() totalExpected: string = "EXPECTED";


  // Create dynamic donut SVG as per data/api
  renderSVG() {
    // Calculate TotalFileNumber 
    this.totalFilesNumber = this._data && this._data.reduce((total, index) => total + index);
    const radius = Math.min(this.width, this.height) / 2 - this.margin; // radius as per figma
    d3.select("#" + this.donut_id).selectAll("*").remove();
    const svg = d3.select("#" + this.donut_id)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(${this.svgTranslateLeft},${this.svgTranslateRight})`);

    const asciiStart = 97;

    const data_map: any =
      this._data?.length > 0 ?
        this._data.map((d, index) => [String.fromCharCode(asciiStart + index), d])
        : [];

    const color: any = d3.scaleOrdinal().range(this._colors); // color code inject in radius
    const pie = d3.pie().value(d => d[1]);
    const data_ready = pie(data_map as any); // data inject into donut chart
   
    //Default empty donut chart
    if(this.totalFilesNumber === 0){
      const data_map_empty = [1].map((d, index) => [String.fromCharCode(asciiStart + index), d])
      const colorEmpty: any = d3.scaleOrdinal().range(['#EAEAF2']); // color code inject in radius
      const pieEmpty = d3.pie().value(d => d[1]);
      const data_readyEmpty = pieEmpty(data_map_empty as any); // data inject into donut chart
      svg.selectAll('background')
      .data(data_readyEmpty)
      .join('path')
      .attr('d', d3.arc().innerRadius(this.innerRadius).outerRadius(radius) as any)
      .attr('fill', d => colorEmpty(d.data[0]))
      .attr("stroke", "#EAEAF2")
      .style("stroke-width", "2px")
    }
    //End default empty donut chart

    // Configure SVG for donut chart
    if(this.totalFilesNumber > 0){
      svg.selectAll('whatever')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc().innerRadius(this.innerRadius).outerRadius(radius) as any)
      .attr('fill', d => color(d.data[0]))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
    }

    // Add TotalFileNumber into middle of donut chart as per figma
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", `${this.totalFilesNumberFontSize}px`)
      .attr("class",'totalFilesNumber')
      .attr("style", "font-family: EYInterstate; line-height: 46px; text-align: center; letter-spacing: -2.01152px; fill: #2E2E3C;")
      .text(this.totalFilesNumber);

    // Add TotalFileText into middle of donut chart as per figma
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", `${this.totalFilesTextFontSize}px`)
      .attr("class",'chart-status')
      .attr("style", "font-family: EYInterstate; line-height: 16px; text-align: center; fill: #747480;font-weight: 600;")
      .attr("x", "0")
      .attr("y", "15")
      .text(this.totalFilesText);

    // Add TotalExpectedText into middle of donut chart as per figma
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", `${this.totalFilesTextFontSize}px`)
      .attr("style", "font-family: EYInterstate; line-height: 16px; text-align: center; fill: #747480;")
      .attr("x", "0")
      .attr("y", "30")
      .text(this.totalExpected);
  }

  trackItem(index: number) {
    return index;
  }

}