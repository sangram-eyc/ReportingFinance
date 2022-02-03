import { Component, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'lib-tax-horizontal-stacked-bar-chart',
  templateUrl: './tax-horizontal-stacked-bar-chart.component.html',
  styleUrls: ['./tax-horizontal-stacked-bar-chart.component.css']
})
export class TaxHorizontalStackedBarChartComponent{
  data:any[] = [];
  widthServer:any = 0;
  keys:any[] = [];
  labelsChart:string[] = [];
  colors:string[] = [];
  dataValues:any[] = [];
  totalValues:any = 0;
  emptyMsg = "NO DATA RECEIVED";
  chart_id: any="chart_id";
  @Input() gridEnabled:boolean;
  
  @Input() set dataInput(values:any){
     if(values === undefined){
       return;
     }else if(values && values.length <= 0){
      return;
     }
      this.data = values;
      this.dataValues = Object.values(values[0]);
      this.totalValues = Object.values(values[0]).reduce((a:number, b:number) => a + b);
      this.renderBarChartSVG();
  };

  @Input() set width(value:any){   
    if(value === undefined){
      return;
    }else if(value && value.length <= 0){
     return;
    }
    this.widthServer = value;
    this.renderBarChartSVG();
  };

  @Input() set colorsInput(values:string[]){
    if(values === undefined){
      return;
    }else if(values && values.length <= 0){
     return;
    }
   this.colors = values;
   this.renderBarChartSVG();
  }

  @Input() set labels(values:string[]){
    if(values === undefined){
      return;
    }else if(values && values.length <= 0){
     return;
    }
   this.labelsChart = values;
   this.renderBarChartSVG();
  }

  @Input() set id(value: any) {
    if (value === undefined) {
      return
    }
    this.chart_id = value
    this.renderBarChartSVG();
  }

  renderBarChartSVG(){
      !this.gridEnabled ? d3.select('#chart_id').selectAll('*').remove(): ''
      if(this.data && this.widthServer && this.colors && this.labelsChart && this.dataValues && this.totalValues){      
          this.keys = Object.keys(this.data[0]);
          var stack = d3.stack().keys(this.keys); 
          var stackedSeries = stack(this.data);  

          // Create a g element for each series
          let chartId = '#' + this.chart_id
          var g = d3.select(chartId)
            .append("svg")
            .style("width", this.widthServer + "px")
            .style("height", "25px")
            .style("cursor", "pointer")
            .attr("viewBox", "0 0 " + this.widthServer + " 25")
            .selectAll('g.series')
            .data(stackedSeries)
            .enter()
            .append('g')
            .classed('series', true)            
            .style('fill',(d, i)=> {
              return this.colors[i];
            });

          // create a tooltip
          var tooltip = d3.select(chartId)
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "rgba(0, 0, 0, 0.90)")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px")
          .style("color", "white")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      let element:any = d3.select(this.parentNode).datum();
      let subgroupName = element.key;
      let subgroupValue = element[0].data[subgroupName];
      tooltip
          .html(subgroupValue + " " + subgroupName)
          .style("opacity", 1)
          .style("z-index", 2)
    } 
    var mousemove = function(event) {
      tooltip
        .style("left", (event.offsetX)+"px")
        .style("top", "40px") 
    }
    var mouseleave = function(d) {
      tooltip
        .style("opacity", 0)
        .style("z-index", -1)
    }

    // For each series create a rect element
    var positionX;
    var arrPositionX: any[] = [];
    var arrWidthPosition: any[] = [];
    g.selectAll('rect')
      .data(function(e) {
        return e;
      })
      .join('rect')
      .attr('width',(x)=> {
        let total: any = Object.values(this.data[0]).reduce((a: number, b: number) => a + b);
        let widthValue: any = Math.round(((Math.round((x[1] * 100) / (total))) * this.widthServer) / 100)
        arrWidthPosition.push(widthValue)
        return total > 0 ? widthValue : 0;
      })
      .attr('x',(x)=> {
        let total: any = Object.values(this.data[0]).reduce((a: number, b: number) => a + b);
        let xPos = Math.round(((Math.round((x[0] * 100) / (total))) * (this.widthServer)) / 100)
        positionX = total > 0 ? xPos : 0;
        arrPositionX.push(xPos)
        return positionX;
      })
      .attr('y',(x, i)=> {
        return i * 20;
      })
      .attr('height', 30)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

      if (this.gridEnabled){
        d3.select(chartId).selectAll('g').filter(":nth-child(1)").append('text').text(this.dataValues[0]).attr('x', (arrPositionX[0] + (arrWidthPosition[0] / 2))).attr('y', 25).attr('font-size', 24).attr('fill', '#212529')
        d3.select(chartId).selectAll('g').filter(":nth-child(2)").append('text').text(this.dataValues[1]).attr('x', (arrPositionX[1] + ((arrWidthPosition[1] - arrWidthPosition[0]) / 2))).attr('y', 25).attr('font-size', 24).attr('fill', '#212529')
        d3.select(chartId).selectAll('g').filter(":nth-child(3)").append('text').text(this.dataValues[2]).attr('x', (arrPositionX[2] + ((arrWidthPosition[2] - arrWidthPosition[1]) / 2))).attr('y', 25).attr('font-size', 24).attr('fill', '#212529')
      }
      }

    }

    trackItem(index: number) {
      return index;
    }
    
    ngAfterViewInit(): void {
      this.renderBarChartSVG();
      var statusColumn = document.querySelectorAll('.motif-header-name')
      statusColumn.forEach(function (userItem: any) { 
        if (userItem.innerText == "Cycle status indicator") {
          userItem.outerHTML = '<div id="cycle-status-indicator-id" style="display:flex;pointer-events: none;" class="motif-header-name">Cycle status indicator&nbsp&nbsp&nbsp<svg xmlns="http://www.w3.org/2000/svg" style="margin-top:3px"  (click)="informationModal()"><path d="M6.79102 11.3872H8.20768V7.13721H6.79102V11.3872ZM7.49935 0.762207C3.58935 0.762207 0.416016 3.93554 0.416016 7.84554C0.416016 11.7555 3.58935 14.9289 7.49935 14.9289C11.4093 14.9289 14.5827 11.7555 14.5827 7.84554C14.5827 3.93554 11.4093 0.762207 7.49935 0.762207ZM7.49935 13.5122C4.3756 13.5122 1.83268 10.9693 1.83268 7.84554C1.83268 4.72179 4.3756 2.17887 7.49935 2.17887C10.6231 2.17887 13.166 4.72179 13.166 7.84554C13.166 10.9693 10.6231 13.5122 7.49935 13.5122ZM6.79102 5.72054H8.20768V4.30387H6.79102V5.72054Z"/></svg></div>'
        }
      });
    }
}
