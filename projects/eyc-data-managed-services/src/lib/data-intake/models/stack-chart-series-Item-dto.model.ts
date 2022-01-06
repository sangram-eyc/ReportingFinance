import { BarChartSeriesItemDTO } from "./bar-chart-series-Item-dto.model";

export interface StackChartSeriesItemDTO {
    name: string,
    series: BarChartSeriesItemDTO[]
};

// export interface StackChartSeriesItemDTO {
//     name: string,
//     series: { name: string, value: number, status: string }[]
// };