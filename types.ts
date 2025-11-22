
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
  invoiceNo: string; // Legacy, kept for types safety but handled via linked IDs
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

// Transport Modes
export const TRANSPORT_MODES = [
  { value: 'BY SEA FREIGHT', label: 'เรือเดินสมุทร (MARINE SHIP)' },
  { value: 'BY BOAT', label: 'เรือตามลำน้ำ (BY BOAT)' },
  { value: 'BY TRUCK', label: 'ทางรถบรรทุก (TRUCK WAY)' },
  { value: 'BY RAIL WAY', label: 'ทางราง (RAILWAY)' },
  { value: 'BY AIR FREIGHT', label: 'ทางอากาศ (BY AIR)' },
  { value: 'BY POST', label: 'ทางไปรษณีย์ (BY MAIL)' },
  { value: 'ACCOMPANIED WITH PASSENGER', label: 'นำติดตัว (BRING IT ON)' },
  { value: 'OTHER', label: 'อื่น ๆ (OTHER)' }
];

// Currencies
export const CURRENCIES = [
  { value: 'USD', label: 'US DOLLAR [USD]' },
  { value: 'THB', label: 'BAHT [THB]' },
  { value: 'CNY', label: 'YUAN RENMINBI [CNY]' },
  { value: 'JPY', label: 'YEN [JPY]' },
  { value: 'EUR', label: 'EURO [EUR]' },
  { value: 'GBP', label: 'POUND STERLING [GBP]' },
  { value: 'AUD', label: 'AUSTRALIAN DOLLAR [AUD]' },
  { value: 'SGD', label: 'SINGAPORE DOLLAR [SGD]' },
  { value: 'HKD', label: 'HONG KONG DOLLAR [HKD]' },
  { value: 'MYR', label: 'MALAYSIAN RINGGIT [MYR]' },
  { value: 'IDR', label: 'RUPIAH [IDR]' },
  { value: 'INR', label: 'INDIAN RUPEE [INR]' },
  { value: 'KRW', label: 'WON [KRW]' },
  { value: 'TWD', label: 'NEW TAIWAN DOLLAR [TWD]' },
  { value: 'VND', label: 'DONG [VND]' },
  { value: 'LAK', label: 'KIP [LAK]' },
  { value: 'KHR', label: 'RIEL [KHR]' },
  { value: 'MMK', label: 'KYAT [MMK]' },
  { value: 'PHP', label: 'PHILIPPINE PESO [PHP]' },
  { value: 'BND', label: 'BRUNEI DOLLAR [BND]' },
  { value: 'CAD', label: 'CANADIAN DOLLAR [CAD]' },
  { value: 'CHF', label: 'SWISS FRANC [CHF]' },
  { value: 'DKK', label: 'DANISH KRONE [DKK]' },
  { value: 'NZD', label: 'NEW ZEALAND DOLLAR [NZD]' },
  { value: 'SEK', label: 'SWEDISH KRONA [SEK]' },
  { value: 'ZAR', label: 'RAND [ZAR]' },
  { value: 'AED', label: 'DIRHAM [AED]' },
  { value: 'SAR', label: 'SAUDI RIYAL [SAR]' },
  { value: 'QAR', label: 'QATARI RIAL [QAR]' },
  { value: 'KWD', label: 'KUWAITI DINAR [KWD]' },
  { value: 'BHD', label: 'BAHRAINI DINAR [BHD]' },
  { value: 'OMR', label: 'RIAL OMANI [OMR]' },
  { value: 'JOD', label: 'JORDANIAN DINAR [JOD]' },
  { value: 'RUB', label: 'RUSSIAN RUBLE [RUB]' },
  { value: 'TRY', label: 'TURKISH LIRA [TRY]' },
  { value: 'BRL', label: 'BRAZILIAN REAL [BRL]' },
  { value: 'MXN', label: 'MEXICAN PESO [MXN]' },
  { value: 'PLN', label: 'ZLOTY [PLN]' },
];

// Countries
export const COUNTRIES = [
  { value: 'AF', label: 'AFGHANISTAN' },
  { value: 'AL', label: 'ALBANIA' },
  { value: 'DZ', label: 'ALGERIA' },
  { value: 'AS', label: 'AMERICAN SAMOA' },
  { value: 'AD', label: 'ANDORRA' },
  { value: 'AO', label: 'ANGOLA' },
  { value: 'AI', label: 'ANGUILLA' },
  { value: 'AG', label: 'ANTIGUA AND BARBUDA' },
  { value: 'AR', label: 'ARGENTINA' },
  { value: 'AM', label: 'ARMENIA' },
  { value: 'AW', label: 'ARUBA' },
  { value: 'AU', label: 'AUSTRALIA' },
  { value: 'AT', label: 'AUSTRIA' },
  { value: 'AZ', label: 'AZERBAIJAN' },
  { value: 'BS', label: 'BAHAMAS' },
  { value: 'BH', label: 'BAHRAIN' },
  { value: 'BD', label: 'BANGLADESH' },
  { value: 'BB', label: 'BARBADOS' },
  { value: 'BY', label: 'BELARUS' },
  { value: 'BE', label: 'BELGIUM' },
  { value: 'BZ', label: 'BELIZE' },
  { value: 'BJ', label: 'BENIN' },
  { value: 'BM', label: 'BERMUDA' },
  { value: 'BT', label: 'BHUTAN' },
  { value: 'BO', label: 'BOLIVIA' },
  { value: 'BA', label: 'BOSNIA and HERZEGOVINA' },
  { value: 'BW', label: 'BOTSWANA' },
  { value: 'BV', label: 'BOUVET ISLAND' },
  { value: 'BR', label: 'BRAZIL' },
  { value: 'IO', label: 'BRITISH INDIAN OCEAN TERRITORY' },
  { value: 'BN', label: 'BRUNEI DARUSSALAM' },
  { value: 'BG', label: 'BULGARIA' },
  { value: 'BF', label: 'BURKINA FASO' },
  { value: 'BI', label: 'BURUNDI' },
  { value: 'KH', label: 'CAMBODIA' },
  { value: 'CM', label: 'CAMEROON' },
  { value: 'CA', label: 'CANADA' },
  { value: 'CV', label: 'CAPE VERDE' },
  { value: 'KY', label: 'CAYMAN ISLANDS' },
  { value: 'CF', label: 'CENTRAL AFRICAN REP' },
  { value: 'TD', label: 'CHAD' },
  { value: 'CL', label: 'CHILE' },
  { value: 'CN', label: 'CHINA' },
  { value: 'CX', label: 'CHRISTMAS ISLAND' },
  { value: 'CC', label: 'COCOS (KEELING) IS.S' },
  { value: 'CO', label: 'COLOMBIA' },
  { value: 'KM', label: 'COMOROS' },
  { value: 'CK', label: 'COOK ISLANDS' },
  { value: 'CR', label: 'COSTA RICA' },
  { value: 'CI', label: 'COTE D IVOIRE' },
  { value: 'CU', label: 'CUBA' },
  { value: 'CW', label: 'CURACAO' },
  { value: 'CY', label: 'CYPRUS' },
  { value: 'CZ', label: 'CZECH REPUBLIC' },
  { value: 'CD', label: 'DEMOCRATIC REPUBLIC OF CONGO' },
  { value: 'DK', label: 'DENMARK' },
  { value: 'DJ', label: 'DJIBOUTI' },
  { value: 'DM', label: 'DOMINICA' },
  { value: 'DO', label: 'DOMINICAN REPUBLIC' },
  { value: 'TP', label: 'EAST TIMOR' },
  { value: 'EC', label: 'ECUADOR' },
  { value: 'EG', label: 'EGYPT' },
  { value: 'SV', label: 'EL SALVADOR' },
  { value: 'GQ', label: 'EQUATORIAL GUINEA' },
  { value: 'ER', label: 'ERITREA' },
  { value: 'EE', label: 'ESTONIA' },
  { value: 'ET', label: 'ETHIOPIA' },
  { value: 'FK', label: 'FALKLAND ISLANDS' },
  { value: 'FO', label: 'FAROE ISLANDS' },
  { value: 'FJ', label: 'FIJI' },
  { value: 'FI', label: 'FINLAND' },
  { value: 'FR', label: 'FRANCE' },
  { value: 'GA', label: 'GABON' },
  { value: 'GM', label: 'GAMBIA' },
  { value: 'GE', label: 'GEORGIA' },
  { value: 'DE', label: 'GERMANY' },
  { value: 'GH', label: 'GHANA' },
  { value: 'GI', label: 'GIBRALTAR' },
  { value: 'GR', label: 'GREECE' },
  { value: 'GL', label: 'GREENLAND' },
  { value: 'GD', label: 'GRENADA' },
  { value: 'GP', label: 'GUADELOUPE' },
  { value: 'GU', label: 'GUAM' },
  { value: 'GT', label: 'GUATEMALA' },
  { value: 'GN', label: 'GUINEA' },
  { value: 'GW', label: 'GUINEA-BISSAU' },
  { value: 'GY', label: 'GUYANA' },
  { value: 'HT', label: 'HAITI' },
  { value: 'HN', label: 'HONDURAS' },
  { value: 'HK', label: 'HONG KONG' },
  { value: 'HU', label: 'HUNGARY' },
  { value: 'IS', label: 'ICELAND' },
  { value: 'IN', label: 'INDIA' },
  { value: 'ID', label: 'INDONESIA' },
  { value: 'IR', label: 'IRAN' },
  { value: 'IQ', label: 'IRAQ' },
  { value: 'IE', label: 'IRELAND' },
  { value: 'IL', label: 'ISRAEL' },
  { value: 'IT', label: 'ITALY' },
  { value: 'JM', label: 'JAMAICA' },
  { value: 'JP', label: 'JAPAN' },
  { value: 'JO', label: 'JORDAN' },
  { value: 'KZ', label: 'KAZAKHSTAN' },
  { value: 'KE', label: 'KENYA' },
  { value: 'KI', label: 'KIRIBATI' },
  { value: 'KP', label: 'KOREA, DEMOCRATIC PEOPLE S REPUBLIC OF' },
  { value: 'KR', label: 'KOREA, REPUBLIC OF' },
  { value: 'KW', label: 'KUWAIT' },
  { value: 'KG', label: 'KYRGYZSTAN' },
  { value: 'LA', label: 'LAO PEOPLE S DEMOCRATIC REPUBLIC' },
  { value: 'LV', label: 'LATVIA' },
  { value: 'LB', label: 'LEBANON' },
  { value: 'LS', label: 'LESOTHO' },
  { value: 'LR', label: 'LIBERIA' },
  { value: 'LY', label: 'LIBYAN ARAB JAMAHIRIYA' },
  { value: 'LI', label: 'LIECHTENSTEIN' },
  { value: 'LT', label: 'LITHUANIA' },
  { value: 'LU', label: 'LUXEMBOURG' },
  { value: 'MO', label: 'MACAO' },
  { value: 'MK', label: 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF' },
  { value: 'MG', label: 'MADAGASCAR' },
  { value: 'MW', label: 'MALAWI' },
  { value: 'MY', label: 'MALAYSIA' },
  { value: 'MV', label: 'MALDIVES' },
  { value: 'ML', label: 'MALI' },
  { value: 'MT', label: 'MALTA' },
  { value: 'MH', label: 'MARSHALL ISLANDS' },
  { value: 'MQ', label: 'MARTINIQUE' },
  { value: 'MR', label: 'MAURITANIA' },
  { value: 'MU', label: 'MAURITIUS' },
  { value: 'YT', label: 'MAYOTTE' },
  { value: 'MX', label: 'MEXICO' },
  { value: 'FM', label: 'MICRONESIA, FEDERATED STATES OF' },
  { value: 'MD', label: 'MOLDOVA, REPUBLIC OF' },
  { value: 'MC', label: 'MONACO' },
  { value: 'MN', label: 'MONGOLIA' },
  { value: 'ME', label: 'MONTENEGRO' },
  { value: 'MS', label: 'MONTSERRAT' },
  { value: 'MA', label: 'MOROCCO' },
  { value: 'MZ', label: 'MOZAMBIQUE' },
  { value: 'MM', label: 'MYANMAR' },
  { value: 'NA', label: 'NAMIBIA' },
  { value: 'NR', label: 'NAURU' },
  { value: 'NP', label: 'NEPAL' },
  { value: 'NL', label: 'NETHERLANDS' },
  { value: 'NC', label: 'NEW CALEDONIA' },
  { value: 'NZ', label: 'NEW ZEALAND' },
  { value: 'NI', label: 'NICARAGUA' },
  { value: 'NE', label: 'NIGER' },
  { value: 'NG', label: 'NIGERIA' },
  { value: 'NU', label: 'NIUE' },
  { value: 'NF', label: 'NORFOLK ISLAND' },
  { value: 'MP', label: 'NORTHERN MARIANA ISLANDS' },
  { value: 'NO', label: 'NORWAY' },
  { value: 'OM', label: 'OMAN' },
  { value: 'PK', label: 'PAKISTAN' },
  { value: 'PW', label: 'PALAU' },
  { value: 'PS', label: 'PALESTINIAN TERRITORY, OCCUPIED' },
  { value: 'PA', label: 'PANAMA' },
  { value: 'PG', label: 'PAPUA NEW GUINEA' },
  { value: 'PY', label: 'PARAGUAY' },
  { value: 'PE', label: 'PERU' },
  { value: 'PH', label: 'PHILIPPINES' },
  { value: 'PN', label: 'PITCAIRN' },
  { value: 'PL', label: 'POLAND' },
  { value: 'PT', label: 'PORTUGAL' },
  { value: 'PR', label: 'PUERTO RICO' },
  { value: 'QA', label: 'QATAR' },
  { value: 'RE', label: 'REUNION' },
  { value: 'RO', label: 'ROMANIA' },
  { value: 'RU', label: 'RUSSIAN FEDERATION' },
  { value: 'RW', label: 'RWANDA' },
  { value: 'BL', label: 'SAINT BARTHELEMY' },
  { value: 'SH', label: 'SAINT HELENA' },
  { value: 'KN', label: 'SAINT KITTS AND NEVIS' },
  { value: 'LC', label: 'SAINT LUCIA' },
  { value: 'MF', label: 'SAINT MARTIN' },
  { value: 'PM', label: 'SAINT PIERRE AND MIQUELON' },
  { value: 'VC', label: 'SAINT VINCENT AND THE GRENADINES' },
  { value: 'WS', label: 'SAMOA' },
  { value: 'SM', label: 'SAN MARINO' },
  { value: 'ST', label: 'SAO TOME AND PRINCIPE' },
  { value: 'SA', label: 'SAUDI ARABIA' },
  { value: 'SN', label: 'SENEGAL' },
  { value: 'RS', label: 'SERBIA' },
  { value: 'SC', label: 'SEYCHELLES' },
  { value: 'SL', label: 'SIERRA LEONE' },
  { value: 'SG', label: 'SINGAPORE' },
  { value: 'SX', label: 'SINT MAARTEN' },
  { value: 'SK', label: 'SLOVAKIA' },
  { value: 'SI', label: 'SLOVENIA' },
  { value: 'SB', label: 'SOLOMON ISLANDS' },
  { value: 'SO', label: 'SOMALIA' },
  { value: 'ZA', label: 'SOUTH AFRICA' },
  { value: 'GS', label: 'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS' },
  { value: 'SS', label: 'SOUTH SUDAN' },
  { value: 'ES', label: 'SPAIN' },
  { value: 'LK', label: 'SRI LANKA' },
  { value: 'SD', label: 'SUDAN' },
  { value: 'SR', label: 'SURINAME' },
  { value: 'SJ', label: 'SVALBARD AND JAN MAYEN' },
  { value: 'SZ', label: 'SWAZILAND' },
  { value: 'SE', label: 'SWEDEN' },
  { value: 'CH', label: 'SWITZERLAND' },
  { value: 'SY', label: 'SYRIAN ARAB REPUBLIC' },
  { value: 'TW', label: 'TAIWAN, PROVINCE OF CHINA' },
  { value: 'TJ', label: 'TAJIKISTAN' },
  { value: 'TZ', label: 'TANZANIA, UNITED REPUBLIC OF' },
  { value: 'TH', label: 'THAILAND' },
  { value: 'TL', label: 'TIMOR-LESTE' },
  { value: 'TG', label: 'TOGO' },
  { value: 'TK', label: 'TOKELAU' },
  { value: 'TO', label: 'TONGA' },
  { value: 'TT', label: 'TRINIDAD AND TOBAGO' },
  { value: 'TN', label: 'TUNISIA' },
  { value: 'TR', label: 'TURKEY' },
  { value: 'TM', label: 'TURKMENISTAN' },
  { value: 'TC', label: 'TURKS AND CAICOS ISLANDS' },
  { value: 'TV', label: 'TUVALU' },
  { value: 'UG', label: 'UGANDA' },
  { value: 'UA', label: 'UKRAINE' },
  { value: 'AE', label: 'UNITED ARAB EMIRATES' },
  { value: 'GB', label: 'UNITED KINGDOM' },
  { value: 'US', label: 'UNITED STATES' },
  { value: 'UM', label: 'UNITED STATES MINOR OUTLYING ISLANDS' },
  { value: 'UY', label: 'URUGUAY' },
  { value: 'UZ', label: 'UZBEKISTAN' },
  { value: 'VU', label: 'VANUATU' },
  { value: 'VE', label: 'VENEZUELA' },
  { value: 'VN', label: 'VIET NAM' },
  { value: 'VG', label: 'VIRGIN ISLANDS, BRITISH' },
  { value: 'VI', label: 'VIRGIN ISLANDS, U.S.' },
  { value: 'WF', label: 'WALLIS AND FUTUNA' },
  { value: 'EH', label: 'WESTERN SAHARA' },
  { value: 'YE', label: 'YEMEN' },
  { value: 'ZM', label: 'ZAMBIA' },
  { value: 'ZW', label: 'ZIMBABWE' }
];

export const WEIGHT_UNITS = [
  { value: 'KGM', label: 'KILOGRAM (KGM)' },
  { value: 'TNE', label: 'TONNE (METRIC TON) (TNE)' },
  { value: 'LBR', label: 'POUND [LBR]' },
  { value: 'GRM', label: 'GRAM [GRM]' }
];

export const PACKAGE_UNITS = [
  { value: '1A', label: '1A - DRUM, STEEL' },
// ... (rest of the package units would be here)
  { value: 'CT', label: 'CT - CARTON' },
  { value: 'BX', label: 'BX - BOX' },
  { value: 'PK', label: 'PK - PACKAGE' },
  { value: 'BG', label: 'BG - BAG' },
  { value: 'DR', label: 'DR - DRUM' },
  { value: 'PL', label: 'PL - PAIL' },
  { value: 'PX', label: 'PX - PALLET' }
];

export const MEASUREMENT_UNITS = [
  { value: 'C62', label: 'C62 - UNIT' },
  { value: 'DZN', label: 'DZN - DOZEN' },
  { value: 'KGM', label: 'KGM - KILOGRAM' },
  { value: 'MTR', label: 'MTR - METRE' },
  { value: 'LTR', label: 'LTR - LITRE' },
  { value: 'BG', label: 'BG - BAG' },
  // ... include other units
];
