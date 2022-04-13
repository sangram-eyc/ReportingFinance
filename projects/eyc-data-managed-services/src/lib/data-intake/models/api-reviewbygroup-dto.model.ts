export interface ApiReviewByGroupSeriesItemDTO {
    dataIntakeName: string,
    dataIntakeCount: number,
    fastFilters: [{
        lable: string,
        value: number
    }],
    dataIntakeDTO: [{
        name: string,
        value: number
    }]
};