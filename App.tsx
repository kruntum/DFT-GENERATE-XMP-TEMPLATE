
import React, { useState } from 'react';
import SmartCOForm from './components/SmartCOForm';
import XMLDisplay from './components/XMLDisplay';
import { SmartCOData, GeneratedResponse, AppState } from './types';
import { generateSmartCOXML } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [generatedData, setGeneratedData] = useState<GeneratedResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Function to handle file download
  const downloadXmlFile = (xmlContent: string, data: SmartCOData) => {
    try {
      // Default filename
      let baseName = "SmartCO_Draft";
      
      // 1. Find the first available invoice number from products
      const firstInvoice = data.products.find(p => p.invoiceNo && p.invoiceNo.trim() !== '');
      if (firstInvoice) {
        baseName = firstInvoice.invoiceNo;
      }

      // 2. Replace special characters with underscore
      // Allow: English (a-z, A-Z), Numbers (0-9), Thai (ก-๙)
      // Replace everything else with '_'
      const safeName = baseName.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
      
      // 3. Create blob and download link
      const fileName = `${safeName}.xml`;
      const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100); // Cleanup
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  const handleSubmit = async (data: SmartCOData) => {
    setAppState(AppState.GENERATING);
    setErrorMsg(null);
    try {
      const response = await generateSmartCOXML(data);
      setGeneratedData(response);
      setAppState(AppState.SUCCESS);

      // Trigger the real file export immediately after generation
      downloadXmlFile(response.xml, data);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "System Error");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
      setAppState(AppState.IDLE);
      setGeneratedData(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      {/* DFT Official-like Header */}
      <header className="bg-[#1e293b] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {/* New Logo */}
             <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
             </div>
             <div>
                 <h1 className="text-lg font-bold leading-tight tracking-tight">ระบบการให้บริการออกหนังสือรับรองถิ่นกำเนิดสินค้า</h1>
                 <p className="text-xs text-blue-200 opacity-90">DFT SMART Certificate of Origin (Smart C/O)</p>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        
        <div className="mb-6 bg-white p-5 border-l-4 border-blue-600 shadow-sm rounded-r-sm flex items-center justify-between">
             <h2 className="text-xl font-bold text-slate-800">คำขอหนังสือรับรองถิ่นกำเนิดสินค้า FORM E</h2>
             <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-100">สถานะ: ร่างเอกสาร</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Left: Form */}
            <div className="xl:col-span-8">
                 <SmartCOForm onSubmit={handleSubmit} isLoading={appState === AppState.GENERATING} />
            </div>

            {/* Right: Output / Status */}
            <div className="xl:col-span-4 space-y-6 sticky top-6">
                {appState === AppState.IDLE && (
                    <div className="bg-white shadow-md border border-slate-100 p-8 text-center rounded-lg">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                             <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-slate-800 font-semibold text-lg mb-2">พร้อมสร้างข้อมูล</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            กรุณากรอกข้อมูลสินค้าและรายละเอียดการส่งออกทางด้านซ้ายมือให้ครบถ้วน เมื่อเสร็จสิ้นให้กดปุ่ม <br/>
                            <span className="font-bold text-blue-600">"บันทึกไฟล์ XML"</span> ระบบจะทำการสร้างและดาวน์โหลดไฟล์อัตโนมัติ
                        </p>
                    </div>
                )}

                {appState === AppState.ERROR && (
                     <div className="bg-red-50 border border-red-200 p-4 text-red-800 rounded-md text-sm shadow-sm">
                        <div className="flex items-center gap-2 font-bold mb-1">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            เกิดข้อผิดพลาด
                        </div>
                        {errorMsg}
                         <button onClick={() => setAppState(AppState.IDLE)} className="block mt-3 text-xs bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors">ลองใหม่อีกครั้ง</button>
                     </div>
                )}

                {(appState === AppState.SUCCESS || appState === AppState.GENERATING) && (
                     <XMLDisplay data={generatedData} onReset={handleReset} />
                )}
                
                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-5 rounded-lg shadow-sm">
                    <h4 className="text-blue-900 font-bold text-sm mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        คุณสมบัติอัจฉริยะ
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-2.5 pl-1">
                        <li className="flex gap-2 items-start">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span><strong>AI ตรวจสอบอัตโนมัติ:</strong> ตรวจสอบความถูกต้องของพิกัดสินค้า (HS Code) กับชื่อสินค้า</span>
                        </li>
                        <li className="flex gap-2 items-start">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span><strong>คำนวณอัตโนมัติ:</strong> รวมยอดปริมาณและน้ำหนักสุทธิของทุกรายการให้ทันที</span>
                        </li>
                         <li className="flex gap-2 items-start">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span><strong>สร้างไฟล์ XML:</strong> สร้างไฟล์ตามมาตรฐานกรมการค้าต่างประเทศ พร้อมใช้งาน</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;
