import { FileFilterStatus } from '../../global-constants'

export const donutSummariesObject = [
  {
    "apiKey": FileFilterStatus.noIssue.apiKey,
    "label": FileFilterStatus.noIssue.legendTitle,
    "value": 0
  },
  {
    "apiKey": FileFilterStatus.mediumLowPriority.apiKey,
    "label": FileFilterStatus.mediumLowPriority.legendTitle,
    "value": 0
  },
  {
    "apiKey": FileFilterStatus.highPriorityIssues.apiKey,
    "label": FileFilterStatus.highPriorityIssues.legendTitle,
    "value": 0
  },
  {
    "apiKey": FileFilterStatus.missingFilesPastDue.apiKey,
    "label": FileFilterStatus.missingFilesPastDue.legendTitle,
    "value": 0
  },
  {
    "apiKey": FileFilterStatus.filesNotReceived.apiKey,
    "label": FileFilterStatus.filesNotReceived.legendTitle,
    "value": 0
  }
];