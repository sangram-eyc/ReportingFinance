import { Injectable,Inject } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {SESSION_PBI_TOKEN,PBI_ENCRYPTION_KEY} from '../config/rr-config-helper';

@Injectable({
  providedIn: 'root'
})
export class EycRrSettingsService {

  constructor(@Inject('apiEndpoint') private apiEndpoint, @Inject('rrproduction') private rrproduction) { }
  public API_ENDPOINT = this.apiEndpoint.slice(-1) === "." ?
    this.apiEndpoint.substr(0, this.apiEndpoint.length - 1) : this.apiEndpoint;
  public production = this.rrproduction;

  get regReportingFiling(): any {
    const regulatory_Reporting = {
      filing_details: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getFilingDetails?filter=active' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filings.json',
      filing_history: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getFilingDetails?filter=completed' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filings.json',
      filing_search: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/searchFilingDetails?filter=completed&' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filings.json',
      rr_exception_reports: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getAnswerExceptionReportsByFilingId?' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/exceptionReports.json',
      rr_filing_entities: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/entity?stage=Reporting' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filingEntities.json',
      approve_rr_filing_entities: this.rrproduction ? this.API_ENDPOINT +'gatewayService/api/v2/regreporting/entity': this.API_ENDPOINT +  '',
      approve_answer_exceptions: this.rrproduction ? this.API_ENDPOINT +'gatewayService/api/v2/regreporting/answerExceptionResult/approve': this.API_ENDPOINT +  'gatewayService/api/v2/regreporting/answerExceptionResult/approve',
      client_review_filing_entities: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/entity?stage=Client review' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filingEntities.json',
      approve_client_review_filing_entities: this.rrproduction ? this.API_ENDPOINT +'gatewayService/api/v2/regreporting/entity': this.API_ENDPOINT +  '',
      fund_scoping_details: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/fundScopingDetails?' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/fundScopingDetails.json',
      fund_scoping_status: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/fundScopingStatus?' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/fundScopingStatus.json',
      approve_fund_scoping_status: this.rrproduction ? this.API_ENDPOINT +'gatewayService/api/v2/regreporting/fundScopingStatus': this.API_ENDPOINT +  '',
      submission_xml_files: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getAnswerFilesList' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/xmlFilesList.json',
      submission_download_xml: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/downloadAnswerFiles' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/xmlFilesList.json',
      filing_status: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/filings/': this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/filing-status.json',
      di_exception_reports: this.rrproduction ? this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/exception_details_9-9.json' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/exception_details_9-9.json',
      di_files: this.rrproduction ? this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/data-intake-ER.json' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/data-intake-ER.json',
      files_list: this.rrproduction ? this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/exception_summary_9-9.json' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/exception_summary_9-9.json',
      datasets_list: this.rrproduction ? this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/exception_details_9-9.json' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/exception_details_9-9.json',
      rr_permission_list: this.rrproduction ? this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/reg_reporting_permissions.json' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/reg_reporting_permissions.json',
      rr_comments: this.rrproduction ? this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/comments.json' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/comments.json',
      view_exception_reports: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getAnswerExceptionResults?' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/viewExceptionReports.json',
      view_exception_report_results: this.rrproduction ? this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/viewExceptionReports.json' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/viewExceptionReports.json',
      complete_filing: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/filings/' : this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/filings/',
    }

    return regulatory_Reporting;
  }

  get pbiReportingConfig(): any {
    const regulatory_Reporting = {
      question_details: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getQuestionsByFilingId/' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/pbi_report.json',
      pbi_auth_token: this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getPBIAuthToken',
      pbi_embeded_token: this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getPBIEmbedToken/',
      filing_names: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/filing/names' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/filingNames.json',
      period: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/filings/' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/pbi_period.json',
      PBIReportId: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getPBIReportIDByFilingIdQuestionId/' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/pbi_report.json',
    }

    return regulatory_Reporting;
  }

  setSessionToken = (value,sesssion_id,encrypt_key) => {
    const key = CryptoJS.enc.Utf8.parse(sesssion_id);
    const iv = CryptoJS.enc.Utf8.parse(encrypt_key);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    sessionStorage.setItem(SESSION_PBI_TOKEN,encrypted);
   
  }
  
    getSessionToken = (sesssion_id,encrypt_key) => {
      const getDecryptedText = sessionStorage.getItem(sesssion_id);
      const key = CryptoJS.enc.Utf8.parse(encrypt_key);
      const iv = CryptoJS.enc.Utf8.parse(encrypt_key);
      if (getDecryptedText != null) {
        var decrypted = CryptoJS.AES.decrypt(getDecryptedText, key, {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
      }
    }
deleteSessionKey = (session_Key): void => {
      sessionStorage.removeItem(session_Key);
};
  
    
}