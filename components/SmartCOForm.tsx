
import React, { useState, useMemo } from 'react';
import { SmartCOData, TRANSPORT_MODES, COUNTRIES, WEIGHT_UNITS, PACKAGE_UNITS, MEASUREMENT_UNITS, ProductItem, CURRENCIES, InvoiceItem, ShippingMarkItem } from '../types';

interface Props {
  onSubmit: (data: SmartCOData) => void;
  isLoading: boolean;
}

// Data for DFT Offices based on the provided table and screenshot
const DFT_OFFICES_CENTRAL = [
    { id: '1', code: '97Z', name: 'สำนักบริการการค้าต่างประเทศ (ส่วนกลาง)' }
];

const DFT_OFFICES_PROVINCIAL = [
    { id: '4', code: '99K', name: 'สพจ.ชลบุรี' },
    { id: '10', code: '99J', name: 'สพจ.เชียงราย' },
    { id: '2', code: '99I', name: 'สพจ.เชียงใหม่' },
    { id: '5', code: '97N', name: 'สพจ.ตาก' },
    { id: '9', code: '98A', name: 'สพจ.นครพนม' },
    { id: '15', code: '98F', name: 'สพจ.นราธิวาส' },
    { id: '12', code: '98T', name: 'สพจ.ภูเก็ต' },
    { id: '7', code: '99X', name: 'สพจ.มุกดาหาร' },
    { id: '14', code: '97U', name: 'สพจ.ยะลา' },
    { id: '11', code: '99S', name: 'สพจ.ลำพูน' },
    { id: '3', code: '97I', name: 'สพจ.สงขลา' },
    { id: '13', code: '97F', name: 'สพจ.สตูล' },
    { id: '6', code: '97A', name: 'สพจ.สระแก้ว' },
    { id: '8', code: '98H', name: 'สพจ.หนองคาย' },
];

const SmartCOForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [showExporterDetails, setShowExporterDetails] = useState(false);
  const [showImporterDetails, setShowImporterDetails] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [data, setData] = useState<SmartCOData>({
    formId: '35',
    exporter: { 
        name: 'KING FRUIT INTERTRADE CO., LTD.', 
        address: '60 MOO 11, TOK PHROM SUB-DISTRICT, KHLUNG DISTRICT, CHANTHABURI PROVINCE, 22110', 
        phone: '063-8794616', 
        taxId: '0225568000512', 
        email: '',
        destRemark: '',
        obCompany: '',
        obAddress: '',
        obPhone: '',
        obFax: '',
        emailCh01: '',
        dftOfficeId: '1', // Default to Central
        radBy: '',
        tranBy: ''
    },
    importer: { 
        name: 'SHENZHEN HUISHENGHUO FOOD SUPPLY CHAIN CO., LTD', 
        address: '713, BUILDING 1, NO.101, LIANYUN ROAD, XINMU COMMUNITY, PINGHU STREET, LONGGANG DISTRICT', 
        country: 'CN', 
        phone: '', 
        fax: '', 
        email: '',
        taxId: '',
        importerId: '',
        city: 'SHENZHEN',
        destRemark: '',
        obCompany: '',
        obAddress: ''
    },
    transport: {
      departureDate: new Date().toISOString().split('T')[0],
      transportBy: 'BY SEA FREIGHT',
      vehicleName: 'TS TIANJIN V. 25012N',
      portDischarge: 'QINGDAO',
      billRefNo: 'TH01081277',
      vehicleUuid: '5fc503e5-8dbf-43ee-8a91-8eb4153e87db',
      orderNo: '1',
      shipBy: '1',
      shipByOther: '',
      billType: 'B/L',
      sailingDate: new Date().toISOString().split('T')[0],
      vehicleNameList: '',
      placeDeparture: 'LAEM CHABANG',
      portDischargeLink: ''
    },
    specialConditions: {
        thirdPartyInvoicing: false,
        backToBack: false,
        exhibitions: false,
        deMinimis: false,
        brokerInThaiNotRuleChecked: false,
        brokerTax: '',
        brokerCompanyName: '',
        thirdPartyInvoicingUuid: '',
        thirdPartyInvoicingCompany: '',
        thirdPartyInvoicingAddress1: '',
        thirdPartyInvoicingAddress2: '',
        thirdPartyInvoicingAddress3: '',
        thirdPartyInvoicingAddress4: '',
        thirdPartyInvoicingCountry: '',
        accumulationChecked: false,
        partialCumulationChecked: false,
        backToBackSourceCountry: '',
        exhibitionsName: '',
        exhibitionsPlace: '',
        exhibitionsCountry: ''
    },
    invoices: [],
    prevFormNo: '',
    prevFormDate: '',
    // Initialize with one default shipping mark
    shippingMarksList: [
        { id: 'sm_default', mark: 'FROZEN\nDURIAN' }
    ],
    products: [],
    productCurrency: 'USD',
    productInvoiceShowInCol10: 'INVOICE_ABROAD',
    showTotalValueFobUs: false,
    showTotalValueFobUsOther: false,
    showTotalInvoiceOtherCountryUsValue: false,
    showTotalInvoiceBrokerUsValue: false,
    showTotalNetWeight: true,
    showTotalQuantity: true,
    totalQuantityValue: '',
    totalQuantityUnit: '',
    requestDescription: ''
  });

  // Expanded state for new product entry
  const [newProduct, setNewProduct] = useState<ProductItem>({
    id: '',
    nameTh: '',
    nameEn: '',
    description: '',
    brand: '',
    model: '',
    hsCode: '',
    originCriteria: 'WO',
    originCriteriaPercent: '',
    
    netWeight: '',
    netWeightUnit: 'KGM',
    grossWeight: '',
    grossWeightUnit: 'KGM',
    quantity: '', // Other Quantity
    quantityUnit: 'BG',
    qtyPackage: '',
    qtyPackageUnit: 'CT',

    showNetWeight: true,
    showGrossWeight: true,
    showOtherQuantity: false,

    fobValue: '',
    fobValueOther: '',
    
    // Legacy / Linked
    invoiceNo: '', 
    invoiceDate: new Date().toISOString().split('T')[0],
    linkedInvoiceId: '',
    linkedAbroadInvoiceId: '',
    
    // Link to Shipping Mark
    selectedShippingMarkId: '',

    invoiceOtherCountryValue: ''
  });

  // State for new invoice
  const [newInvoice, setNewInvoice] = useState<{no: string, date: string, type: string}>({
      no: '',
      date: new Date().toISOString().split('T')[0],
      type: 'INVOICE_THAI'
  });

  // Calculate totals for display
  const { totalFob, totalNetWeight } = useMemo(() => {
      return data.products.reduce((acc, p) => ({
          totalFob: acc.totalFob + (parseFloat(p.fobValue) || 0),
          totalNetWeight: acc.totalNetWeight + (parseFloat(p.netWeight) || 0)
      }), { totalFob: 0, totalNetWeight: 0 });
  }, [data.products]);

  const handleExporterChange = (f: string, v: string) => setData(p => ({ ...p, exporter: { ...p.exporter, [f]: v } }));
  const handleImporterChange = (f: string, v: string) => setData(p => ({ ...p, importer: { ...p.importer, [f]: v } }));
  const handleTransportChange = (f: string, v: string) => setData(p => ({ ...p, transport: { ...p.transport, [f]: v } }));
  
  const toggleCondition = (key: keyof typeof data.specialConditions) => {
      setData(p => ({ ...p, specialConditions: { ...p.specialConditions, [key]: !p.specialConditions[key] } }));
  };

  const handleSpecialConditionChange = (f: string, v: string) => {
      setData(p => ({ ...p, specialConditions: { ...p.specialConditions, [f]: v } }));
  };

  const handleAddInvoice = () => {
      if (!newInvoice.no) return alert('กรุณาระบุเลขที่ Invoice');
      setData(p => ({
          ...p,
          invoices: [...p.invoices, { id: Date.now().toString(), invoiceNo: newInvoice.no, invoiceDate: newInvoice.date, invoiceType: newInvoice.type }]
      }));
      setNewInvoice({ no: '', date: new Date().toISOString().split('T')[0], type: data.specialConditions.thirdPartyInvoicing ? 'INVOICE_ABROAD' : 'INVOICE_THAI' });
  };

  const handleDeleteInvoice = (id: string) => {
      setData(p => ({ ...p, invoices: p.invoices.filter(i => i.id !== id) }));
  };

  // Shipping Mark Handlers
  const handleAddShippingMark = () => {
      setData(p => ({
          ...p,
          shippingMarksList: [...p.shippingMarksList, { id: `sm_${Date.now()}`, mark: '' }]
      }));
  };

  const handleUpdateShippingMark = (id: string, val: string) => {
      setData(p => ({
          ...p,
          shippingMarksList: p.shippingMarksList.map(sm => sm.id === id ? { ...sm, mark: val } : sm)
      }));
  };

  const handleDeleteShippingMark = (id: string) => {
      if (data.shippingMarksList.length <= 1) {
          return alert('ต้องมี Shipping Mark อย่างน้อย 1 รายการ');
      }
      if (confirm('ต้องการลบ Shipping Mark นี้หรือไม่?')) {
          setData(p => ({ ...p, shippingMarksList: p.shippingMarksList.filter(sm => sm.id !== id) }));
      }
  };

  const openAddProductModal = () => {
      if (data.invoices.length === 0) {
          alert('กรุณาเพิ่มข้อมูล Invoice ก่อนเพิ่มรายการสินค้า');
          return;
      }
      
      setEditingProductId(null);
      // Reset fields
      setNewProduct({
          id: '',
          nameTh: '',
          nameEn: '',
          description: '',
          brand: '',
          model: '',
          hsCode: '',
          originCriteria: 'WO',
          originCriteriaPercent: '',
          
          netWeight: '',
          netWeightUnit: 'KGM',
          grossWeight: '',
          grossWeightUnit: 'KGM',
          quantity: '',
          quantityUnit: 'BG',
          qtyPackage: '',
          qtyPackageUnit: 'CT',

          showNetWeight: true,
          showGrossWeight: true,
          showOtherQuantity: false,

          fobValue: '',
          fobValueOther: '',
          invoiceNo: '',
          invoiceDate: new Date().toISOString().split('T')[0],
          linkedInvoiceId: '',
          linkedAbroadInvoiceId: '',
          
          // Default to the first available shipping mark
          selectedShippingMarkId: data.shippingMarksList[0]?.id || '',
          invoiceOtherCountryValue: ''
      });
      setShowProductModal(true);
  };

  const handleEditProduct = (product: ProductItem) => {
      setEditingProductId(product.id);
      setNewProduct({ ...product });
      setShowProductModal(true);
  };

  const handleSaveProduct = () => {
      if (!newProduct.nameEn) return alert('กรุณาระบุชื่อสินค้าภาษาอังกฤษ');
      if (!newProduct.linkedInvoiceId) return alert('กรุณาเลือก Invoice');
      if (data.specialConditions.thirdPartyInvoicing && !newProduct.linkedAbroadInvoiceId) {
          return alert('กรุณาเลือก Invoice ต่างประเทศ (สำหรับ Third Party)');
      }
      if (!newProduct.selectedShippingMarkId) return alert('กรุณาเลือก Shipping Mark');

      if (editingProductId) {
          // Update existing product
          setData(p => ({
              ...p,
              products: p.products.map(prod => prod.id === editingProductId ? { ...newProduct, id: editingProductId } : prod)
          }));
      } else {
          // Add new product
          setData(p => ({
              ...p,
              products: [...p.products, { ...newProduct, id: Date.now().toString() }]
          }));
      }
      setShowProductModal(false);
      setEditingProductId(null);
  };

  const handleDeleteProduct = (id: string) => {
      if (confirm('ต้องการลบรายการสินค้านี้หรือไม่?')) {
          setData(p => ({ ...p, products: p.products.filter(i => i.id !== id) }));
      }
  };

  const updateNewProduct = (field: keyof ProductItem, value: any) => {
      setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleOfficeSelect = (id: string) => {
      setData(p => ({ ...p, exporter: { ...p.exporter, dftOfficeId: id } }));
  };

  // Reset invoice type if Third Party is unchecked
  React.useEffect(() => {
      if (!data.specialConditions.thirdPartyInvoicing) {
          setNewInvoice(prev => ({ ...prev, type: 'INVOICE_THAI' }));
      }
  }, [data.specialConditions.thirdPartyInvoicing]);

  // Common Input Style for "Real System" look
  const inputClass = "w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-slate-700 shadow-sm";
  const labelClass = "block text-sm font-bold text-slate-600 mb-1";
  const sectionTitleClass = "text-base font-bold text-slate-800 flex items-center gap-2";
  const sectionNumberClass = "bg-green-500 text-white w-6 h-6 flex items-center justify-center rounded text-xs font-bold";
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data); }} className="font-sans text-sm space-y-6">
      
      {/* Top Section: Service Location Selection */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden mb-6">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h3 className={sectionTitleClass}>
                <span className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded text-xs font-bold">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </span>
                เลือกสถานที่ขอรับบริการ
            </h3>
        </div>
        <div className="p-6">
             <label className="block text-sm font-medium text-slate-600 mb-2">หน่วยงานที่ออกหนังสือรับรอง :</label>
             <div className="relative">
                 <select 
                    className={inputClass} 
                    value={data.exporter.dftOfficeId} 
                    onChange={e => handleOfficeSelect(e.target.value)}
                 >
                     <optgroup label="กรมการค้าต่างประเทศ">
                        {DFT_OFFICES_CENTRAL.map(office => (
                             <option key={office.id} value={office.id}>{office.name}</option>
                        ))}
                     </optgroup>
                     <optgroup label="สำนักงานพาณิชย์จังหวัด (สพจ.)">
                        {DFT_OFFICES_PROVINCIAL.map(office => (
                             <option key={office.id} value={office.id}>{office.name}</option>
                        ))}
                     </optgroup>
                 </select>
             </div>
        </div>
      </div>

      {/* Section 1: Exporter */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h3 className={sectionTitleClass}>
                <span className={sectionNumberClass}>1</span>
                ผู้ขอ (Exporter)
            </h3>
        </div>
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>ชื่อ : <span className="text-xs text-slate-400 font-normal ml-1">Exporter Name</span></label>
                    <input type="text" className={inputClass}
                        value={data.exporter.name} onChange={e => handleExporterChange('name', e.target.value)} />
                </div>
                <div>
                    <label className={labelClass}>เลขประจำตัวผู้เสียภาษี :<span className="text-xs text-slate-400 font-normal ml-1">Tax ID</span></label>
                    <input type="text" className={inputClass}
                        value={data.exporter.taxId} onChange={e => handleExporterChange('taxId', e.target.value)} />
                </div>
            </div>
            <div>
                <label className={labelClass}>ที่อยู่ : <span className="text-xs text-slate-400 font-normal ml-1">Address</span></label>
                <input type="text" className={inputClass}
                    value={data.exporter.address} onChange={e => handleExporterChange('address', e.target.value)} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>โทรศัพท์ :<span className="text-xs text-slate-400 font-normal ml-1">Phone</span></label>
                    <input type="text" className={inputClass}
                        value={data.exporter.phone} onChange={e => handleExporterChange('phone', e.target.value)} />
                </div>
                <div>
                    <label className={labelClass}>อีเมล :<span className="text-xs text-slate-400 font-normal ml-1">Email</span></label>
                    <input type="text" className={inputClass}
                        value={data.exporter.email} onChange={e => handleExporterChange('email', e.target.value)} />
                </div>
             </div>
             
             <div className="pt-2 border-t border-dashed border-slate-200 mt-4">
                 <button type="button" onClick={() => setShowExporterDetails(!showExporterDetails)} className="text-blue-600 text-xs hover:underline flex items-center gap-1">
                     {showExporterDetails ? 'ซ่อนรายละเอียดเพิ่มเติม' : 'แสดงรายละเอียดเพิ่มเติม (OB/Remark)'}
                     <svg className={`w-3 h-3 transform ${showExporterDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </button>
                 {showExporterDetails && (
                     <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded border border-slate-100">
                         <input placeholder="OB Company Name" className={inputClass} value={data.exporter.obCompany} onChange={e => handleExporterChange('obCompany', e.target.value)} />
                         <input placeholder="OB Address" className={inputClass} value={data.exporter.obAddress} onChange={e => handleExporterChange('obAddress', e.target.value)} />
                         <input placeholder="Destination Remark" className={`${inputClass} col-span-2`} value={data.exporter.destRemark} onChange={e => handleExporterChange('destRemark', e.target.value)} />
                     </div>
                 )}
             </div>
        </div>
      </div>

      {/* Section 2: Importer */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h3 className={sectionTitleClass}>
                <span className={sectionNumberClass}>2</span>
                ผู้ซื้อหรือผู้รับประเทศปลายทาง (Importer/Consignee)
            </h3>
        </div>
        <div className="p-6 space-y-4">
            <div>
                <label className={labelClass}>ชื่อบริษัท : <span className="text-xs text-slate-400 font-normal ml-1">Company Name</span></label>
                <input type="text" className={inputClass}
                    value={data.importer.name} onChange={e => handleImporterChange('name', e.target.value)} />
            </div>
            <div>
                <label className={labelClass}>ที่อยู่ : <span className="text-xs text-slate-400 font-normal ml-1">Address</span></label>
                <input type="text" className={inputClass}
                    value={data.importer.address} onChange={e => handleImporterChange('address', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>เมือง : <span className="text-xs text-slate-400 font-normal ml-1">City</span></label>
                    <input type="text" className={inputClass}
                        value={data.importer.city} onChange={e => handleImporterChange('city', e.target.value)} />
                </div>
                <div>
                    <label className={labelClass}>ประเทศปลายทาง :</label>
                    <select className={inputClass}
                        value={data.importer.country} onChange={e => handleImporterChange('country', e.target.value)}>
                        {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                </div>
            </div>
            
             <div className="pt-2 border-t border-dashed border-slate-200 mt-4">
                 <button type="button" onClick={() => setShowImporterDetails(!showImporterDetails)} className="text-blue-600 text-xs hover:underline flex items-center gap-1">
                     {showImporterDetails ? 'ซ่อนรายละเอียดเพิ่มเติม' : 'แสดงรายละเอียดเพิ่มเติม (OB/Email/Remark)'}
                     <svg className={`w-3 h-3 transform ${showImporterDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </button>
                 {showImporterDetails && (
                     <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded border border-slate-100">
                         <input placeholder="Tax ID" className={inputClass} value={data.importer.taxId} onChange={e => handleImporterChange('taxId', e.target.value)} />
                         <input placeholder="Importer ID" className={inputClass} value={data.importer.importerId} onChange={e => handleImporterChange('importerId', e.target.value)} />
                     </div>
                 )}
             </div>
        </div>
      </div>

      {/* Section 3: Transport */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h3 className={sectionTitleClass}>
                <span className={sectionNumberClass}>3</span>
                เส้นทางการขนส่ง
            </h3>
        </div>
        <div className="p-8 space-y-5 bg-slate-50/50">
            {/* Departure Date */}
            <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6">
                    <label className="text-sm font-bold text-slate-700 block">Departure Date <span className="text-red-500">*</span> :</label>
                    <span className="text-xs text-slate-400 block">Departure Date / Shipment Date</span>
                </div>
                <div className="col-span-9">
                    <div className="relative">
                        <input type="date" className={inputClass}
                            value={data.transport.departureDate} onChange={e => handleTransportChange('departureDate', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Transport By (Vehicle Type) */}
             <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6">
                    <label className="text-sm font-bold text-slate-700">ยานพาหนะ <span className="text-red-500">*</span> :</label>
                </div>
                <div className="col-span-9">
                    <select className={inputClass}
                        value={data.transport.transportBy} onChange={e => handleTransportChange('transportBy', e.target.value)}>
                        {TRANSPORT_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                </div>
            </div>

            {/* Vessel Name */}
             <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6">
                    <label className="text-sm font-bold text-slate-700 block">Vessel's name / Aircraft <span className="text-red-500">*</span> :</label>
                    <span className="text-xs text-slate-400 block">etc. / Flight No.</span>
                </div>
                <div className="col-span-9">
                    <input type="text" className={inputClass}
                        value={data.transport.vehicleName} onChange={e => handleTransportChange('vehicleName', e.target.value)} />
                </div>
            </div>

             {/* Bill Type */}
             <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6">
                    <label className="text-sm font-bold text-slate-700">ใบตราส่งสินค้า <span className="text-red-500">*</span> :</label>
                </div>
                <div className="col-span-9">
                     <select className={inputClass}
                        value={data.transport.billType} onChange={e => handleTransportChange('billType', e.target.value)}>
                        <option value="B/L">B/L</option>
                        <option value="AWB">Air Waybill</option>
                        <option value="T/R">Truck Receipt</option>
                    </select>
                </div>
            </div>

            {/* Bill No */}
             <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6">
                    <label className="text-sm font-bold text-slate-700">เลขที่ใบตราส่ง <span className="text-red-500">*</span> :</label>
                </div>
                <div className="col-span-9">
                    <input type="text" className={inputClass}
                        value={data.transport.billRefNo} onChange={e => handleTransportChange('billRefNo', e.target.value)} />
                </div>
            </div>

            {/* Bill Date (Sailing Date) */}
             <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6">
                    <label className="text-sm font-bold text-slate-700">วันที่ออกเอกสารใบตราส่ง <span className="text-red-500">*</span> :</label>
                </div>
                <div className="col-span-9 flex gap-2">
                    <input type="date" className={`${inputClass} flex-grow`}
                        value={data.transport.sailingDate} onChange={e => handleTransportChange('sailingDate', e.target.value)} />
                </div>
            </div>
            
 
            
             <div className="border-t border-slate-200 my-4"></div>

             {/* Display Fields */}
             <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6">
                    <label className="text-sm font-bold text-slate-700 block">Means of transport and <span className="text-red-500">*</span> :</label>
                    <span className="text-xs text-slate-400 block">route (as far as known)</span>
                </div>
                <div className="col-span-9">
                     <div className="bg-slate-100 border border-slate-200 rounded px-3 py-2 text-slate-600 text-sm">
                         {data.transport.transportBy}
                     </div>
                </div>
            </div>

             <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6">
                    <label className="text-sm font-bold text-slate-700 block">Vessel's name / Aircraft :</label>
                     <span className="text-xs text-slate-400 block">etc. / Flight No.</span>
                </div>
                <div className="col-span-9">
                     <div className="bg-slate-100 border border-slate-200 rounded px-3 py-2 text-slate-600 text-sm min-h-[38px]">
                         {data.transport.vehicleName} {data.transport.vehicleNameList && data.transport.vehicleNameList !== data.transport.vehicleName ? `, ${data.transport.vehicleNameList}` : ''}
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6">
                    <label className="text-sm font-bold text-slate-700">Place of Departure :</label>
                </div>
                <div className="col-span-9">
                     <input type="text" className={inputClass}
                        value={data.transport.placeDeparture} onChange={e => handleTransportChange('placeDeparture', e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 text-right pr-6">
                    <label className="text-sm font-bold text-slate-700 block">Port of Discharge <span className="text-red-500">*</span> :</label>
                    <span className="text-xs text-slate-400 block">สำหรับแสดงในฟอร์ม</span>
                </div>
                <div className="col-span-9">
                     <input type="text" className={inputClass}
                        value={data.transport.portDischarge} onChange={e => handleTransportChange('portDischarge', e.target.value)} />
                </div>
            </div>
        </div>
      </div>

      {/* Section 4: Conditions */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h3 className={sectionTitleClass}>
                <span className={sectionNumberClass}>4</span>
                เลือกกรณีใช้เงื่อนไขพิเศษเพิ่มเติม (Special Conditions)
            </h3>
        </div>
        <div className="p-6 bg-slate-50/30">
            <div className="space-y-3 pl-2">
                 <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        checked={data.specialConditions.thirdPartyInvoicing} onChange={() => toggleCondition('thirdPartyInvoicing')} />
                    <span className="text-slate-700 font-medium">Third Party Invoicing</span>
                </label>
                
                {data.specialConditions.thirdPartyInvoicing && (
                    <div className="ml-8 p-4 bg-slate-50 border border-slate-200 rounded mb-2 grid grid-cols-1 gap-3">
                        <input placeholder="Company Name" className={inputClass} value={data.specialConditions.thirdPartyInvoicingCompany} onChange={e => handleSpecialConditionChange('thirdPartyInvoicingCompany', e.target.value)} />
                        <input placeholder="Address" className={inputClass} value={data.specialConditions.thirdPartyInvoicingAddress1} onChange={e => handleSpecialConditionChange('thirdPartyInvoicingAddress1', e.target.value)} />
                        <input placeholder="Country" className={inputClass} value={data.specialConditions.thirdPartyInvoicingCountry} onChange={e => handleSpecialConditionChange('thirdPartyInvoicingCountry', e.target.value)} />
                        <div className="pt-2">
                            <label className={labelClass}>Invoice แสดงในช่อง 10 :</label>
                            <select className={inputClass} value={data.productInvoiceShowInCol10} onChange={e => setData({...data, productInvoiceShowInCol10: e.target.value})}>
                                <option value="INVOICE_ABROAD">Invoice ต่างประเทศ (INVOICE_ABROAD)</option>
                                <option value="INVOICE_THAI">Invoice ไทย (INVOICE_THAI)</option>
                                <option value="INVOICE_ABROAD_THAI">Invoice นายหน้าไทย (INVOICE_ABROAD_THAI)</option>
                            </select>
                        </div>
                    </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        checked={data.specialConditions.backToBack} onChange={() => toggleCondition('backToBack')} />
                    <span className="text-slate-700 font-medium">Movement Certificate (Back-to-back)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        checked={data.specialConditions.exhibitions} onChange={() => toggleCondition('exhibitions')} />
                    <span className="text-slate-700 font-medium">Exhibition</span>
                </label>
                
                 {data.specialConditions.exhibitions && (
                    <div className="ml-8 p-4 bg-slate-50 border border-slate-200 rounded mb-2 grid grid-cols-1 gap-3">
                        <input placeholder="Exhibition Name" className={inputClass} value={data.specialConditions.exhibitionsName} onChange={e => handleSpecialConditionChange('exhibitionsName', e.target.value)} />
                        <input placeholder="Place" className={inputClass} value={data.specialConditions.exhibitionsPlace} onChange={e => handleSpecialConditionChange('exhibitionsPlace', e.target.value)} />
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Section 5: Products & Shipping Marks */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h3 className={sectionTitleClass}>
                <span className={sectionNumberClass}>5</span>
                รายการสินค้า (Product Items)
            </h3>
        </div>
        <div className="p-6 space-y-6">
             
             {/* Invoice Management Section */}
             <div className="bg-slate-50/50 p-6 rounded border border-slate-100 space-y-4">
                 {/* Previous Form Info */}
                 <div className="grid grid-cols-12 gap-4 items-center">
                     <div className="col-span-3 text-right">
                         <label className={labelClass}>เลขที่ฟอร์มเดิม :</label>
                     </div>
                     <div className="col-span-9">
                         <input className={inputClass} placeholder="เลือกเลขที่ฟอร์มเดิม..." value={data.prevFormNo} onChange={e => setData({...data, prevFormNo: e.target.value})} />
                     </div>
                 </div>
                 <div className="grid grid-cols-12 gap-4 items-center">
                     <div className="col-span-3 text-right">
                         <label className={labelClass}>วันที่ออกฟอร์มฉบับเดิม :</label>
                     </div>
                     <div className="col-span-9">
                         <input type="date" className={inputClass} value={data.prevFormDate} onChange={e => setData({...data, prevFormDate: e.target.value})} />
                     </div>
                 </div>
                 <div className="grid grid-cols-12 gap-4 items-center">
                     <div className="col-span-3 text-right">
                         <label className={labelClass}>กรณีใช้สกุลเงินอื่น :</label>
                     </div>
                     <div className="col-span-9">
                         <select className={inputClass} value={data.productCurrency} onChange={e => setData({...data, productCurrency: e.target.value})}>
                            <option value="">กรุณาเลือก...</option>
                            {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                         </select>
                     </div>
                 </div>

                 <hr className="border-slate-200" />

                 {/* Add Invoice */}
                 <div className="grid grid-cols-12 gap-4 items-start">
                     <div className="col-span-3 text-right pt-1">
                         <label className={labelClass}>เลือกประเภทใบกำกับสินค้า <br/>(invoice) เพื่อแสดงลงในฟอร์ม <br/>ช่อง INVOICE/DATE :</label>
                     </div>
                     <div className="col-span-9">
                         <div className="space-y-2">
                             <label className={`flex items-center gap-2 ${!data.specialConditions.thirdPartyInvoicing ? 'opacity-50 pointer-events-none' : ''}`}>
                                 <input type="radio" name="invType" className="w-4 h-4 text-blue-600" 
                                    checked={newInvoice.type === 'INVOICE_THAI'} 
                                    onChange={() => setNewInvoice({...newInvoice, type: 'INVOICE_THAI'})} 
                                    disabled={!data.specialConditions.thirdPartyInvoicing}
                                 />
                                 <span>INVOICE ไทย</span>
                             </label>
                             
                             {data.specialConditions.thirdPartyInvoicing && (
                                 <>
                                     <label className="flex items-center gap-2">
                                         <input type="radio" name="invType" className="w-4 h-4 text-blue-600" 
                                            checked={newInvoice.type === 'INVOICE_ABROAD'} 
                                            onChange={() => setNewInvoice({...newInvoice, type: 'INVOICE_ABROAD'})} 
                                         />
                                         <span>INVOICE ต่างประเทศ</span>
                                     </label>
                                     <label className="flex items-center gap-2">
                                         <input type="radio" name="invType" className="w-4 h-4 text-blue-600" 
                                            checked={newInvoice.type === 'INVOICE_ABROAD_THAI'} 
                                            onChange={() => setNewInvoice({...newInvoice, type: 'INVOICE_ABROAD_THAI'})} 
                                         />
                                         <span>INVOICE นายหน้าไทย</span>
                                     </label>
                                 </>
                             )}
                             
                             {!data.specialConditions.thirdPartyInvoicing && (
                                 <div className="text-xs text-slate-500 mt-1 pl-6">
                                     * ระบบกำหนดให้เป็น INVOICE ไทย อัตโนมัติเนื่องจากไม่ได้เลือก Third Party Invoicing
                                 </div>
                             )}
                         </div>
                     </div>
                 </div>
                 
                 {/* Invoice Input */}
                 <div className="grid grid-cols-12 gap-4 items-center mt-2">
                     <div className="col-span-3"></div>
                     <div className="col-span-9 grid grid-cols-12 gap-2">
                         <div className="col-span-6">
                             <input placeholder="เลขที่ INVOICE" className={inputClass} value={newInvoice.no} onChange={e => setNewInvoice({...newInvoice, no: e.target.value})} />
                         </div>
                         <div className="col-span-4">
                             <input type="date" className={inputClass} value={newInvoice.date} onChange={e => setNewInvoice({...newInvoice, date: e.target.value})} />
                         </div>
                         <div className="col-span-2">
                             <button type="button" onClick={handleAddInvoice} className="w-full px-2 py-2 bg-white border border-blue-500 text-blue-600 rounded hover:bg-blue-50 text-xs font-medium">
                                 เพิ่มเลขที่ INVOICE
                             </button>
                         </div>
                     </div>
                 </div>

                 {/* Invoice Table */}
                 <div className="overflow-hidden border border-slate-200 rounded mt-4">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 text-xs">
                            <tr>
                                <th className="p-2 font-semibold text-center w-16">Action</th>
                                <th className="p-2 font-semibold text-blue-600">เลขที่ INVOICE</th>
                                <th className="p-2 font-semibold text-blue-600">วันที่ออก INVOICE</th>
                                <th className="p-2 font-semibold text-blue-600">ประเภท INVOICE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                             {data.invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50">
                                    <td className="p-2 text-center">
                                        <button type="button" onClick={() => handleDeleteInvoice(inv.id)} className="text-red-500 hover:text-red-700">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                    <td className="p-2 text-slate-700">{inv.invoiceNo}</td>
                                    <td className="p-2 text-slate-600">{inv.invoiceDate}</td>
                                    <td className="p-2 text-slate-600 text-xs">
                                        {inv.invoiceType === 'INVOICE_THAI' ? 'INVOICE ไทย' : 
                                         inv.invoiceType === 'INVOICE_ABROAD' ? 'INVOICE ต่างประเทศ' : 'INVOICE นายหน้าไทย'}
                                    </td>
                                </tr>
                             ))}
                             {data.invoices.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-slate-400 text-xs">ยังไม่มีข้อมูล Invoice</td></tr>}
                        </tbody>
                    </table>
                 </div>
             </div>

             {/* Shipping Marks Management */}
             <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
                 <div className="flex justify-between items-center">
                     <h4 className="text-slate-800 font-bold">จัดการ Shipping Mark</h4>
                     <button type="button" onClick={handleAddShippingMark} className="px-3 py-1.5 bg-white border border-blue-500 text-blue-600 text-xs rounded hover:bg-blue-50 font-medium">
                         + เพิ่ม Shipping Mark
                     </button>
                 </div>
                 <div className="space-y-3">
                     {data.shippingMarksList.map((sm, index) => (
                         <div key={sm.id} className="flex gap-2 items-start">
                             <div className="flex-grow">
                                 <textarea 
                                    className={inputClass} 
                                    rows={3}
                                    value={sm.mark} 
                                    onChange={(e) => handleUpdateShippingMark(sm.id, e.target.value)}
                                    placeholder="ระบุ Shipping Mark..."
                                 />
                             </div>
                             <button type="button" onClick={() => handleDeleteShippingMark(sm.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                             </button>
                         </div>
                     ))}
                 </div>
             </div>

             {/* Product Table Header & Add Button */}
             <div className="flex justify-between items-center mb-2 pt-4 border-t border-slate-100">
                 <h4 className="text-slate-800 font-bold">รายการสินค้าทั้งหมด</h4>
                 <button type="button" onClick={openAddProductModal} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium shadow-sm flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                     เพิ่มรายการสินค้า
                 </button>
             </div>

             <div className="overflow-x-auto border border-slate-200 rounded mb-8">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                        <tr>
                            <th className="p-3 font-semibold">#</th>
                            <th className="p-3 font-semibold">รายละเอียดสินค้า</th>
                            <th className="p-3 font-semibold">HS Code</th>
                            <th className="p-3 font-semibold text-right">น้ำหนัก</th>
                            <th className="p-3 font-semibold text-right">FOB ({data.productCurrency})</th>
                            <th className="p-3 font-semibold text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                         {data.products.map((p, i) => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="p-3 text-center text-slate-500">{i + 1}</td>
                                <td className="p-3">
                                    <div className="font-medium text-blue-600">{p.nameEn}</div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        Inv ID: {p.linkedInvoiceId?.slice(0,5)}...
                                        {p.linkedAbroadInvoiceId && ` | Abroad ID: ${p.linkedAbroadInvoiceId?.slice(0,5)}...`}
                                    </div>
                                </td>
                                <td className="p-3 text-slate-600">{p.hsCode}</td>
                                <td className="p-3 text-right text-slate-600">{p.netWeight} {p.netWeightUnit}</td>
                                <td className="p-3 text-right text-slate-600">{parseFloat(p.fobValue || '0').toLocaleString()}</td>
                                <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => handleEditProduct(p)} className="text-yellow-500 hover:text-yellow-600 p-1 rounded hover:bg-yellow-50" title="แก้ไข">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <button type="button" onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50" title="ลบ">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                         ))}
                         {data.products.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-slate-400">ยังไม่มีข้อมูล</td></tr>}
                    </tbody>
                </table>
             </div>

             {/* Summary Options (Based on screenshot) */}
             <div className="bg-gray-50/50 rounded-lg p-6 border border-slate-200 space-y-6">
                 <h4 className="text-slate-800 font-bold text-base mb-4">เลือกเพื่อแสดงยอดรวมในช่องรายละเอียดของสินค้า</h4>
                 
                 <div className="space-y-4 pl-4">
                     <div className="grid grid-cols-12 items-center">
                         <div className="col-span-1 text-center">
                            <input type="checkbox" checked={data.showTotalValueFobUs} onChange={e => setData(p => ({...p, showTotalValueFobUs: e.target.checked}))} className="w-5 h-5 text-blue-600 rounded border-gray-300" />
                         </div>
                         <div className="col-span-4 text-sm text-slate-700">ผลรวมมูลค่า FOB USD INVOICE ไทย</div>
                         <div className="col-span-7 flex gap-4 items-center">
                             <div className="text-sm font-medium">มูลค่า : {totalFob.toLocaleString()}</div>
                             <div className="text-sm text-slate-500">สกุลเงิน : {data.productCurrency}</div>
                         </div>
                     </div>
                     
                     <div className="grid grid-cols-12 items-center opacity-50">
                         <div className="col-span-1 text-center">
                            <input type="checkbox" disabled checked={data.showTotalValueFobUsOther} className="w-5 h-5 text-blue-600 rounded border-gray-300" />
                         </div>
                         <div className="col-span-4 text-sm text-slate-700">ผลรวมมูลค่า FOB ตามสกุลเงินอื่น</div>
                         <div className="col-span-7 text-sm text-slate-400 italic">ไม่มีผลรวมมูลค่า FOB ตามสกุลเงินอื่น</div>
                     </div>

                     <div className="grid grid-cols-12 items-center opacity-50">
                         <div className="col-span-1 text-center">
                            <input type="checkbox" disabled checked={data.showTotalInvoiceOtherCountryUsValue} className="w-5 h-5 text-blue-600 rounded border-gray-300" />
                         </div>
                         <div className="col-span-4 text-sm text-slate-700">ผลรวมมูลค่า FOB USD กรณีใช้ INVOICE ต่างประเทศ</div>
                         <div className="col-span-7 text-sm text-slate-400 italic">ไม่มีผลรวมมูลค่า FOB USD กรณีใช้ INVOICE ต่างประเทศ</div>
                     </div>

                     <div className="grid grid-cols-12 items-center">
                         <div className="col-span-1 text-center">
                            <input type="checkbox" checked={data.showTotalNetWeight} onChange={e => setData(p => ({...p, showTotalNetWeight: e.target.checked}))} className="w-5 h-5 text-blue-600 rounded border-gray-300" />
                         </div>
                         <div className="col-span-4 text-sm text-slate-700">ผลรวม Net weight</div>
                         <div className="col-span-7 flex gap-4 items-center">
                             <div className="text-sm font-medium">น้ำหนัก : {totalNetWeight.toLocaleString()}</div>
                             <div className="text-sm text-slate-500">หน่วย : KILOGRAM</div>
                         </div>
                     </div>
                 </div>

                 <div className="mt-6 border-t border-slate-200 pt-4">
                     <h5 className="text-slate-700 font-medium text-sm mb-3">ผลรวมปริมาณอื่นที่เลือกเพิ่มเติม</h5>
                     <div className="bg-white p-4 border border-slate-200 rounded">
                         <h6 className="font-bold text-slate-800 mb-3">ระบุปริมาณ</h6>
                         <div className="grid grid-cols-12 gap-4 items-center">
                             <div className="col-span-2 text-right">
                                 <label className={labelClass}>ปริมาณ <span className="text-red-500">*</span> :</label>
                             </div>
                             <div className="col-span-3">
                                 <input type="text" className={inputClass} value={data.totalQuantityValue} onChange={e => setData(p => ({...p, totalQuantityValue: e.target.value}))} placeholder="1,300" />
                             </div>
                             <div className="col-span-2 text-right">
                                 <label className={labelClass}>หน่วย <span className="text-red-500">*</span> :</label>
                             </div>
                             <div className="col-span-3">
                                  <select className={inputClass} value={data.totalQuantityUnit} onChange={e => setData(p => ({...p, totalQuantityUnit: e.target.value}))}>
                                      <option value="">กรุณาเลือก...</option>
                                      {MEASUREMENT_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                                  </select>
                             </div>
                             <div className="col-span-2 text-right">
                                  <button type="button" className="px-3 py-1.5 border border-blue-500 text-blue-600 rounded text-xs hover:bg-blue-50 font-medium">
                                      เพิ่มรายการปริมาณ
                                  </button>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
                <div className="bg-blue-600 px-6 py-4 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
                    <h3 className="text-white font-bold text-lg">{editingProductId ? 'แก้ไขรายการสินค้า' : 'เพิ่มรายการสินค้า'}</h3>
                    <button type="button" onClick={() => setShowProductModal(false)} className="text-white hover:text-blue-200">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                     {/* Invoice Selection */}
                     <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                         <h4 className="font-bold text-yellow-800 mb-3 text-sm">1. เลือก Invoice ที่ต้องการระบุสินค้า</h4>
                         
                         <div className="space-y-3">
                             <div>
                                 <label className={labelClass}>เลือก Invoice (Reference/Local) <span className="text-red-500">*</span> :</label>
                                 <select className={inputClass} value={newProduct.linkedInvoiceId || ''} onChange={e => updateNewProduct('linkedInvoiceId', e.target.value)}>
                                     <option value="">-- กรุณาเลือก --</option>
                                     {data.invoices.filter(i => i.invoiceType === 'INVOICE_THAI').map(inv => (
                                         <option key={inv.id} value={inv.id}>{inv.invoiceNo} ({inv.invoiceDate}) - INVOICE ไทย</option>
                                     ))}
                                     {/* Fallback if no Thai invoices but user wants to link something */}
                                     {!data.specialConditions.thirdPartyInvoicing && data.invoices.filter(i => i.invoiceType !== 'INVOICE_THAI').map(inv => (
                                         <option key={inv.id} value={inv.id}>{inv.invoiceNo} ({inv.invoiceDate}) - {inv.invoiceType}</option>
                                     ))}
                                 </select>
                             </div>

                             {data.specialConditions.thirdPartyInvoicing && (
                                 <div>
                                     <label className={labelClass}>เลือก Invoice ต่างประเทศ (สำหรับแสดงในช่อง 10) <span className="text-red-500">*</span> :</label>
                                     <select className={inputClass} value={newProduct.linkedAbroadInvoiceId || ''} onChange={e => updateNewProduct('linkedAbroadInvoiceId', e.target.value)}>
                                         <option value="">-- กรุณาเลือก --</option>
                                         {data.invoices.filter(i => i.invoiceType !== 'INVOICE_THAI').map(inv => (
                                             <option key={inv.id} value={inv.id}>
                                                 {inv.invoiceNo} ({inv.invoiceDate}) - {inv.invoiceType === 'INVOICE_ABROAD' ? 'ต่างประเทศ' : 'นายหน้าไทย'}
                                             </option>
                                         ))}
                                     </select>
                                 </div>
                             )}
                         </div>
                     </div>

                     {/* Product Details */}
                     <div>
                         <h4 className="font-bold text-slate-800 mb-4 text-sm">2. รายละเอียดสินค้า</h4>
                         
                         <div className="space-y-6">
                             <div className="grid grid-cols-12 gap-4 items-start">
                                 <div className="col-span-3 text-right pt-2">
                                     <label className={labelClass}>เลือก Shipping Mark <span className="text-red-500">*</span> :</label>
                                 </div>
                                 <div className="col-span-9">
                                    <div className="space-y-2">
                                        {data.shippingMarksList.map(sm => (
                                            <label key={sm.id} className="flex gap-3 items-start cursor-pointer">
                                                <div className="pt-1">
                                                    <input 
                                                        type="radio" 
                                                        name="selectedShippingMark" 
                                                        className="w-4 h-4 text-blue-600" 
                                                        checked={newProduct.selectedShippingMarkId === sm.id}
                                                        onChange={() => updateNewProduct('selectedShippingMarkId', sm.id)}
                                                    />
                                                </div>
                                                <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded px-3 py-2 w-full whitespace-pre-wrap">
                                                    {sm.mark || <span className="text-slate-400 italic">No Content</span>}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                 </div>
                             </div>

                             <div className="grid grid-cols-12 gap-4 items-center">
                                 <div className="col-span-3 text-right">
                                     <label className={labelClass}>พิกัดสินค้า <span className="text-red-500">*</span> :</label>
                                 </div>
                                 <div className="col-span-9">
                                     <input className={inputClass} placeholder="08119090" value={newProduct.hsCode} onChange={e => updateNewProduct('hsCode', e.target.value)} />
                                 </div>
                             </div>

                             <hr className="border-gray-200 my-2" />

                             <div className="grid grid-cols-12 gap-4 items-center">
                                 <div className="col-span-3 text-right">
                                     <label className={labelClass}>ชื่อสินค้าแสดงในคำขอ <span className="text-red-500">*</span> :</label>
                                 </div>
                                 <div className="col-span-9">
                                     <input className={inputClass} value={newProduct.nameTh} onChange={e => updateNewProduct('nameTh', e.target.value)} />
                                 </div>
                             </div>

                             <div className="grid grid-cols-12 gap-4 items-center">
                                 <div className="col-span-3 text-right">
                                     <label className={labelClass}>ชื่อสินค้าภาษาอังกฤษ <span className="text-red-500">*</span> :</label>
                                 </div>
                                 <div className="col-span-9">
                                     <input className={inputClass} value={newProduct.nameEn} onChange={e => updateNewProduct('nameEn', e.target.value)} />
                                 </div>
                             </div>

                             <div className="grid grid-cols-12 gap-4 items-start">
                                 <div className="col-span-3 text-right pt-2">
                                     <label className={labelClass}>รายละเอียดสินค้า :</label>
                                 </div>
                                 <div className="col-span-9">
                                     <textarea className={`${inputClass} h-20`} value={newProduct.description} onChange={e => updateNewProduct('description', e.target.value)} placeholder="CONTAINER NO.: ..." />
                                 </div>
                             </div>

                             <div className="grid grid-cols-12 gap-4">
                                 <div className="col-span-3 text-right pt-1">
                                     <label className={labelClass}>แสดงลงบนฟอร์ม</label>
                                 </div>
                                 <div className="col-span-9 space-y-2">
                                     <label className="flex items-center gap-2">
                                         <input type="checkbox" checked={newProduct.showNetWeight} onChange={e => updateNewProduct('showNetWeight', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                                         <span>NET WEIGHT</span>
                                     </label>
                                     <label className="flex items-center gap-2">
                                         <input type="checkbox" checked={newProduct.showGrossWeight} onChange={e => updateNewProduct('showGrossWeight', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                                         <span>GROSS WEIGHT</span>
                                     </label>
                                     <label className="flex items-center gap-2">
                                         <input type="checkbox" checked={newProduct.showOtherQuantity} onChange={e => updateNewProduct('showOtherQuantity', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                                         <span>OTHER QUANTITY</span>
                                     </label>
                                 </div>
                             </div>

                             {/* Weights & QTY */}
                             <div className="grid grid-cols-12 gap-4 items-center">
                                 <div className="col-span-3 text-right"><label className={labelClass}>QTY Package :</label></div>
                                 <div className="col-span-4"><input type="number" className={inputClass} value={newProduct.qtyPackage} onChange={e => updateNewProduct('qtyPackage', e.target.value)} /></div>
                                 <div className="col-span-5">
                                    <select className={inputClass} value={newProduct.qtyPackageUnit} onChange={e => updateNewProduct('qtyPackageUnit', e.target.value)}>
                                        <option value="">เลือกหน่วย...</option>
                                        {PACKAGE_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                                    </select>
                                 </div>
                             </div>
                             <div className="grid grid-cols-12 gap-4 items-center">
                                 <div className="col-span-3 text-right"><label className={labelClass}>Net Weight <span className="text-red-500">*</span> :</label></div>
                                 <div className="col-span-4"><input type="number" className={inputClass} value={newProduct.netWeight} onChange={e => updateNewProduct('netWeight', e.target.value)} /></div>
                                 <div className="col-span-5">
                                    <select className={inputClass} value={newProduct.netWeightUnit} onChange={e => updateNewProduct('netWeightUnit', e.target.value)}>
                                        {WEIGHT_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                                    </select>
                                 </div>
                             </div>
                             <div className="grid grid-cols-12 gap-4 items-center">
                                 <div className="col-span-3 text-right"><label className={labelClass}>Gross Weight :</label></div>
                                 <div className="col-span-4"><input type="number" className={inputClass} value={newProduct.grossWeight} onChange={e => updateNewProduct('grossWeight', e.target.value)} /></div>
                                 <div className="col-span-5">
                                    <select className={inputClass} value={newProduct.grossWeightUnit} onChange={e => updateNewProduct('grossWeightUnit', e.target.value)}>
                                        {WEIGHT_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                                    </select>
                                 </div>
                             </div>
                             
                             <div className="grid grid-cols-12 gap-4 items-center">
                                 <div className="col-span-3 text-right"><label className={labelClass}>FOB Value <span className="text-red-500">*</span> :</label></div>
                                 <div className="col-span-9 flex items-center gap-2">
                                     <input type="number" className={inputClass} value={newProduct.fobValue} onChange={e => updateNewProduct('fobValue', e.target.value)} />
                                     <span className="text-slate-500 font-bold">{data.productCurrency}</span>
                                 </div>
                             </div>
                         </div>
                     </div>

                     {/* Origin Criteria - Radio Buttons */}
                     <div className="bg-gray-100 p-4 rounded-lg mt-4">
                         <h4 className="font-bold text-sm text-slate-800 mb-3">เลือกข้อมูลกฎว่าด้วยถิ่นกำเนิดสินค้า (Origin Criteria)</h4>
                         <div className="space-y-3">
                             {['WO', 'PE', 'PSR', 'RVC'].map((crit) => (
                                 <label key={crit} className="flex items-start gap-3 cursor-pointer">
                                     <div className="pt-1"><input type="radio" name="originCriteria" className="w-4 h-4 text-blue-600" checked={newProduct.originCriteria === crit} onChange={() => updateNewProduct('originCriteria', crit)} /></div>
                                     <span className="text-slate-700 text-xs pt-0.5 font-medium">
                                         {crit === 'WO' && '"WO" สำหรับสินค้าที่ได้มาทั้งหมด หรือผลิตโดยใช้วัตถุดิบในไทย'}
                                         {crit === 'PE' && '"PE" สำหรับสินค้าที่ผลิตจากการใช้วัตถุดิบที่ได้ถิ่นกำเนิดจากประเทศภาคีสมาชิก'}
                                         {crit === 'PSR' && '"PSR" (Product Specific Rules) กรณีใช้เกณฑ์อื่นๆ'}
                                         {crit === 'RVC' && '"RVC" (Regional Value Content)'}
                                     </span>
                                 </label>
                             ))}
                         </div>
                     </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3 border-t border-gray-200 sticky bottom-0">
                    <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded hover:bg-slate-50 font-medium text-sm">ยกเลิก</button>
                    <button type="button" onClick={handleSaveProduct} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm shadow-sm">{editingProductId ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'}</button>
                </div>
            </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg flex justify-end gap-4 items-center">
         <button type="button" className="px-6 py-2.5 border border-slate-300 bg-white text-slate-700 rounded hover:bg-slate-50 font-medium text-sm shadow-sm">
             ยกเลิก
         </button>
         <button type="submit" disabled={isLoading} className="px-8 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium shadow-sm disabled:opacity-50 text-sm flex items-center gap-2">
             {isLoading ? (
                 <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
             ) : (
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
             )}
             บันทึกไฟล์ XML
         </button>
      </div>
    </form>
  );
};

export default SmartCOForm;
