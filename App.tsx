
import React, { useState, useCallback, useRef } from 'react';
import { ReleaseData, ReleaseItem } from './types';
import { 
  RELEASE_TYPES, 
  CUSTOMS_OFFICES, 
  AGENCIES, 
  CLIENT_NAMES, 
  QTY_UNITS, 
  LOGO_URL 
} from './constants';

const App: React.FC = () => {
  // Main form state
  const [formData, setFormData] = useState<ReleaseData>({
    releaseNum: '',
    releaseYear: '',
    releaseType: '',
    customsOffice: '',
    agency: '',
    destination: '',
    clientName: '',
    cargoType: '',
    totalQty: '',
    qtyUnit: ''
  });

  // State for "Quantity after inspection"
  const [afterInspection, setAfterInspection] = useState(false);

  // Items list state
  const [items, setItems] = useState<ReleaseItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Focus state for the plate group to manage placeholders
  const [isPlateFocused, setIsPlateFocused] = useState(false);

  // Current item being added
  const [currentItem, setCurrentItem] = useState<{
    containerNum: string;
    plateNum: string;
    plateChars: [string, string, string];
  }>({
    containerNum: '',
    plateNum: '',
    plateChars: ['', '', '']
  });

  const plateCharRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAfterInspection(checked);
    if (checked) {
      // Clear values to show placeholders as requested
      setFormData(prev => ({
        ...prev,
        totalQty: '',
        qtyUnit: ''
      }));
    }
  };

  const handleCurrentItemChange = (field: string, value: string, index?: number) => {
    if (field === 'containerNum') {
      setCurrentItem(prev => ({ ...prev, containerNum: value.toUpperCase().replace(/[^A-Z0-9]/g, '') }));
    } else if (field === 'plateNum') {
      setCurrentItem(prev => ({ ...prev, plateNum: value.replace(/[^0-9]/g, '') }));
    } else if (field === 'plateChar' && typeof index === 'number') {
      const newChars = [...currentItem.plateChars] as [string, string, string];
      newChars[index] = value.replace(/[^\u0621-\u064A]/g, '');
      setCurrentItem(prev => ({ ...prev, plateChars: newChars }));

      // Auto-focus next input
      if (value.length === 1 && index < 2) {
        plateCharRefs[index + 1].current?.focus();
      }
    }
  };

  const checkData = useCallback(() => {
    const { releaseNum, releaseYear, releaseType, customsOffice } = formData;
    if (releaseNum === "1234" && releaseYear === "2026" && releaseType === "نهائي" && customsOffice === "اسكندرية") {
      setFormData(prev => ({
        ...prev,
        agency: "MAE",
        destination: "جنوب افريقيا",
        clientName: "مصر للصباغة والتجهيز",
        cargoType: "تفاح",
        totalQty: afterInspection ? "" : "65",
        qtyUnit: afterInspection ? "" : "بالتة"
      }));
    } else {
      alert("لا توجد بيانات للشهادة");
    }
  }, [formData, afterInspection]);

  const validateForm = () => {
    let required = ['releaseNum', 'releaseYear', 'releaseType', 'customsOffice', 'agency', 'destination', 'clientName', 'cargoType'];
    
    // Only require quantity fields if checkbox is NOT checked
    if (!afterInspection) {
      required.push('totalQty', 'qtyUnit');
    }

    for (const key of required) {
      if (!formData[key as keyof ReleaseData]) {
        alert("برجاء إكمال كافة الحقول الإجبارية أولاً!");
        return false;
      }
    }
    return true;
  };

  const addItem = () => {
    if (!validateForm()) return;

    const { containerNum, plateNum, plateChars } = currentItem;
    
    if (containerNum === "MRKU1234567") {
      alert("لا يوجد بيانات للحاوية");
      return;
    }

    const charCount = plateChars.filter(c => c !== "").length;

    if (plateNum.length < 3 || charCount < 2) {
      alert("خطأ: يجب إدخال رقم السيارة (3 أرقق على الأقل) وحرفين على الأقل.");
      return;
    }

    const newItem: ReleaseItem = {
      id: Math.random().toString(36).substr(2, 9),
      containerNum,
      plateNum,
      plateChars
    };

    setItems(prev => [...prev, newItem]);
    setCurrentItem({ containerNum: '', plateNum: '', plateChars: ['', '', ''] });
  };

  const removeItem = () => {
    if (!selectedItemId) {
      alert("يرجى تحديد عنصر من القائمة للحذف");
      return;
    }
    setItems(prev => prev.filter(item => item.id !== selectedItemId));
    setSelectedItemId(null);
  };

  const submitFinal = () => {
    if (!validateForm()) return;
    if (items.length === 0) {
      alert("أضف حاوية واحدة على الأقل");
      return;
    }
    alert('تم اعتماد الشهادة بنجاح');
  };

  const resetForm = () => {
    if (confirm("هل أنت متأكد من مسح كافة بيانات الشهادة؟")) {
      window.location.reload();
    }
  };

  // Group Focus Handlers
  const handlePlateFocus = () => setIsPlateFocused(true);
  const handlePlateBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsPlateFocused(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="bg-gradient-to-b from-[#79e1e9] to-[#63b5b3] w-full max-w-5xl rounded-[40px] shadow-2xl p-8 md:p-12 overflow-hidden">
        
        {/* Header Logo */}
        <div className="flex justify-center mb-6">
          <div className="shine-wrapper inline-block">
            <img 
              src={LOGO_URL} 
              alt="Logo" 
              className="max-h-24 drop-shadow-lg" 
            />
          </div>
        </div>

        <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-800 mb-8 border-b-2 border-blue-600 pb-4">
          نموذج بيانات الإفراج الجمركي
        </h2>

        {/* First Row: Basic Release Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 items-end">
          <FormGroup label="رقم الإفراج" required>
            <input 
              type="number" 
              id="releaseNum" 
              value={formData.releaseNum}
              onChange={handleInputChange}
              className="form-input" 
              placeholder="أدخل رقم الإفراج" 
            />
          </FormGroup>
          <FormGroup label="سنة الإفراج" required>
            <input 
              type="number" 
              id="releaseYear" 
              value={formData.releaseYear}
              onChange={handleInputChange}
              className="form-input" 
              placeholder="2026" 
            />
          </FormGroup>
          <FormGroup label="نوع الإفراج" required>
            <select 
              id="releaseType" 
              value={formData.releaseType}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="" disabled>اختر النوع</option>
              {RELEASE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="جمرك الإرسال" required>
            <select 
              id="customsOffice" 
              value={formData.customsOffice}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="" disabled>اختر الجمرك</option>
              {CUSTOMS_OFFICES.map(office => <option key={office} value={office}>{office}</option>)}
            </select>
          </FormGroup>
          <div className="flex items-end">
            <button 
              onClick={checkData}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-[54px] rounded-xl transition shadow-md active:scale-95 text-xl"
            >
              فحص البيانات
            </button>
          </div>
        </div>

        {/* Second Row: Commercial Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
          <FormGroup label="التوكيل" required>
            <select 
              id="agency" 
              value={formData.agency}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="" disabled>اختر التوكيل</option>
              {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="الواجهة النهائية" required>
            <input 
              type="text" 
              id="destination" 
              value={formData.destination}
              onChange={handleInputChange}
              className="form-input" 
              placeholder="جهة الوصول" 
            />
          </FormGroup>
          <FormGroup label="اسم العميل" required>
            <select 
              id="clientName" 
              value={formData.clientName}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="" disabled>اختر العميل</option>
              {CLIENT_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormGroup>
        </div>

        {/* Third Row: Cargo Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <FormGroup label="نوع المشمول" required>
            <input 
              type="text" 
              id="cargoType" 
              value={formData.cargoType}
              onChange={handleInputChange}
              className="form-input" 
              placeholder="وصف البضاعة" 
            />
          </FormGroup>
          <div className="flex flex-col gap-2">
            <FormGroup label="الكمية الإجمالية" required={!afterInspection}>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  id="totalQty" 
                  value={formData.totalQty}
                  onChange={handleInputChange}
                  disabled={afterInspection}
                  className={`form-input flex-[2] ${afterInspection ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`} 
                  placeholder="العدد" 
                />
                <select 
                  id="qtyUnit" 
                  value={formData.qtyUnit}
                  onChange={handleInputChange}
                  disabled={afterInspection}
                  className={`form-select flex-1 ${afterInspection ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                >
                  <option value="" disabled>الوحدة</option>
                  {QTY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </FormGroup>
            {/* Checkbox "Quantity after inspection" - Fixed with white fill */}
            <label className="flex items-center gap-3 cursor-pointer mt-1 select-none">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={afterInspection}
                  onChange={handleCheckboxChange}
                  className="w-6 h-6 rounded-lg border-2 border-white bg-white checked:bg-white transition-all appearance-none cursor-pointer focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#63b5b3] shadow-sm"
                />
                {afterInspection && (
                  <svg className="absolute w-4 h-4 text-[#63b5b3] left-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <span className="text-xl font-bold text-white drop-shadow-sm">الكمية بعد الكشف</span>
            </label>
          </div>
        </div>

        {/* Items Management Area */}
        <div className="bg-white/40 backdrop-blur-sm p-6 rounded-3xl border border-white/30 mb-8 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormGroup label="رقم الحاوية">
              <input 
                type="text" 
                maxLength={11}
                value={currentItem.containerNum}
                onChange={(e) => handleCurrentItemChange('containerNum', e.target.value)}
                className="form-input" 
                placeholder="MSCU1234567" 
              />
            </FormGroup>
            
            <FormGroup label="رقم السيارة">
              <div 
                className="flex items-center gap-2 bg-transparent direction-ltr h-[54px]"
                onFocusCapture={handlePlateFocus}
                onBlurCapture={handlePlateBlur}
              >
                {/* Vehicle Number Box */}
                <input 
                  type="text" 
                  maxLength={4}
                  value={currentItem.plateNum}
                  onChange={(e) => handleCurrentItemChange('plateNum', e.target.value)}
                  className="w-20 md:w-24 h-11 text-center text-xl font-bold border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-colors text-black bg-white shadow-sm" 
                  placeholder={isPlateFocused ? "" : "1234"} 
                />
                
                <span className="text-2xl font-bold text-slate-800 px-0.5">/</span>
                
                {/* Plate Characters Boxes */}
                <div className="flex gap-1 direction-rtl">
                  {currentItem.plateChars.map((char, idx) => (
                    <input 
                      key={idx}
                      ref={plateCharRefs[idx]}
                      type="text" 
                      maxLength={1}
                      value={char}
                      onChange={(e) => handleCurrentItemChange('plateChar', e.target.value, idx)}
                      className="w-10 h-11 text-center text-xl font-bold border border-slate-300 rounded-xl outline-none focus:border-blue-500 transition-colors text-black bg-white shadow-sm"
                      placeholder={isPlateFocused ? "" : (['أ', 'ب', 'ج'][idx])}
                    />
                  ))}
                </div>
              </div>
            </FormGroup>

            <div className="flex items-end gap-3">
              <button 
                onClick={addItem}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-[54px] rounded-xl transition shadow-md active:scale-95 text-xl"
              >
                إضافة
              </button>
              <button 
                onClick={removeItem}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold h-[54px] rounded-xl transition shadow-md active:scale-95 text-xl"
              >
                حذف
              </button>
            </div>
          </div>
        </div>

        {/* List Box */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl border-2 border-slate-200 h-48 overflow-y-auto p-2">
            {items.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 italic text-lg">
                لم يتم إضافة أي حاويات بعد...
              </div>
            ) : (
              <ul className="space-y-1">
                {items.map((item, idx) => (
                  <li 
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors border-b border-slate-100 last:border-0 text-lg ${
                      selectedItemId === item.id 
                        ? 'bg-blue-100 border-blue-200 text-blue-800' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-bold me-2">{idx + 1})</span>
                    <span className="me-4 text-black">حاوية: <span className="font-mono">{item.containerNum || '-----------'}</span></span>
                    <span className="opacity-50">||</span>
                    <span className="ms-4 text-black">سيارة: <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-black">[ {item.plateNum} / {item.plateChars.join(' ')} ]</span></span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col md:flex-row gap-4 border-t border-white/30 pt-8">
          <button 
            onClick={submitFinal}
            className="flex-[2] bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl transition shadow-lg active:scale-95 text-xl"
          >
            اعتماد الشهادة
          </button>
          <button 
            onClick={resetForm}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl transition shadow-lg active:scale-95 text-xl"
          >
            مسح بيانات الشهادة
          </button>
        </div>
      </div>

      <style>{`
        /* Hide Number Input Spinners */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type=number] {
          -moz-appearance: textfield;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          font-size: 1.25rem;
          background: white;
          outline: none;
          transition: all 0.2s;
          color: #000000 !important;
          height: 54px;
        }
        .form-select option {
          color: #000000 !important;
          font-size: 1.1rem;
        }
        .form-input:focus, .form-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
        .form-input::placeholder {
          color: #94a3b8;
        }
        .form-input:focus::placeholder {
          color: transparent;
        }
        .direction-ltr { direction: ltr; }
        .direction-rtl { direction: rtl; }
      `}</style>
    </div>
  );
};

interface FormGroupProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, required, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-base md:text-lg font-bold text-slate-700 flex items-center gap-1">
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

export default App;
