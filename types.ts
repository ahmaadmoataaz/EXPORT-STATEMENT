
export interface ReleaseData {
  releaseNum: string;
  releaseYear: string;
  releaseType: string;
  customsOffice: string;
  agency: string;
  destination: string;
  clientName: string;
  cargoType: string;
  totalQty: string;
  qtyUnit: string;
}

export interface ReleaseItem {
  id: string;
  containerNum: string;
  plateNum: string;
  plateChars: string[];
}

export enum ReleaseType {
  Final = 'نهائي',
  Temporary = 'سماح مؤقت',
  Drawback = 'دروباك',
  ReExport = 'إعادة تصدير',
  ForeignExport = 'صادر اجنبي',
  TempExport = 'تصدير مؤقت',
  ImmediateRefund = 'رد فوري',
  FirstStage = 'مرحله اولي'
}

export enum CustomsOffice {
  Alexandria = 'اسكندرية',
  Oct6th = '6 أكتوبر',
  Ramadan10th = 'العاشر من رمضان',
  FreeZonesGeneral = 'مناطق حره عامه',
  PortSaid = 'بورسعيد',
  EastPortSaid = 'شرق بورسعيد',
  Ismailia = 'اسماعيلية',
  FreeZonesPrivate = 'مناطق حره خاصة'
}
