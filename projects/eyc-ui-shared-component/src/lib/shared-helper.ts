export const fileUploadHeading = `Drag and drop documents or <span style="color:#155CB4;font-weight: bold;">browse</span>`;
export const allowedFileTyes = ['doc','docx','csv','xls','xlsx','pdf','msg'];
export const fileUploaInvalid = 'You have uploaded a restricted file type. Please limit attachments to one of the following file types: '+ allowedFileTyes; 
export const fileSizeLimit = 'Size exceeds limit ';
export const fileUploadSucess = 'Files uploaded successfully';
export const notAllowedFileTyes = ['dll', 'exe'];

export const MAX_FILE_SIZE = 26214400;
export const MB_SIZE = 1048576;

export const dataset = 'DATASET'; 
export const answer_exception_report = 'ANSWER_EXCEPTION_REPORT';
export const data_exception_report = 'DATA_EXCEPTION_REPORT';
export const filing_entity = 'FILING_ENTITY';
export const filing = 'FILING';
export const line_item = 'LINE_ITEM';


export const customComparator = (valueA, valueB) => {
	if (valueA == null) {
		return false;
	}
	else if (valueB == null) {
		return false;
	} else {
		return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
	}
}; 