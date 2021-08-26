import { Injectable, Inject } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { SESSION_PBI_TOKEN, PBI_ENCRYPTION_KEY } from '../config/tax-config-helper';

@Injectable({
  providedIn: 'root'
})
export class EycTaxSettingsService {

  constructor(@Inject('taxapiEndpoint') private apiEndpoint, @Inject('taxProduction') private taxproduction) { }
  public API_ENDPOINT = this.apiEndpoint.slice(-1) === "." ?
    this.apiEndpoint.substr(0, this.apiEndpoint.length - 1) : this.apiEndpoint;
  public production = this.taxproduction;

  get taxReportingFiling(): any {
    const tax_Reporting = {
      filing_details: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/managementReports' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/filings.json',
      production_cycles: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/productionCycles' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/ProductionCyclesList.json',
      production_cycles_details: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/productionCycles' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/ProductionCyclesDetails.json',
    }

    

    return tax_Reporting;
  }

  get pbiReportingConfig(): any {
    const regulatory_Reporting = {
      question_details: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getQuestionsByFilingId/' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/pbi_report.json',
      pbi_auth_token: this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getPBIAuthToken',
      pbi_embeded_token: this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getPBIEmbedToken/',
      filing_names: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/filing/names' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/filingNames.json',
      period: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/filings/' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/pbi_period.json',
      PBIReportId: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/getPBIReportIDByFilingIdQuestionId/' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/pbi_report.json',
    }

    return regulatory_Reporting;
  }

  setSessionToken = (value, sesssion_id, encrypt_key) => {
    const key = CryptoJS.enc.Utf8.parse(sesssion_id);
    const iv = CryptoJS.enc.Utf8.parse(encrypt_key);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    sessionStorage.setItem(SESSION_PBI_TOKEN, encrypted);

  }

  getSessionToken = (sesssion_id, encrypt_key) => {
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