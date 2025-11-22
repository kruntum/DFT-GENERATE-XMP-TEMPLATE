
export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  invoiceType: string; // INVOICE_THAI, INVOICE_ABROAD, INVOICE_ABROAD_THAI
}

export interface ShippingMarkItem {
  id: string;
  mark: string;
}

export interface ProductItem {
  id: string;
  nameTh: string; // ชื่อสินค้าแสดงในคำขอ
  nameEn: string; // ชื่อสินค้าภาษาอังกฤษแสดงในฟอร์ม
  description: string; // รายละเอียดสินค้าแสดงในฟอร์ม
  hsCode: string;
  originCriteria: string;
  originCriteriaPercent: string; // For RVC score
  
  // Weights & Quantities
  netWeight: string;
  netWeightUnit: string;
  grossWeight: string;
  grossWeightUnit: string;
  quantity: string; // Other Quantity
  quantityUnit: string;
  qtyPackage: string;
  qtyPackageUnit: string;
  
  // Visibility Flags
  showNetWeight: boolean;
  showGrossWeight: boolean;
  showOtherQuantity: boolean;

  fobValue: string;
  fobValueOther: string;
  
  // Invoice Links
  invoiceNo: string; // Legacy
  invoiceDate: string; // Legacy
  linkedInvoiceId: string | null; // For Thai/Local Invoice
  linkedAbroadInvoiceId: string | null; // For Third Party Invoice
  
  // Shipping Mark Link
  selectedShippingMarkId: string;

  invoiceOtherCountryValue: string;
  brand: string;
  model: string;
}

export interface SmartCOData {
  formId: string;
  exporter: {
    name: string;
    address: string;
    phone: string;
    taxId: string;
    email: string;
    // New fields
    destRemark: string;
    obCompany: string;
    obAddress: string;
    obPhone: string;
    obFax: string;
    emailCh01: string;
    dftOfficeId: string;
    radBy: string;
    tranBy: string;
  };
  importer: {
    name: string;
    address: string;
    country: string;
    phone: string;
    fax: string;
    email: string;
    // New fields
    taxId: string;
    importerId: string;
    city: string;
    destRemark: string;
    obCompany: string;
    obAddress: string;
  };
  transport: {
    departureDate: string;
    transportBy: string;
    vehicleName: string;
    portDischarge: string; // Maps to portDischargeEdit
    billRefNo: string; // B/L No.
    // New fields
    vehicleUuid: string;
    orderNo: string;
    shipBy: string;
    shipByOther: string;
    billType: string;
    sailingDate: string;
    vehicleNameList: string;
    placeDeparture: string;
    portDischargeLink: string;
  };
  specialConditions: {
    thirdPartyInvoicing: boolean;
    backToBack: boolean;
    exhibitions: boolean;
    deMinimis: boolean;
    // New broker fields
    brokerInThaiNotRuleChecked: boolean;
    brokerTax: string;
    brokerCompanyName: string;
    // Third party details
    thirdPartyInvoicingUuid: string;
    thirdPartyInvoicingCompany: string;
    thirdPartyInvoicingAddress1: string;
    thirdPartyInvoicingAddress2: string;
    thirdPartyInvoicingAddress3: string;
    thirdPartyInvoicingAddress4: string;
    thirdPartyInvoicingAddress5?: string; // optional buffer
    thirdPartyInvoicingCountry: string;
    // Accumulation
    accumulationChecked: boolean;
    partialCumulationChecked: boolean;
    backToBackSourceCountry: string;
    // Exhibition details
    exhibitionsName: string;
    exhibitionsPlace: string;
    exhibitionsCountry: string;
  };
  
  // Invoice Management
  invoices: InvoiceItem[];
  prevFormNo: string;
  prevFormDate: string;

  // Shipping Marks Management
  shippingMarksList: ShippingMarkItem[];
  
  products: ProductItem[];
  
  // Global quantities
  productCurrency: string;
  productInvoiceShowInCol10: string;
  showTotalValueFobUs: boolean;
  showTotalValueFobUsOther: boolean;
  showTotalInvoiceOtherCountryUsValue: boolean;
  showTotalInvoiceBrokerUsValue: boolean;
  showTotalNetWeight: boolean;
  showTotalQuantity: boolean;
  
  // Manual Total Inputs
  totalQuantityValue: string;
  totalQuantityUnit: string;

  requestDescription: string;
}

export interface GeneratedResponse {
  xml: string;
  logs: string[];
  groundingMetadata?: any;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
