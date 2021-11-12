import { Component, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'lib-tax-horizontal-stacked-bar-chart',
  templateUrl: './tax-horizontal-stacked-bar-chart.component.html',
  styleUrls: ['./tax-horizontal-stacked-bar-chart.component.css']
})
export class TaxHorizontalStackedBarChartComponent{
  data:any;
  widthServer:any;
  keys:any;
  labelsChart:any;
  colors:any;
  dataValues:any;
  totalValues:any;
  emptyMsg= "NO DATA RECEIVED"; 
  
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

  renderBarChartSVG(){
      if(this.data && this.widthServer && this.colors && this.labelsChart && this.dataValues && this.totalValues){        
          this.keys = Object.keys(this.data[0]);
          var stack = d3.stack().keys(this.keys); 
          var stackedSeries = stack(this.data);  
          // Create a g element for each series
          var g = d3.select('g')
            .selectAll('g.series')
            .data(stackedSeries)
            .enter()
            .append('g')
            .classed('series', true)
            .style('fill',(d, i)=> {
              return this.colors[i];
            }); 

          // create a tooltip
          var tooltip = d3.select("#taxBarChart")
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
      var element:any = d3.select(this.parentNode).datum();
      var subgroupName = element.key;
      var subgroupValue = element[0].data[subgroupName];
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
    g.selectAll('rect')
      .data(function(e) {
        return e;
      })
      .join('rect')
      .attr('width',(x)=> {
        let total:any = Object.values(this.data[0]).reduce((a:number, b:number) => a + b);
        return total > 0 ? Math.round(((Math.round((x[1] * 100)/(total))) * this.widthServer)/100) : 0;
      })
      .attr('x',(x)=> {
        let total:any = Object.values(this.data[0]).reduce((a:number, b:number) => a + b);
        return total > 0 ? Math.round(((Math.round((x[0] * 100)/(total))) * this.widthServer)/100): 0;
      })
      .attr('y',(x, i)=> {
        return i * 20;
      })
      .attr('height', 17)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
      }
    }
}
