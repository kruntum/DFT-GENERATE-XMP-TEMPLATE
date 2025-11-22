
import { SmartCOData, GeneratedResponse } from '../types';

// Helper: Generate UUID (v4)
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper: Format Date to ISO string (YYYY-MM-DDTHH:mm:ss.000Z)
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    return '';
  } catch (e) {
    return '';
  }
};

// Helper: XML Tag Builder
const t = (tagName: string, value: string | number | boolean | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return `\t<${tagName}/>`;
  }
  if (typeof value === 'boolean') {
    return `\t<${tagName}>${value}</${tagName}>`;
  }
  return `\t<${tagName}>${value}</${tagName}>`;
};

export const generateSmartCOXML = async (data: SmartCOData): Promise<GeneratedResponse> => {
  const logs: string[] = [];
  logs.push("Start generating XML (Library Mode)...");

  // 1. Use Explicit Invoices from Data
  // Map invoices to include UUIDs if not already present (using ID as proxy)
  const processedInvoices = data.invoices.map(inv => ({
      uuid: generateUUID(), // Generate new UUID for XML
      id: inv.id,
      no: inv.invoiceNo,
      date: inv.invoiceDate,
      type: inv.invoiceType
  }));
  
  logs.push(`Processed ${processedInvoices.length} invoices.`);

  // 2. Process Shipping Marks
  // Generate UUIDs for each shipping mark
  const processedMarks = data.shippingMarksList.map(sm => ({
      uuid: generateUUID(),
      id: sm.id,
      mark: sm.mark
  }));
  
  logs.push(`Processed ${processedMarks.length} shipping marks.`);

  // 3. Calculate Totals
  let totalNetWeight = 0;
  let totalQuantity = 0;

  // 4. Build Product XML Blocks
  const productXmls = data.products.map((p, index) => {
    const netW = parseFloat(p.netWeight || '0');
    const qty = parseFloat(p.quantity || '0');

    if (!isNaN(netW)) totalNetWeight += netW;
    if (!isNaN(qty)) totalQuantity += qty;

    // Determine which invoices to link to this product
    // Find the invoice by the linked ID stored in the product item
    
    let linkedThaiInvoice = processedInvoices.find(i => i.id === p.linkedInvoiceId);
    
    // If not found (edge case), try to find the first Thai Invoice
    if (!linkedThaiInvoice) {
        linkedThaiInvoice = processedInvoices.find(i => i.type === 'INVOICE_THAI');
    }
    
    // Safety fallback
    if (!linkedThaiInvoice) {
        linkedThaiInvoice = { uuid: generateUUID(), id: 'temp', no: '', date: '', type: 'INVOICE_THAI' };
    }

    // Handle Abroad Invoice (if Third Party)
    let linkedAbroadInvoice = null;
    if (data.specialConditions.thirdPartyInvoicing) {
        linkedAbroadInvoice = processedInvoices.find(i => i.id === p.linkedAbroadInvoiceId);
        if (!linkedAbroadInvoice) {
             // Fallback
             linkedAbroadInvoice = processedInvoices.find(i => i.type !== 'INVOICE_THAI');
        }
    }
    
    // If still null but needed
    if (data.specialConditions.thirdPartyInvoicing && !linkedAbroadInvoice) {
         linkedAbroadInvoice = { uuid: generateUUID(), id: 'temp-abroad', no: '', date: '', type: 'INVOICE_ABROAD' };
    }

    // Link to Shipping Mark UUID
    let markUuid = '';
    const linkedMark = processedMarks.find(m => m.id === p.selectedShippingMarkId);
    if (linkedMark) {
        markUuid = linkedMark.uuid;
    } else if (processedMarks.length > 0) {
        // Fallback to first mark
        markUuid = processedMarks[0].uuid;
    } else {
        // Should ideally not happen if validation is in place, but generate a random one
        markUuid = generateUUID();
    }

    return `
    <docRequestProducts>
        <productUuid>${generateUUID()}</productUuid>
        <docRequestInvoiceAboardUuid>${data.specialConditions.thirdPartyInvoicing && linkedAbroadInvoice ? linkedAbroadInvoice.uuid : ''}</docRequestInvoiceAboardUuid>
        <orderInInvoiceAboard>${data.specialConditions.thirdPartyInvoicing ? (index + 1) : ''}</orderInInvoiceAboard>
        <docRequestInvoiceAboard>
            <value>${data.specialConditions.thirdPartyInvoicing && linkedAbroadInvoice ? linkedAbroadInvoice.uuid : ''}</value>
            <uuid>${data.specialConditions.thirdPartyInvoicing && linkedAbroadInvoice ? linkedAbroadInvoice.uuid : ''}</uuid>
            <invoiceNo>${data.specialConditions.thirdPartyInvoicing && linkedAbroadInvoice ? linkedAbroadInvoice.no : ''}</invoiceNo>
            <invoiceDate>${data.specialConditions.thirdPartyInvoicing && linkedAbroadInvoice ? formatDate(linkedAbroadInvoice.date) : ''}</invoiceDate>
            <invoiceType>${data.specialConditions.thirdPartyInvoicing && linkedAbroadInvoice ? linkedAbroadInvoice.type : ''}</invoiceType>
        </docRequestInvoiceAboard>
        <docRequestInvoiceUuid>${linkedThaiInvoice.uuid}</docRequestInvoiceUuid>
        <orderInInvoice>${index + 1}</orderInInvoice>
        <docRequestInvoice>
            <value>${linkedThaiInvoice.uuid}</value>
            <uuid>${linkedThaiInvoice.uuid}</uuid>
            <invoiceNo>${linkedThaiInvoice.no}</invoiceNo>
            <invoiceDate>${formatDate(linkedThaiInvoice.date)}</invoiceDate>
            <invoiceType>${linkedThaiInvoice.type}</invoiceType>
        </docRequestInvoice>
        <maskUuid>${markUuid}</maskUuid>
        <stockBackToBackSourceCountry/>
        <stockBackToBackId/>
        <stockBackToBackProductId/>
        ${t('productTariffCode', p.hsCode)}
        <hsCostType/>
        <hsTaxId/>
        <hsCompanyAgreeToJoin/>
        <hsRefNo/>
        <hsDate/>
        <hsCountry/>
        <hsModel/>
        <hsFactory/>
        <showHsFactory>false</showHsFactory>
        ${t('productName', p.nameTh)}
        ${t('productNameEng', p.nameEn)}
        ${t('productDescription', p.description)}
        <showWeightTypeNetWeightChecked>${p.showNetWeight}</showWeightTypeNetWeightChecked>
        <showWeightTypeGrossWeightChecked>${p.showGrossWeight}</showWeightTypeGrossWeightChecked>
        <showWeightTypeOtherQuantityChecked>${p.showOtherQuantity}</showWeightTypeOtherQuantityChecked>
        ${t('qtyPackage', p.qtyPackage)}
        ${t('qtyPackageUnitCode', p.qtyPackageUnit)}
        ${t('netWeight', p.netWeight)}
        ${t('netWeightUnit', p.netWeightUnit)}
        ${t('grossWeight', p.grossWeight)}
        ${t('grossWeightUnit', p.grossWeightUnit)}
        ${t('quantity', p.quantity)}
        ${t('quantityUnit', p.quantityUnit)}
        ${t('valueFobUs', p.fobValue)}
        ${t('valueFobUsOther', p.fobValueOther)}
        <invoiceOtherCountryChecked>${!!p.invoiceOtherCountryValue}</invoiceOtherCountryChecked>
        ${t('invoiceOtherCountryUsValue', p.invoiceOtherCountryValue)}
        ${t('rule', p.originCriteria)}
        ${t('ruleOnOutput', p.originCriteria)}
        ${t('rulePercent', p.originCriteriaPercent)}
        <ruleCriteriaOrOther/>
        <ruleCriteriaOrOther2/>
        <rcepCountryOfOrigin/>
        <rcepCountryOfOriginDestRemark/>
    </docRequestProducts>`;
  }).join('');

  // 5. Build Invoice List XML
  const invoiceListXml = processedInvoices.map(inv => `
    <docRequestInvoices>
        <uuid>${inv.uuid}</uuid>
        <invoiceNo>${inv.no}</invoiceNo>
        <invoiceDate>${formatDate(inv.date)}</invoiceDate>
        <invoiceType>${inv.type}</invoiceType>
    </docRequestInvoices>`).join('');

  // 6. Build Shipping Marks XML
  const shippingMarksXml = processedMarks.map(sm => `
    <docRequestMarks>
        <uuid>${sm.uuid}</uuid>
        ${t('mark', sm.mark)}
    </docRequestMarks>`).join('');

  // Determine Final Quantity (User Override > Calculated)
  const finalQuantity = data.totalQuantityValue ? data.totalQuantityValue : totalQuantity;
  const finalUnit = data.totalQuantityUnit ? data.totalQuantityUnit : (data.products[0]?.quantityUnit || 'BG');

  logs.push("Constructing final XML structure...");

  // 7. Assemble Full XML
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<docRequest>
${t('formId', data.formId)}
    <!--หัวข้อที่ 1 ผู้ขอ -->
${t('companyName', data.exporter.name)}
${t('companyTaxNo', data.exporter.taxId)}
${t('companyEmail', data.exporter.email)}
${t('destRemark', data.exporter.destRemark)}
${t('obCompany', data.exporter.obCompany)}
${t('obAddress', data.exporter.obAddress)}
${t('obPhone', data.exporter.obPhone)}
${t('obFax', data.exporter.obFax)}
${t('emailCh01', data.exporter.emailCh01)}
${t('dftOfficeId', data.exporter.dftOfficeId)}
${t('radBy', data.exporter.radBy)}
${t('tranBy', data.exporter.tranBy)}
    <!--หัวข้อที่ 2 ผู้ซื้อหรือผู้รับประเทศปลายทาง -->
${t('receiveCompany', data.importer.name)}
${t('receiveTaxId', data.importer.taxId)}
${t('importerId', data.importer.importerId)}
${t('receiveAddress', data.importer.address)}
${t('receiveCity', data.importer.city)}
${t('destinationCountry', data.importer.country)}
${t('destinationPhone', data.importer.phone)}
${t('destinationFax', data.importer.fax)}
${t('destinationEmail', data.importer.email)}
${t('receiveDestRemark', data.importer.destRemark)}
${t('receiveObCompanyName', data.importer.obCompany)}
${t('receiveObAddress', data.importer.obAddress)}
${t('receivePhone', data.importer.phone)}
${t('receiveFax', data.importer.fax)}
${t('receiveEmail', data.importer.email)}
    <!--หัวข้อที่ 3 เส้นทางการขนส่ง-->
${t('departureDate', formatDate(data.transport.departureDate))}
    <docRequestVehicle>
        ${t('vehicleUuid', data.transport.vehicleUuid || generateUUID())}
        ${t('orderNo', data.transport.orderNo)}
        ${t('shipBy', data.transport.shipBy)}
        ${t('shipByOther', data.transport.shipByOther)}
        ${t('vehicleName', data.transport.vehicleName)}
        ${t('billType', data.transport.billType)}
        ${t('billNo', data.transport.billRefNo)}
        ${t('sailingDate', formatDate(data.transport.sailingDate))}
    </docRequestVehicle>
${t('transportBy', data.transport.transportBy)}
${t('vehicleNameList', data.transport.vehicleNameList || data.transport.vehicleName)}
${t('placeDeparture', data.transport.placeDeparture)}
${t('portDischargeLink', data.transport.portDischargeLink)}
${t('portDischargeEdit', data.transport.portDischarge)}
    <!--หัวข้อที่ 4  เลือกกรณีใช้เงื่อนไขพิเศษเพิ่มเติม-->
${t('brokerInThaiNotRuleChecked', data.specialConditions.brokerInThaiNotRuleChecked)}
${t('brokerTax', data.specialConditions.brokerTax)}
${t('brokerCompanyName', data.specialConditions.brokerCompanyName)}
${t('thirdPartyInvoicingChecked', data.specialConditions.thirdPartyInvoicing)}
    <docRequestThirdPartyInvoicing>
        ${t('thirdPartyInvoicingUuid', data.specialConditions.thirdPartyInvoicing ? (data.specialConditions.thirdPartyInvoicingUuid || generateUUID()) : '')}
        ${t('thirdPartyInvoicingCompany', data.specialConditions.thirdPartyInvoicingCompany)}
        ${t('thirdPartyInvoicingAddress1', data.specialConditions.thirdPartyInvoicingAddress1)}
        ${t('thirdPartyInvoicingAddress2', data.specialConditions.thirdPartyInvoicingAddress2)}
        ${t('thirdPartyInvoicingAddress3', data.specialConditions.thirdPartyInvoicingAddress3)}
        ${t('thirdPartyInvoicingAddress4', data.specialConditions.thirdPartyInvoicingAddress4)}
        ${t('thirdPartyInvoicingCountry', data.specialConditions.thirdPartyInvoicingCountry)}
    </docRequestThirdPartyInvoicing>
${t('accumulationChecked', data.specialConditions.accumulationChecked)}
${t('backToBackChecked', data.specialConditions.backToBack)}
${t('backToBackSourceCountry', data.specialConditions.backToBackSourceCountry)}
${t('partialCumulationChecked', data.specialConditions.partialCumulationChecked)}
${t('exhibitionsChecked', data.specialConditions.exhibitions)}
${t('exhibitionsName', data.specialConditions.exhibitionsName)}
${t('exhibitionsPlace', data.specialConditions.exhibitionsPlace)}
${t('exhibitionsCountry', data.specialConditions.exhibitionsCountry)}
${t('deMinimisChecked', data.specialConditions.deMinimis)}
    <!--หัวข้อที่ 5 รายการสินค้า-->
    <productCurrency>${data.productCurrency}</productCurrency>
    ${t('productInvoiceShowInCol10', data.specialConditions.thirdPartyInvoicing ? (data.productInvoiceShowInCol10 || 'INVOICE_ABROAD') : '')}
${invoiceListXml}
${shippingMarksXml}
    <beforeHsCode/>
${productXmls}
${t('showTotalValueFobUs', data.showTotalValueFobUs)}
${t('showTotalValueFobUsOther', data.showTotalValueFobUsOther)}
${t('showTotalInvoiceOtherCountryUsValue', data.showTotalInvoiceOtherCountryUsValue)}
${t('showTotalInvoiceBrokerUsValue', data.showTotalInvoiceBrokerUsValue)}
${t('showTotalNetWeight', data.showTotalNetWeight)}
${t('showTotalQuantity', data.showTotalQuantity)}
    <docRequestQuantities>
        <quantityUuid>${generateUUID()}</quantityUuid>
${t('quantity', finalQuantity)}
${t('unitCode', finalUnit)}
    </docRequestQuantities>
${t('requestDescription', data.requestDescription)}
</docRequest>`;

  return {
    xml: xmlContent,
    logs: logs
  };
};

export const lookupHSCode = async (description: string): Promise<string> => {
  return "";
};
