import { FileFilterStatus } from '../../config/dms-config-helper'

export const donutSummariesObject = [
  {
    "apiKey": FileFilterStatus.noIssue.apiKey,
    "label": FileFilterStatus.noIssue.legendTitle,
    "value": 0
  },
  {
    "apiKey": FileFilterStatus.lowPriority.apiKey,
    "label": FileFilterStatus.lowPriority.legendTitle,
    "value": 0
  },
  {
    "apiKey": FileFilterStatus.mediumPriority.apiKey,
    "label": FileFilterStatus.mediumPriority.legendTitle,
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