/*
 * Public API Surface of eyc-ui-shared-component
 */

import { from } from 'rxjs';


export * from './lib/eyc-ui-shared-component.module';

export * from './lib/modal/modal.module';
export * from './lib/modal/component/modal.component';
// export * from './lib/table-header-renderer/table-header-renderer.component';

export * from './lib/grid/grid.module';
export * from './lib/intake-files/intake-files.module';
export * from './lib/grid/components/grid.component';
export * from './lib/services/custom-global.service';
export * from './lib/table-header-renderer/table-header-renderer.component';
export * from './lib/modal/error-modal/error-modal.component';
export * from './lib/services/permission.service';
export * from './lib/shared-helper';
export * from './lib/services/auto-unsubscriber.service';
export * from './lib/panel-right-comment-details/panel-right-comment-details.module';
export * from './lib/panel-right-comment-details/components/panel-right-comment-details.component';
export * from './lib/comment-details-pr/comment-details-pr.module'
export * from './lib/comment-details-pr/components/comment-details-pr.component';
export * from './lib/modal/resolve-modal/components/resolve-modal.component';
export * from './lib/modal/individual-exceptions-resolve/components/individual-exceptions-resolve.component'; 
export * from './lib/modal/session-extend-modal/session-extend-modal.component';
export * from './lib/audit-log/audit-log.module';
export * from './lib/audit-log/components/audit-log.component';
export const DEFAULT_PAGE_SIZE = 20;