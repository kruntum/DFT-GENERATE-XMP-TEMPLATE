
import React from 'react';
import { GeneratedResponse } from '../types';

interface Props {
  data: GeneratedResponse | null;
  onReset: () => void;
}

const XMLDisplay: React.FC<Props> = ({ data, onReset }) => {
  if (!data) return null;

  return (
    <div className="space-y-4 animate-fade-in-up font-sans text-sm">
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-3 bg-green-50 border-b border-green-100 flex justify-between items-center">
            <h3 className="font-bold text-green-800 flex items-center gap-2 text-sm">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 ผลลัพธ์ XML (Generated Output)
            </h3>
            <button onClick={onReset} className="text-xs text-blue-600 hover:underline font-medium">
                ล้างค่า
            </button>
        </div>
        <div className="relative group">
            <pre className="p-4 bg-[#1e1e1e] text-green-400 text-xs overflow-x-auto font-mono leading-relaxed max-h-[500px] scrollbar-thin scrollbar-thumb-slate-700">
                <code>{data.xml}</code>
            </pre>
             <button onClick={() => navigator.clipboard.writeText(data.xml)} 
                className="absolute top-2 right-2 bg-white/10 text-white text-[10px] px-2 py-1 rounded hover:bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                คัดลอก
            </button>
        </div>
      </div>

      {data.logs.length > 0 && (
        <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-3 bg-yellow-50 border-b border-yellow-100">
                <h3 className="font-bold text-yellow-800 text-sm">บันทึกระบบ (System Logs)</h3>
            </div>
            <ul className="p-3 space-y-1.5">
                {data.logs.map((log, index) => (
                    <li key={index} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0"></span>
                        <span>{log}</span>
                    </li>
                ))}
            </ul>
        </div>
      )}
      
      {data.groundingMetadata && (
         <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs">
            <strong className="text-slate-500 block mb-1">แหล่งอ้างอิง Google Search:</strong>
            <div className="flex flex-wrap gap-2">
                {data.groundingMetadata.groundingChunks?.map((chunk: any, i: number) => (
                    chunk.web?.uri && (
                        <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline truncate max-w-[200px]">
                            {chunk.web.title || chunk.web.uri}
                        </a>
                    )
                ))}
            </div>
         </div>
      )}
    </div>
  );
};

export default XMLDisplay;
