// types/pipc.ts
export type PIPCProjectStatus = 'draft' | 'ready' | 'generated';

export interface PIPCClient {
  id: string;
  razon_social: string;
  rfc?: string;
  created_at?: string;
}

export interface PIPCProject {
  id: string;
  client_id: string;
  status: PIPCProjectStatus;
  created_at?: string;
  updated_at?: string;
}

export interface PIPCCompanyInfo {
  project_id: string;
  domicilio?: string;
  colonia?: string;
  municipio?: string;
  estado: string;
  telefono?: string;
  representante_legal?: string;
  email?: string;
}

export interface PIPCOccupancy {
  project_id: string;
  poblacion_fija?: number;
  poblacion_flotante?: number;
  edificios?: number;
  niveles?: number;
}

export interface PIPCUIPC {
  project_id: string;
  responsable?: string;
  coordinador?: string;
  brigadas?: Record<string, string[]>;
}

export interface PIPCRisk {
  id: string;
  project_id: string;
  tipo?: string;
  categoria?: 'interno' | 'externo';
  nivel?: string;
}

export interface PIPCTraining {
  id: string;
  project_id: string;
  curso?: string;
  fecha?: string;
  duracion?: string;
}

export interface PIPCFile {
  project_id: string;
  pdf_url?: string;
  generated_at?: string;
}

// Combined type for full project data
export interface PIPCFullProject {
  project: PIPCProject;
  client: PIPCClient;
  company_info?: PIPCCompanyInfo;
  occupancy?: PIPCOccupancy;
  uipc?: PIPCUIPC;
  risks?: PIPCRisk[];
  training?: PIPCTraining[];
  file?: PIPCFile;
}