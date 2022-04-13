import { Component, Input } from '@angular/core';
import * as d3 from 'd3';
import { colorSets } from '../utils/color-sets';

@Component({
  selector: 'lib-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent {
  @Input() width: number = 135;
  @Input() height: number = 135;
  @Input() margin: number = 10;
  @Input() innerRadius: number = 100;
  @Input() svgTranslateLeft: number = 101;
  @Input() svgTranslateRight: number = 101;
  @Input() svgStrokeWidth: number = 2;
  @Input() svgStrokeColor: String = 'white';
  // Total Files Number
  @Input() totalFilesNumberFontSize: number = 32;
  @Input() totalFilesNumberStyle = "font-family: EYInterstate; line-height: 46px; text-align: center; letter-spacing:-1.64307px; fill: #2E2E3C;"
  // Total Files Text
  @Input() totalFilesTextFontSize: number = 11;
  @Input() totalFilesTextStyle = "font-family: EYInterstate; line-height: 13px; text-align: center; fill: #747480;"
  @Input() totalFilesText: string = "TOTAL FILES";
  // Total Expected Text
  @Input() totalExpectedStyle = "font-family: EYInterstate; line-height: 13px; text-align: center; fill: #747480;"
  @Input() totalExpected: string = "EXPECTED";
  @Input() legendTextSliceNumber: number = 19;
  totalFilesNumber: number = 0;


  // Mock API data stored in _data
  _data: number[];
  // Color code for donut chart
  _colors: string[] = colorSets.find(s => s.name === 'all').domain;
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


  // Create dynamic donut SVG as per data/api
  renderSVG() {
    // Calculate TotalFileNumber 
    this.totalFilesNumber = this._data && this._data.reduce((total, index) => total + index);
    const radius = Math.min(this.width, this.height) / 2 - this.margin; // radius as per figma

    d3.select("#donut").selectAll("*").remove();
    const svg = d3.select("#donut")
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
    var pie = d3.pie()
      .sort(d => d[1])
      .value(d => d[1]);
    const data_ready = pie(data_map as any); // data inject into donut chart

    //Default empty donut chart
    if(this.totalFilesNumber === 0){
      const data_map_empty = [1].map((d, index) => [String.fromCharCode(asciiStart + index), d])
      const colorEmpty: any = d3.scaleOrdinal().range(['#EAEAF2']); //Default color code inject in radius
      const pieEmpty = d3.pie().value(d => d[1]);
      const data_readyEmpty = pieEmpty(data_map_empty as any); // data inject into donut chart
      svg.selectAll('background')
      .data(data_readyEmpty)
      .join('path')
      .attr('d', d3.arc().innerRadius(this.innerRadius).outerRadius(radius) as any)
      .attr('fill', d => colorEmpty(d.data[0]))
      .attr("stroke", "#EAEAF2") //Default color 
      .style("stroke-width", `${this.svgStrokeWidth}px`)
    }
    //End default empty donut chart

    // Configure SVG for donut chart
    if(this.totalFilesNumber > 0){
      svg.selectAll('whatever')
        .data(data_ready)
        .join('path')
        .attr('d', d3.arc().innerRadius(this.innerRadius).outerRadius(radius) as any)
        .attr('fill', d => color(d.data[0]))
        .attr("stroke", `${this.svgStrokeColor}`)
        .style("stroke-width", `${this.svgStrokeWidth}px`)
    }

    // Add TotalFileNumber into middle of donut chart as per figma
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", `${this.totalFilesNumberFontSize}px`)
      .attr("class",'totalFilesNumber')     
      .attr("style",  `${this.totalFilesNumberStyle}`)
      .text(this.totalFilesNumber);

    // Add TotalFileText into middle of donut chart as per figma
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", `${this.totalFilesTextFontSize}px`)
      .attr("style", `${this.totalFilesTextStyle}`)
      .attr("x", "0")
      .attr("y", "15")
      .text(this.totalFilesText);

    // Add TotalExpectedText into middle of donut chart as per figma
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", `${this.totalFilesTextFontSize}px`)
      .attr("style", `${this.totalExpectedStyle}`)
      .attr("x", "0")
      .attr("y", "30")
      .text(this.totalExpected);
  }

  trackItem(index: number) {
    return index;
  }

}