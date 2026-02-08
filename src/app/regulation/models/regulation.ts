export interface Regulation {
  id: string;
  uid_regulation: string;
  tipoMonitoreoId: string;
  code: string;
  title: string;
  description: string;
  companyId: string;
  authority?: string;
  status: string;
}
