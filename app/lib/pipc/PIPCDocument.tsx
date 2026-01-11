import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// Evidence file structure (optional - for future file binding)
interface EvidenceFile {
  url: string;      // Supabase Storage URL
  caption: string;  // Display caption
  type: 'image' | 'pdf';  // File type
}

interface Props {
  data: {
    project: any;
    company_info: any;
    occupancy: any;
    uipc: any;
    risks: any[];
    training: any[];
    // Phase 8: Optional evidence arrays (populated when files exist in storage)
    evidence?: {
      fotos?: EvidenceFile[];      // ANEXO H - Evidencia Fotográfica
      planos?: EvidenceFile[];     // ANEXO I - Planos
      actas?: EvidenceFile[];      // ANEXO J - Firmas y Actas
      bitacoras?: EvidenceFile[];  // ANEXO K - Bitácoras y Dictámenes
    };
  };
}

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 50,
    paddingBottom: 60,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: '#1a1a1a',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#333',
    paddingBottom: 4,
    color: '#000',
    letterSpacing: 0.3,
  },
  paragraph: {
    marginBottom: 8,
    textAlign: 'justify',
    lineHeight: 1.6,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingVertical: 2,
  },
  label: {
    width: '35%',
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    width: '65%',
    color: '#1a1a1a',
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: '#d9d9d9',
  },
  tableCell: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#333',
    justifyContent: 'center',
  },
  tableCellLast: {
    flex: 1,
    padding: 6,
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 9,
    color: '#666',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    paddingTop: 8,
  },
  orgContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  orgBox: {
    borderWidth: 1.5,
    borderColor: '#444',
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginBottom: 6,
    minWidth: 160,
    alignItems: 'center',
  },
  orgBoxPrimary: {
    borderWidth: 2,
    borderColor: '#1e40af',
    backgroundColor: '#dbeafe',
    padding: 12,
    marginBottom: 6,
    minWidth: 200,
    alignItems: 'center',
  },
  orgBoxSecondary: {
    borderWidth: 2,
    borderColor: '#065f46',
    backgroundColor: '#d1fae5',
    padding: 10,
    marginBottom: 6,
    minWidth: 180,
    alignItems: 'center',
  },
  orgConnector: {
    width: 2,
    height: 16,
    backgroundColor: '#444',
  },
  orgTitle: {
    fontSize: 8,
    color: '#555',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orgName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  evidenceImage: {
    maxWidth: '100%',
    maxHeight: 200,
    objectFit: 'contain',
    marginBottom: 6,
  },
  evidenceCaption: {
    fontSize: 9,
    textAlign: 'center',
    color: '#555',
    marginBottom: 12,
    fontStyle: 'italic',
  },
});

export default function PIPCDocument({ data }: Props) {
  // === DATA NORMALIZATION ===
  // Normalize all data shapes to prevent undefined/null access errors
  const project = data.project || {};
  const client = project.pipc_clients || {};
  
  const company_info = {
    domicilio: data.company_info?.domicilio || '',
    colonia: data.company_info?.colonia || '',
    municipio: data.company_info?.municipio || '',
    estado: data.company_info?.estado || 'Baja California',
    telefono: data.company_info?.telefono || '',
    email: data.company_info?.email || '',
    representante_legal: data.company_info?.representante_legal || '',
  };

  const occupancy = {
    poblacion_fija: data.occupancy?.poblacion_fija ?? 0,
    poblacion_flotante: data.occupancy?.poblacion_flotante ?? 0,
    edificios: data.occupancy?.edificios ?? 1,
    niveles: data.occupancy?.niveles ?? 1,
  };

  const uipc = {
    responsable: data.uipc?.responsable || 'Por asignar',
    coordinador: data.uipc?.coordinador || 'Por asignar',
    brigadas: data.uipc?.brigadas || {
      evacuacion: [],
      primeros_auxilios: [],
      prevencion_combate_incendios: [],
      comunicacion: [],
      busqueda_rescate: [],
    },
  };

  // Normalize arrays - ensure they are always arrays
  const risks = Array.isArray(data.risks) ? data.risks : [];
  const training = Array.isArray(data.training) ? data.training : [];

  // Phase 8: Normalize evidence arrays (optional - empty arrays if not provided)
  const evidence = {
    fotos: Array.isArray(data.evidence?.fotos) ? data.evidence.fotos : [],
    planos: Array.isArray(data.evidence?.planos) ? data.evidence.planos : [],
    actas: Array.isArray(data.evidence?.actas) ? data.evidence.actas : [],
    bitacoras: Array.isArray(data.evidence?.bitacoras) ? data.evidence.bitacoras : [],
  };

  // Computed values
  const fullAddress = [company_info.domicilio, company_info.colonia, company_info.municipio, company_info.estado]
    .filter(Boolean)
    .join(', ') || 'Domicilio no especificado';

  // Date helpers - always generate valid past dates
  const yesterdayDate = new Date(Date.now() - 86400000).toLocaleDateString('es-MX');
  const thirtyDaysAgo = new Date(Date.now() - 86400000 * 30).toLocaleDateString('es-MX');
  const sixtyDaysAgo = new Date(Date.now() - 86400000 * 60).toLocaleDateString('es-MX');
  const ninetyDaysAgo = new Date(Date.now() - 86400000 * 90).toLocaleDateString('es-MX');
  const oneYearFromNow = new Date(Date.now() + 86400000 * 365).toLocaleDateString('es-MX');

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <Text style={styles.title}>
          PROGRAMA INTERNO DE PROTECCIÓN CIVIL
        </Text>

        <Text style={styles.subtitle}>
          {client?.razon_social || 'SIN NOMBRE'}
        </Text>

        {/* MARCO JURÍDICO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MARCO JURÍDICO</Text>
          <Text style={styles.paragraph}>
            El presente Programa Interno de Protección Civil se elabora con fundamento en
            la Ley General de Protección Civil, la Ley de Protección Civil y Gestión Integral
            de Riesgos del Estado de Baja California, su reglamento, así como en las Normas
            Oficiales Mexicanas aplicables y demás disposiciones legales vigentes en materia
            de protección civil.
          </Text>
        </View>

        {/* DEFINICIÓN DEL PIPC */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DEFINICIÓN DEL PROGRAMA INTERNO DE PROTECCIÓN CIVIL</Text>
          <Text style={styles.paragraph}>
            El Programa Interno de Protección Civil es el instrumento de planeación y operación
            que se aplica de manera permanente en los inmuebles, con el objetivo de prevenir,
            mitigar y responder ante riesgos y emergencias, salvaguardando la integridad física
            de las personas, los bienes y el entorno.
          </Text>
        </View>

        {/* OBJETIVOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OBJETIVOS DEL PROGRAMA</Text>
          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: 'bold' }}>Objetivo General: </Text>
            Establecer las acciones preventivas, de auxilio y recuperación necesarias para
            proteger a las personas, bienes e instalaciones ante la ocurrencia de una emergencia
            o desastre.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: 'bold' }}>Objetivos Específicos: </Text>
            Identificar riesgos, capacitar al personal, organizar la Unidad Interna de Protección
            Civil y establecer procedimientos de actuación ante situaciones de emergencia.
          </Text>
        </View>

        {/* I. DATOS GENERALES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I. DATOS GENERALES</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Razón Social:</Text>
            <Text style={styles.value}>{client?.razon_social}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>RFC:</Text>
            <Text style={styles.value}>{client?.rfc || 'No especificado'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Domicilio:</Text>
            <Text style={styles.value}>{fullAddress || '—'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>{company_info.telefono || '—'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Correo:</Text>
            <Text style={styles.value}>{company_info.email || '—'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Representante Legal:</Text>
            <Text style={styles.value}>{company_info.representante_legal || '—'}</Text>
          </View>
        </View>

        {/* II. OCUPACIÓN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II. OCUPACIÓN DEL INMUEBLE</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Población fija:</Text>
            <Text style={styles.value}>{occupancy.poblacion_fija}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Población flotante:</Text>
            <Text style={styles.value}>{occupancy.poblacion_flotante}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Edificios:</Text>
            <Text style={styles.value}>{occupancy.edificios}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Niveles:</Text>
            <Text style={styles.value}>{occupancy.niveles}</Text>
          </View>
        </View>

        {/* III. UIPC */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III. UNIDAD INTERNA DE PROTECCIÓN CIVIL</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Responsable:</Text>
            <Text style={styles.value}>{uipc.responsable}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Coordinador:</Text>
            <Text style={styles.value}>{uipc.coordinador}</Text>
          </View>
        </View>

        {/* IV. RIESGOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IV. ANÁLISIS DE RIESGOS</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Tipo</Text>
              <Text style={styles.tableCell}>Categoría</Text>
              <Text style={styles.tableCellLast}>Nivel</Text>
            </View>

            {risks.length === 0 ? (
              <View style={styles.tableRow}>
                <Text style={styles.tableCellLast}>No se registraron riesgos</Text>
              </View>
            ) : (
              risks.map((r, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{r.tipo}</Text>
                  <Text style={styles.tableCell}>{r.categoria}</Text>
                  <Text style={styles.tableCellLast}>{r.nivel}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* V. CAPACITACIÓN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>V. PROGRAMA DE CAPACITACIÓN</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Curso</Text>
              <Text style={styles.tableCell}>Fecha</Text>
              <Text style={styles.tableCellLast}>Duración</Text>
            </View>

            {training.length === 0 ? (
              <View style={styles.tableRow}>
                <Text style={styles.tableCellLast}>No se registraron capacitaciones</Text>
              </View>
            ) : (
              training.map((t, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{t.curso}</Text>
                  <Text style={styles.tableCell}>
                    {t.fecha ? new Date(t.fecha).toLocaleDateString('es-MX') : '—'}
                  </Text>
                  <Text style={styles.tableCellLast}>{t.duracion || '—'}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <Text style={styles.footer}>
          Documento generado automáticamente — {new Date().toLocaleDateString('es-MX')}
        </Text>

      </Page>

      {/* PÁGINA 2: III. PLAN OPERATIVO COMPLETO */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>III. PLAN OPERATIVO COMPLETO</Text>

        {/* SUBPROGRAMA DE PREVENCIÓN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUBPROGRAMA DE PREVENCIÓN</Text>
          <Text style={styles.paragraph}>
            El Subprograma de Prevención tiene como objetivo identificar, evaluar y reducir los riesgos
            a los que está expuesto el inmueble, mediante acciones preventivas y de mitigación.
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Responsable:</Text>
            <Text style={styles.value}>{uipc.coordinador}</Text>
          </View>

          <Text style={[styles.paragraph, { marginTop: 8, fontWeight: 'bold' }]}>
            Acciones preventivas:
          </Text>
          <Text style={styles.paragraph}>• Inspección periódica de instalaciones eléctricas, gas y sistemas contra incendio</Text>
          <Text style={styles.paragraph}>• Mantenimiento preventivo de equipos de seguridad</Text>
          <Text style={styles.paragraph}>• Verificación de rutas de evacuación y salidas de emergencia</Text>
          <Text style={styles.paragraph}>• Capacitación continua del personal en materia de protección civil</Text>
          <Text style={styles.paragraph}>• Actualización del análisis de riesgos</Text>
        </View>

        {/* SUBPROGRAMA DE AUXILIO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUBPROGRAMA DE AUXILIO</Text>
          <Text style={styles.paragraph}>
            El Subprograma de Auxilio establece los procedimientos de respuesta inmediata ante situaciones
            de emergencia, con el fin de salvaguardar la vida de las personas y minimizar daños.
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Responsable:</Text>
            <Text style={styles.value}>{uipc.coordinador}</Text>
          </View>

          <Text style={[styles.paragraph, { marginTop: 8, fontWeight: 'bold' }]}>
            Acciones de auxilio:
          </Text>
          <Text style={styles.paragraph}>• Activación de alarma y notificación de emergencia</Text>
          <Text style={styles.paragraph}>• Evacuación ordenada del inmueble conforme a rutas establecidas</Text>
          <Text style={styles.paragraph}>• Aplicación de primeros auxilios básicos</Text>
          <Text style={styles.paragraph}>• Combate inicial de conatos de incendio</Text>
          <Text style={styles.paragraph}>• Coordinación con servicios de emergencia externos (bomberos, paramédicos, policía)</Text>
          <Text style={styles.paragraph}>• Protección de documentos y bienes de valor crítico</Text>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 2
        </Text>
      </Page>

      {/* PÁGINA 3: SUBPROGRAMA DE RECUPERACIÓN + CALENDARIZACIÓN */}
      <Page size="A4" style={styles.page}>
        {/* SUBPROGRAMA DE RECUPERACIÓN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUBPROGRAMA DE RECUPERACIÓN</Text>
          <Text style={styles.paragraph}>
            El Subprograma de Recuperación tiene como propósito el restablecimiento de las condiciones
            normales de operación tras la ocurrencia de una emergencia o desastre.
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Responsable:</Text>
            <Text style={styles.value}>{uipc?.responsable || 'Por asignar'}</Text>
          </View>

          <Text style={[styles.paragraph, { marginTop: 8, fontWeight: 'bold' }]}>
            Acciones de recuperación:
          </Text>
          <Text style={styles.paragraph}>• Evaluación de daños estructurales y funcionales del inmueble</Text>
          <Text style={styles.paragraph}>• Restablecimiento de servicios básicos (energía eléctrica, agua, comunicaciones)</Text>
          <Text style={styles.paragraph}>• Retorno seguro y ordenado del personal a las instalaciones</Text>
          <Text style={styles.paragraph}>• Limpieza y reparación de daños menores</Text>
          <Text style={styles.paragraph}>• Revisión y actualización del Programa Interno de Protección Civil</Text>
          <Text style={styles.paragraph}>• Informe de la contingencia a las autoridades competentes</Text>
        </View>

        {/* CALENDARIZACIÓN DE ACTIVIDADES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CALENDARIZACIÓN ANUAL DE ACTIVIDADES</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Actividad</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Ene-Mar</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Abr-Jun</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Jul-Sep</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>Oct-Dic</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Inspección de instalaciones</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>X</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>X</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>X</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>X</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Capacitación al personal</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>X</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}></Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>X</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}></Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Simulacros</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}></Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>X</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}></Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>X</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Revisión de equipos de seguridad</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>X</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>X</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>X</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>X</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Actualización del PIPC</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}></Text>
              <Text style={[styles.tableCell, { width: '15%' }]}></Text>
              <Text style={[styles.tableCell, { width: '15%' }]}></Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>X</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 3
        </Text>
      </Page>

      {/* PÁGINA 4: DIRECTORIOS */}
      <Page size="A4" style={styles.page}>
        {/* DIRECTORIO INTERNO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DIRECTORIO INTERNO</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Nombre</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Cargo</Text>
              <Text style={[styles.tableCellLast, { width: '35%' }]}>Teléfono</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>{company_info?.representante_legal || '—'}</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Representante Legal</Text>
              <Text style={[styles.tableCellLast, { width: '35%' }]}>{company_info?.telefono || '—'}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>{uipc?.responsable || '—'}</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Responsable UIPC</Text>
              <Text style={[styles.tableCellLast, { width: '35%' }]}>Por asignar</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>{uipc?.coordinador || '—'}</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Coordinador UIPC</Text>
              <Text style={[styles.tableCellLast, { width: '35%' }]}>Por asignar</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Por asignar</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Jefe de Brigada de Evacuación</Text>
              <Text style={[styles.tableCellLast, { width: '35%' }]}>Por asignar</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Por asignar</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Jefe de Brigada de Primeros Auxilios</Text>
              <Text style={[styles.tableCellLast, { width: '35%' }]}>Por asignar</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Por asignar</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Jefe de Brigada Contra Incendio</Text>
              <Text style={[styles.tableCellLast, { width: '35%' }]}>Por asignar</Text>
            </View>
          </View>
        </View>

        {/* DIRECTORIO DE EMERGENCIAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DIRECTORIO DE EMERGENCIAS</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Institución</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>Teléfono</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Emergencias (Número único)</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>911</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Bomberos</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>066</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Cruz Roja</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>065</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Protección Civil Estatal</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>686 558 1148</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Policía Municipal</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>066</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Comisión Federal de Electricidad</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>071</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>CESPT (Agua)</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>686 554 8000</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 4
        </Text>
      </Page>

      {/* PÁGINA 5: INVENTARIO DE RECURSOS */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>INVENTARIO DE RECURSOS HUMANOS Y MATERIALES</Text>

        {/* RECURSOS HUMANOS */}
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Recursos Humanos:</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Brigada</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Jefe de Brigada</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Integrantes</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Evacuación</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Por asignar</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Por asignar</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Primeros Auxilios</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Por asignar</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Por asignar</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Prevención y Combate de Incendios</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Por asignar</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Por asignar</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Comunicación</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Por asignar</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Por asignar</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Búsqueda y Rescate</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Por asignar</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Por asignar</Text>
            </View>
          </View>
        </View>

        {/* RECURSOS MATERIALES */}
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Recursos Materiales:</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Equipo</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Cantidad</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Ubicación</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Extintores tipo ABC</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Por inventariar</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Distribuidos en el inmueble</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Botiquín de primeros auxilios</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Por inventariar</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Recepción / Enfermería</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Alarma audible</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Por inventariar</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Sistema central</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Señalización de evacuación</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Por inventariar</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Pasillos y salidas</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Detectores de humo</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Por inventariar</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Distribuidos en el inmueble</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Lámparas de emergencia</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Por inventariar</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Pasillos y escaleras</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Planta de emergencia</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Por inventariar</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Área de servicios</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 5
        </Text>
      </Page>

      {/* PÁGINA 6: SEÑALIZACIÓN Y NORMATIVA */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>SEÑALIZACIÓN Y NORMATIVA APLICABLE</Text>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            La señalización de protección civil debe cumplir con la normativa vigente establecida
            en las Normas Oficiales Mexicanas aplicables:
          </Text>

          <Text style={[styles.paragraph, { marginTop: 6, fontWeight: 'bold' }]}>
            Normas Oficiales Mexicanas aplicables:
          </Text>

          <Text style={styles.paragraph}>
            • <Text style={{ fontWeight: 'bold' }}>NOM-002-STPS-2010:</Text> Condiciones de seguridad,
            prevención y protección contra incendios en los centros de trabajo.
          </Text>

          <Text style={styles.paragraph}>
            • <Text style={{ fontWeight: 'bold' }}>NOM-026-STPS-2008:</Text> Colores y señales de seguridad
            e higiene, e identificación de riesgos por fluidos conducidos en tuberías.
          </Text>

          <Text style={styles.paragraph}>
            • <Text style={{ fontWeight: 'bold' }}>NOM-003-SEGOB-2011:</Text> Señales y avisos para protección civil.
            Colores, formas y símbolos a utilizar.
          </Text>

          <Text style={styles.paragraph}>
            • <Text style={{ fontWeight: 'bold' }}>NOM-004-STPS-1999:</Text> Sistemas de protección y dispositivos
            de seguridad en la maquinaria y equipo que se utilice en los centros de trabajo.
          </Text>

          <Text style={[styles.paragraph, { marginTop: 10, fontWeight: 'bold' }]}>
            Tipos de señalización requerida:
          </Text>

          <Text style={styles.paragraph}>• Señales de salida de emergencia (color verde con pictograma de salida)</Text>
          <Text style={styles.paragraph}>• Señales de ruta de evacuación (flechas direccionales verdes)</Text>
          <Text style={styles.paragraph}>• Señales de equipos contra incendio (color rojo con pictograma de extintor)</Text>
          <Text style={styles.paragraph}>• Señales de punto de reunión (color verde con símbolo de agrupación)</Text>
          <Text style={styles.paragraph}>• Señales de botiquín de primeros auxilios (color verde con cruz)</Text>
          <Text style={styles.paragraph}>• Señales restrictivas y prohibitivas (color rojo con diagonal)</Text>
          <Text style={styles.paragraph}>• Señales de advertencia de riesgos específicos (color amarillo con símbolo de peligro)</Text>

          <Text style={[styles.paragraph, { marginTop: 10 }]}>
            Todas las señales deben ser visibles, estar colocadas a una altura de entre 1.50 m y 2.00 m,
            y contar con materiales fotoluminiscentes cuando la normativa lo requiera.
          </Text>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 6
        </Text>
      </Page>

      {/* PÁGINA 7: SIMULACROS */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>PROGRAMA DE SIMULACROS</Text>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Los simulacros son ejercicios prácticos de respuesta ante emergencias que deben realizarse
            de manera periódica para evaluar y mejorar la preparación del personal.
          </Text>

          <Text style={[styles.paragraph, { marginTop: 8, fontWeight: 'bold' }]}>
            Objetivos del simulacro:
          </Text>
          <Text style={styles.paragraph}>• Evaluar la capacidad de respuesta de brigadas y personal</Text>
          <Text style={styles.paragraph}>• Verificar la eficacia de los procedimientos de emergencia</Text>
          <Text style={styles.paragraph}>• Identificar áreas de oportunidad y mejora</Text>
          <Text style={styles.paragraph}>• Familiarizar al personal con rutas de evacuación y puntos de reunión</Text>
          <Text style={styles.paragraph}>• Medir tiempos de evacuación</Text>

          <Text style={[styles.paragraph, { marginTop: 10, fontWeight: 'bold' }]}>
            Periodicidad:
          </Text>
          <Text style={styles.paragraph}>
            Se realizarán al menos dos simulacros al año, programados en los meses de mayo y octubre,
            conforme al calendario nacional de protección civil.
          </Text>

          <Text style={[styles.paragraph, { marginTop: 10, fontWeight: 'bold' }]}>
            Evaluación del simulacro:
          </Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Aspecto a evaluar</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>Observaciones</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Activación de alarma</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}></Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Tiempo de evacuación total</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}></Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Desempeño de brigadas</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}></Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Orden y disciplina durante evacuación</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}></Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Identificación de rutas de evacuación</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}></Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Asistencia al punto de reunión</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}></Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Pase de lista posterior</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}></Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Comunicación interna y externa</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}></Text>
            </View>
          </View>

          <Text style={[styles.paragraph, { marginTop: 10 }]}>
            Responsable de la evaluación: {uipc?.responsable || 'Por asignar'}
          </Text>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 7
        </Text>
      </Page>

      {/* PÁGINA 8: PROCEDIMIENTOS ANTE EMERGENCIAS */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>PROCEDIMIENTOS ANTE EMERGENCIAS</Text>

        {/* SISMO */}
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>PROCEDIMIENTO EN CASO DE SISMO</Text>

          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 6 }]}>Durante el sismo:</Text>
          <Text style={styles.paragraph}>• Mantener la calma y no correr</Text>
          <Text style={styles.paragraph}>• Alejarse de ventanas y objetos que puedan caer</Text>
          <Text style={styles.paragraph}>• Ubicarse en zonas de seguridad (columnas, marcos de puertas, bajo escritorios)</Text>
          <Text style={styles.paragraph}>• No usar elevadores</Text>
          <Text style={styles.paragraph}>• Si está en el exterior, alejarse de edificios y cables eléctricos</Text>

          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 6 }]}>Después del sismo:</Text>
          <Text style={styles.paragraph}>• Evacuar de manera ordenada siguiendo las rutas establecidas</Text>
          <Text style={styles.paragraph}>• Revisar que no haya lesionados y proporcionar primeros auxilios</Text>
          <Text style={styles.paragraph}>• Verificar daños estructurales antes de reingresar</Text>
          <Text style={styles.paragraph}>• Estar alerta ante réplicas</Text>
          <Text style={styles.paragraph}>• Reportar a las autoridades de protección civil</Text>
        </View>

        {/* INCENDIO */}
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>PROCEDIMIENTO EN CASO DE INCENDIO</Text>

          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 6 }]}>Al detectar fuego:</Text>
          <Text style={styles.paragraph}>• Activar la alarma de emergencia</Text>
          <Text style={styles.paragraph}>• Llamar a los bomberos (066 o 911)</Text>
          <Text style={styles.paragraph}>• Si el fuego es pequeño, usar el extintor más cercano (sin poner en riesgo la integridad)</Text>
          <Text style={styles.paragraph}>• Cerrar puertas y ventanas para evitar propagación</Text>
          <Text style={styles.paragraph}>• Evacuar de inmediato si el fuego se sale de control</Text>

          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 6 }]}>Durante la evacuación:</Text>
          <Text style={styles.paragraph}>• Caminar agachado si hay humo</Text>
          <Text style={styles.paragraph}>• No usar elevadores</Text>
          <Text style={styles.paragraph}>• Tocar puertas antes de abrir (si están calientes, buscar ruta alterna)</Text>
          <Text style={styles.paragraph}>• No regresar por objetos personales</Text>
          <Text style={styles.paragraph}>• Reunirse en el punto de encuentro designado</Text>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 8
        </Text>
      </Page>

      {/* PÁGINA 9: MÁS PROCEDIMIENTOS */}
      <Page size="A4" style={styles.page}>
        {/* FUGA DE GAS */}
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>PROCEDIMIENTO EN CASO DE FUGA DE GAS</Text>

          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 6 }]}>Acciones inmediatas:</Text>
          <Text style={styles.paragraph}>• Cerrar la válvula general de gas</Text>
          <Text style={styles.paragraph}>• No encender ni apagar luces o equipos eléctricos</Text>
          <Text style={styles.paragraph}>• Abrir puertas y ventanas para ventilar el área</Text>
          <Text style={styles.paragraph}>• Evacuar el inmueble de manera ordenada</Text>
          <Text style={styles.paragraph}>• Llamar a los bomberos y a la compañía de gas desde el exterior</Text>
          <Text style={styles.paragraph}>• No regresar hasta que personal especializado autorice el ingreso</Text>
        </View>

        {/* AMENAZA DE BOMBA */}
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>PROCEDIMIENTO EN CASO DE AMENAZA DE BOMBA</Text>

          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 6 }]}>Si recibe la amenaza:</Text>
          <Text style={styles.paragraph}>• Mantener la calma y prolongar la conversación</Text>
          <Text style={styles.paragraph}>• Anotar características de la voz, ruidos de fondo y detalles de la amenaza</Text>
          <Text style={styles.paragraph}>• Notificar de inmediato a la UIPC y autoridades competentes</Text>
          <Text style={styles.paragraph}>• Evacuar el inmueble siguiendo instrucciones de autoridades</Text>
          <Text style={styles.paragraph}>• No tocar objetos sospechosos</Text>
          <Text style={styles.paragraph}>• Permitir que personal especializado realice la inspección</Text>
        </View>

        {/* INUNDACIÓN */}
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>PROCEDIMIENTO EN CASO DE INUNDACIÓN</Text>

          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 6 }]}>Acciones preventivas:</Text>
          <Text style={styles.paragraph}>• Revisar drenajes y sistemas de desagüe</Text>
          <Text style={styles.paragraph}>• Proteger documentos importantes en lugares elevados</Text>
          <Text style={styles.paragraph}>• Tener identificadas zonas de riesgo</Text>

          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 6 }]}>Durante la inundación:</Text>
          <Text style={styles.paragraph}>• Desconectar la energía eléctrica</Text>
          <Text style={styles.paragraph}>• Evacuar hacia zonas altas</Text>
          <Text style={styles.paragraph}>• No caminar o conducir por zonas inundadas</Text>
          <Text style={styles.paragraph}>• Mantenerse alejado de instalaciones eléctricas</Text>
          <Text style={styles.paragraph}>• Seguir instrucciones de protección civil</Text>
        </View>

        {/* EMERGENCIA MÉDICA */}
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>PROCEDIMIENTO EN CASO DE EMERGENCIA MÉDICA</Text>

          <Text style={styles.paragraph}>• Llamar a servicios de emergencia (911 o 065)</Text>
          <Text style={styles.paragraph}>• Activar a la brigada de primeros auxilios</Text>
          <Text style={styles.paragraph}>• No mover a la persona lesionada salvo que esté en peligro inminente</Text>
          <Text style={styles.paragraph}>• Aplicar primeros auxilios básicos si está capacitado</Text>
          <Text style={styles.paragraph}>• Mantener informados a familiares y autoridades</Text>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 9
        </Text>
      </Page>

      {/* PÁGINA 10: ACTA CONSTITUTIVA DE LA UIPC */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>ACTA CONSTITUTIVA DE LA UNIDAD INTERNA DE PROTECCIÓN CIVIL</Text>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            En cumplimiento con la Ley General de Protección Civil y la normatividad estatal vigente,
            se constituye formalmente la Unidad Interna de Protección Civil (UIPC) del inmueble
            ubicado en {company_info?.domicilio || '[DOMICILIO]'}, {company_info?.colonia || ''}, {company_info?.municipio || ''}, Baja California.
          </Text>

          <Text style={[styles.paragraph, { marginTop: 10, fontWeight: 'bold' }]}>
            Integrantes de la UIPC:
          </Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '25%' }]}>Cargo</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>Nombre</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>Firma</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>Fecha</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '25%' }]}>Responsable UIPC</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>{uipc.responsable}</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>________________</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>{yesterdayDate}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '25%' }]}>Coordinador</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>{uipc.coordinador}</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>________________</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>{yesterdayDate}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '25%' }]}>Jefe Brigada Evacuación</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>Por asignar</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>________________</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>{yesterdayDate}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '25%' }]}>Jefe Brigada Primeros Aux.</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>Por asignar</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>________________</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>{yesterdayDate}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '25%' }]}>Jefe Brigada Incendio</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>Por asignar</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>________________</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>{yesterdayDate}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '25%' }]}>Jefe Brigada Comunicación</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>Por asignar</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>________________</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>{yesterdayDate}</Text>
            </View>
          </View>

          <Text style={[styles.paragraph, { marginTop: 16 }]}>
            Se da constancia de la constitución formal de esta Unidad Interna de Protección Civil,
            comprometiéndose todos los integrantes a cumplir con las funciones y responsabilidades
            asignadas conforme al presente Programa Interno de Protección Civil.
          </Text>

          <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '45%', textAlign: 'center' }}>
              <Text>________________________________</Text>
              <Text style={{ fontSize: 9 }}>Representante Legal</Text>
              <Text style={{ fontSize: 9 }}>{company_info.representante_legal || 'Nombre'}</Text>
            </View>
            <View style={{ width: '45%', textAlign: 'center' }}>
              <Text>________________________________</Text>
              <Text style={{ fontSize: 9 }}>Responsable UIPC</Text>
              <Text style={{ fontSize: 9 }}>{uipc.responsable}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 10
        </Text>
      </Page>

      {/* PÁGINA 11: ORGANIGRAMA UIPC */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>ORGANIGRAMA DE LA UNIDAD INTERNA DE PROTECCIÓN CIVIL</Text>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            La estructura organizacional de la Unidad Interna de Protección Civil (UIPC) del inmueble
            se describe a continuación conforme a los lineamientos establecidos en la Ley General
            de Protección Civil y su Reglamento:
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>NIVEL 1 — DIRECCIÓN</Text>
          <View style={{ borderLeftWidth: 3, borderLeftColor: '#1e40af', paddingLeft: 12, marginBottom: 12 }}>
            <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 2 }]}>Responsable de la UIPC</Text>
            <Text style={styles.paragraph}>{uipc.responsable}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>NIVEL 2 — COORDINACIÓN</Text>
          <View style={{ borderLeftWidth: 3, borderLeftColor: '#065f46', paddingLeft: 12, marginBottom: 12 }}>
            <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 2 }]}>Coordinador General</Text>
            <Text style={styles.paragraph}>{uipc.coordinador}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 4 }]}>NIVEL 3 — BRIGADAS OPERATIVAS</Text>
          <View style={{ borderLeftWidth: 3, borderLeftColor: '#444', paddingLeft: 12 }}>
            <Text style={styles.paragraph}>• Brigada de Evacuación</Text>
            <Text style={styles.paragraph}>• Brigada de Primeros Auxilios</Text>
            <Text style={styles.paragraph}>• Brigada de Prevención y Combate de Incendios</Text>
            <Text style={styles.paragraph}>• Brigada de Comunicación</Text>
            <Text style={styles.paragraph}>• Brigada de Búsqueda y Rescate</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Cada brigada contará con un Jefe de Brigada y el número de brigadistas necesarios
            de acuerdo con las características del inmueble y la población a proteger.
          </Text>
        </View>

        <View style={{ marginTop: 16, borderWidth: 1, borderColor: '#666', backgroundColor: '#fafafa', padding: 12 }}>
          <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#444', textAlign: 'center' }}>
            NOTA: El organigrama gráfico de la UIPC será integrado como evidencia documental
            en el ANEXO H (Evidencia Fotográfica) una vez formalizada la estructura.
          </Text>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 11
        </Text>
      </Page>

      {/* PÁGINA 12: FUNCIONES POR ROL */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>FUNCIONES Y RESPONSABILIDADES POR ROL</Text>

        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>RESPONSABLE DE LA UIPC</Text>
          <Text style={styles.paragraph}>• Coordinar la elaboración, implementación y actualización del PIPC</Text>
          <Text style={styles.paragraph}>• Representar a la UIPC ante las autoridades de Protección Civil</Text>
          <Text style={styles.paragraph}>• Gestionar los recursos necesarios para las actividades de protección civil</Text>
          <Text style={styles.paragraph}>• Supervisar el cumplimiento de las normas de seguridad</Text>
          <Text style={styles.paragraph}>• Autorizar la realización de simulacros y capacitaciones</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>COORDINADOR GENERAL</Text>
          <Text style={styles.paragraph}>• Coordinar las actividades de las brigadas de emergencia</Text>
          <Text style={styles.paragraph}>• Supervisar la capacitación del personal brigadista</Text>
          <Text style={styles.paragraph}>• Mantener actualizado el directorio de emergencias</Text>
          <Text style={styles.paragraph}>• Dirigir las acciones durante una emergencia real o simulacro</Text>
          <Text style={styles.paragraph}>• Elaborar reportes de evaluación de emergencias y simulacros</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>JEFE DE BRIGADA</Text>
          <Text style={styles.paragraph}>• Organizar y dirigir las actividades de su brigada</Text>
          <Text style={styles.paragraph}>• Verificar que los brigadistas cuenten con capacitación actualizada</Text>
          <Text style={styles.paragraph}>• Revisar periódicamente el equipo y materiales de la brigada</Text>
          <Text style={styles.paragraph}>• Coordinar con otras brigadas durante emergencias</Text>
          <Text style={styles.paragraph}>• Reportar al Coordinador sobre actividades y necesidades</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>BRIGADISTAS</Text>
          <Text style={styles.paragraph}>• Participar activamente en capacitaciones y simulacros</Text>
          <Text style={styles.paragraph}>• Mantener en buen estado el equipo asignado</Text>
          <Text style={styles.paragraph}>• Ejecutar los procedimientos de emergencia según su brigada</Text>
          <Text style={styles.paragraph}>• Reportar situaciones de riesgo detectadas</Text>
          <Text style={styles.paragraph}>• Apoyar en la difusión de la cultura de protección civil</Text>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 12
        </Text>
      </Page>

      {/* PÁGINA 13: BITÁCORAS Y DICTÁMENES */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>BITÁCORAS DE MANTENIMIENTO Y DICTÁMENES</Text>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Se llevará un registro de las actividades de mantenimiento preventivo y correctivo
            de los sistemas y equipos de seguridad, así como de los dictámenes técnicos requeridos.
          </Text>

          <Text style={[styles.paragraph, { marginTop: 10, fontWeight: 'bold' }]}>Bitácora de Mantenimiento:</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '15%' }]}>Fecha</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Equipo/Sistema</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Tipo</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Responsable</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>Próxima Rev.</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '15%' }]}>{thirtyDaysAgo}</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Extintores</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Preventivo</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Proveedor ext.</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>6 meses</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '15%' }]}>{sixtyDaysAgo}</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Sistema de alarma</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Preventivo</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Técnico interno</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>3 meses</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '15%' }]}>{ninetyDaysAgo}</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Lámparas de emergencia</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Preventivo</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Mantenimiento</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>3 meses</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '15%' }]}>{new Date(Date.now() - 86400000 * 120).toLocaleDateString('es-MX')}</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Instalación eléctrica</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Inspección</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Perito elec.</Text>
              <Text style={[styles.tableCellLast, { width: '15%' }]}>12 meses</Text>
            </View>
          </View>

          <Text style={[styles.paragraph, { marginTop: 16, fontWeight: 'bold' }]}>Dictámenes Técnicos Requeridos:</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Dictamen</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Vigencia</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Estado</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Dictamen de instalaciones eléctricas</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Anual</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Por gestionar</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Dictamen de instalaciones de gas</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Anual</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Por gestionar</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Dictamen estructural</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>3 años</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Por gestionar</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 13
        </Text>
      </Page>

      {/* PÁGINA 14: CONTINUIDAD DE OPERACIONES */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>PLAN DE CONTINUIDAD DE OPERACIONES</Text>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            El Plan de Continuidad de Operaciones tiene como objetivo garantizar que las funciones
            críticas del inmueble puedan restablecerse en el menor tiempo posible después de una
            emergencia o desastre.
          </Text>

          <Text style={[styles.paragraph, { marginTop: 10, fontWeight: 'bold' }]}>Objetivos:</Text>
          <Text style={styles.paragraph}>• Minimizar el impacto de interrupciones en las operaciones</Text>
          <Text style={styles.paragraph}>• Proteger la información y documentación crítica</Text>
          <Text style={styles.paragraph}>• Restablecer las operaciones esenciales en el menor tiempo posible</Text>
          <Text style={styles.paragraph}>• Mantener la comunicación con partes interesadas</Text>

          <Text style={[styles.paragraph, { marginTop: 10, fontWeight: 'bold' }]}>Procesos Críticos Identificados:</Text>
          <Text style={styles.paragraph}>• Operaciones administrativas esenciales</Text>
          <Text style={styles.paragraph}>• Servicios básicos (electricidad, agua, comunicaciones)</Text>
          <Text style={styles.paragraph}>• Seguridad del personal e instalaciones</Text>
          <Text style={styles.paragraph}>• Atención a clientes/usuarios (si aplica)</Text>

          <Text style={[styles.paragraph, { marginTop: 10, fontWeight: 'bold' }]}>Estrategias de Continuidad:</Text>
          <Text style={styles.paragraph}>• Respaldo periódico de información digital</Text>
          <Text style={styles.paragraph}>• Identificación de sitio alterno (si es necesario)</Text>
          <Text style={styles.paragraph}>• Cadena de comunicación para notificación de emergencias</Text>
          <Text style={styles.paragraph}>• Procedimientos de trabajo remoto (si aplica)</Text>
          <Text style={styles.paragraph}>• Contacto con proveedores críticos</Text>

          <Text style={[styles.paragraph, { marginTop: 10, fontWeight: 'bold' }]}>Tiempos de Recuperación Objetivo:</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '60%' }]}>Proceso</Text>
              <Text style={[styles.tableCellLast, { width: '40%' }]}>Tiempo Máximo</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '60%' }]}>Comunicación de emergencia</Text>
              <Text style={[styles.tableCellLast, { width: '40%' }]}>Inmediato</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '60%' }]}>Evaluación de daños</Text>
              <Text style={[styles.tableCellLast, { width: '40%' }]}>4 horas</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '60%' }]}>Servicios básicos</Text>
              <Text style={[styles.tableCellLast, { width: '40%' }]}>24 horas</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '60%' }]}>Operaciones mínimas</Text>
              <Text style={[styles.tableCellLast, { width: '40%' }]}>48 horas</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '60%' }]}>Operaciones normales</Text>
              <Text style={[styles.tableCellLast, { width: '40%' }]}>1 semana</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 14
        </Text>
      </Page>

      {/* PÁGINA 15: ANEXOS - PARTE 1 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>ANEXOS</Text>

        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>ANEXO 1: LISTA DE ASISTENCIA A CAPACITACIONES</Text>
          <Text style={styles.paragraph}>
            Las listas de asistencia de las capacitaciones impartidas al personal se encuentran
            archivadas y disponibles para su consulta. A continuación se presenta un formato
            de referencia:
          </Text>

          <View style={[styles.table, { marginTop: 6 }]}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '5%' }]}>No.</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>Nombre del Participante</Text>
              <Text style={[styles.tableCell, { width: '25%' }]}>Área/Puesto</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Firma</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '5%' }]}>1</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}></Text>
              <Text style={[styles.tableCell, { width: '25%' }]}></Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}></Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '5%' }]}>2</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}></Text>
              <Text style={[styles.tableCell, { width: '25%' }]}></Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}></Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '5%' }]}>3</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}></Text>
              <Text style={[styles.tableCell, { width: '25%' }]}></Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}></Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>ANEXO 2: CONSTANCIAS Y RECONOCIMIENTOS</Text>
          <Text style={styles.paragraph}>
            Se anexan copias de las constancias de capacitación, diplomas y reconocimientos
            otorgados al personal brigadista por instituciones de protección civil y organismos
            capacitadores acreditados.
          </Text>
          <Text style={[styles.paragraph, { fontStyle: 'italic', color: '#666' }]}>
            [Espacio reservado para adjuntar constancias]
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>ANEXO 3: REGISTRO DE CAPACITACIONES IMPARTIDAS</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '30%' }]}>Capacitación</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Fecha</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Duración</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Instructor</Text>
            </View>

            {training.length === 0 ? (
              <View style={styles.tableRow}>
                <Text style={styles.tableCellLast}>Sin registros de capacitación</Text>
              </View>
            ) : (
              training.slice(0, 5).map((t, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '30%' }]}>{t.curso}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>
                    {t.fecha ? new Date(t.fecha).toLocaleDateString('es-MX') : '—'}
                  </Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{t.duracion || '—'}</Text>
                  <Text style={[styles.tableCellLast, { width: '30%' }]}>ASME Consultores</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 15
        </Text>
      </Page>

      {/* PÁGINA 16: ANEXOS - PARTE 2 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>ANEXO 4: PLANOS DEL INMUEBLE</Text>
          <Text style={styles.paragraph}>
            Se incluyen los siguientes planos del inmueble como parte integral del Programa
            Interno de Protección Civil:
          </Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Tipo de Plano</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>Descripción</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>Anexo</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Plano arquitectónico</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>Distribución general del inmueble</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>Plano A-1</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Plano de rutas de evacuación</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>Rutas, salidas, puntos de reunión</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>Plano E-1</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Plano de ubicación de equipos</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>Extintores, botiquines, alarmas</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>Plano S-1</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Plano de señalización</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>Ubicación de señales de PC</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>Plano S-2</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Plano de zonas de riesgo</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>Identificación de áreas de riesgo</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>Plano R-1</Text>
            </View>
          </View>

          <Text style={[styles.paragraph, { fontStyle: 'italic', color: '#666', marginTop: 10 }]}>
            [Los planos originales se anexan al final del documento impreso]
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', fontSize: 11 }]}>ANEXO 5: EVIDENCIA FOTOGRÁFICA</Text>
          <Text style={styles.paragraph}>
            Se incluye evidencia fotográfica de los elementos de seguridad y protección civil
            del inmueble:
          </Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '10%' }]}>No.</Text>
              <Text style={[styles.tableCell, { width: '45%' }]}>Descripción</Text>
              <Text style={[styles.tableCellLast, { width: '45%' }]}>Referencia</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '10%' }]}>1</Text>
              <Text style={[styles.tableCell, { width: '45%' }]}>Fachada principal del inmueble</Text>
              <Text style={[styles.tableCellLast, { width: '45%' }]}>Fotografía anexa - F01</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '10%' }]}>2</Text>
              <Text style={[styles.tableCell, { width: '45%' }]}>Extintores instalados</Text>
              <Text style={[styles.tableCellLast, { width: '45%' }]}>Fotografía anexa - F02</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '10%' }]}>3</Text>
              <Text style={[styles.tableCell, { width: '45%' }]}>Señalización de evacuación</Text>
              <Text style={[styles.tableCellLast, { width: '45%' }]}>Fotografía anexa - F03</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '10%' }]}>4</Text>
              <Text style={[styles.tableCell, { width: '45%' }]}>Punto de reunión</Text>
              <Text style={[styles.tableCellLast, { width: '45%' }]}>Fotografía anexa - F04</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '10%' }]}>5</Text>
              <Text style={[styles.tableCell, { width: '45%' }]}>Botiquín de primeros auxilios</Text>
              <Text style={[styles.tableCellLast, { width: '45%' }]}>Fotografía anexa - F05</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '10%' }]}>6</Text>
              <Text style={[styles.tableCell, { width: '45%' }]}>Tablero eléctrico principal</Text>
              <Text style={[styles.tableCellLast, { width: '45%' }]}>Fotografía anexa - F06</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '10%' }]}>7</Text>
              <Text style={[styles.tableCell, { width: '45%' }]}>Capacitación del personal</Text>
              <Text style={[styles.tableCellLast, { width: '45%' }]}>Fotografía anexa - F07</Text>
            </View>
          </View>

          <Text style={[styles.paragraph, { fontStyle: 'italic', color: '#666', marginTop: 10 }]}>
            [Las fotografías originales se anexan al final del documento impreso]
          </Text>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 16
        </Text>
      </Page>

      {/* PÁGINA 17: MARCO JURÍDICO COMPLETO */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>VI. MARCO JURÍDICO</Text>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            El presente Programa Interno de Protección Civil se fundamenta en el siguiente marco normativo:
          </Text>
          <Text style={styles.paragraph}>• Ley General de Protección Civil</Text>
          <Text style={styles.paragraph}>• Ley de Protección Civil del Estado de Baja California</Text>
          <Text style={styles.paragraph}>• Reglamento de Protección Civil Municipal</Text>
          <Text style={styles.paragraph}>• NOM-002-STPS-2010: Condiciones de seguridad - Prevención y protección contra incendios</Text>
          <Text style={styles.paragraph}>• NOM-003-SEGOB-2011: Señales y avisos para protección civil</Text>
          <Text style={styles.paragraph}>• NOM-004-SEGOB-2014: Señalización y equipamiento de emergencias</Text>
        </View>

        <Text style={styles.sectionTitle}>VII. DEFINICIÓN DEL PROGRAMA INTERNO DE PROTECCIÓN CIVIL</Text>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            El Programa Interno de Protección Civil (PIPC) es un instrumento de planeación y operación
            que describe las acciones destinadas a la salvaguarda de la integridad física de los empleados,
            visitantes y personas que concurren a las instalaciones, así como a proteger los bienes e
            información, mediante acciones preventivas y planes de respuesta ante situaciones de emergencia
            o desastre. Su implementación es de carácter obligatorio conforme a la normatividad vigente.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>VIII. OBJETIVOS DEL PIPC</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>8.1 Objetivo General:</Text>
          <Text style={styles.paragraph}>
            Establecer las bases de organización y los procedimientos de actuación de la Unidad Interna
            de Protección Civil, a fin de salvaguardar la integridad física de las personas, los bienes
            y el entorno ante la eventualidad de una emergencia o desastre.
          </Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 8 }]}>8.2 Objetivos Específicos:</Text>
          <Text style={styles.paragraph}>• Salvaguardar la vida e integridad física de las personas que ocupan el inmueble</Text>
          <Text style={styles.paragraph}>• Identificar, evaluar y reducir los riesgos internos y externos</Text>
          <Text style={styles.paragraph}>• Establecer procedimientos de preparación y respuesta ante emergencias</Text>
          <Text style={styles.paragraph}>• Promover la coordinación institucional con autoridades de protección civil</Text>
          <Text style={styles.paragraph}>• Capacitar al personal en materia de prevención y respuesta</Text>
          <Text style={styles.paragraph}>• Garantizar la continuidad de operaciones tras una emergencia</Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 17</Text>
      </Page>

      {/* PÁGINA 18: ACTA CONSTITUTIVA UIPC */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>IX. ACTA CONSTITUTIVA DE LA UNIDAD INTERNA DE PROTECCIÓN CIVIL</Text>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            En cumplimiento con las disposiciones legales aplicables en materia de protección civil,
            se constituye formalmente la Unidad Interna de Protección Civil del inmueble, con la
            siguiente estructura:
          </Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '30%' }]}>Cargo</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>Nombre</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Firma</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '30%' }]}>Responsable UIPC</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>{uipc.responsable}</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>________________</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '30%' }]}>Coordinador</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>{uipc.coordinador}</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>________________</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '30%' }]}>Vocal 1</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>________________</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '30%' }]}>Vocal 2</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>________________</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '30%' }]}>Jefe Brigada Evacuación</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>________________</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '30%' }]}>Jefe Brigada Primeros Aux.</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>________________</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '30%' }]}>Jefe Brigada Incendio</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>________________</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '30%' }]}>Brigadistas</Text>
              <Text style={[styles.tableCell, { width: '40%' }]}>[Listado en anexo]</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>________________</Text>
            </View>
          </View>
          <Text style={[styles.paragraph, { marginTop: 12, fontStyle: 'italic', fontSize: 9 }]}>
            Fecha de constitución: {yesterdayDate}
          </Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 18</Text>
      </Page>

      {/* PÁGINA 19: ESTRUCTURA ORGÁNICA */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>X. ESTRUCTURA ORGÁNICA DE LA UIPC</Text>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            La Unidad Interna de Protección Civil se organiza de la siguiente manera jerárquica:
          </Text>
          <View style={{ marginTop: 12, marginLeft: 20 }}>
            <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>NIVEL 1: RESPONSABLE DEL INMUEBLE</Text>
            <Text style={[styles.paragraph, { marginLeft: 20 }]}>└─ {uipc.responsable}</Text>
            <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 8 }]}>NIVEL 2: COORDINADOR UIPC</Text>
            <Text style={[styles.paragraph, { marginLeft: 20 }]}>└─ {uipc.coordinador}</Text>
            <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 8 }]}>NIVEL 3: JEFES DE BRIGADA</Text>
            <Text style={[styles.paragraph, { marginLeft: 20 }]}>├─ Jefe de Brigada de Evacuación: —</Text>
            <Text style={[styles.paragraph, { marginLeft: 20 }]}>├─ Jefe de Brigada de Primeros Auxilios: —</Text>
            <Text style={[styles.paragraph, { marginLeft: 20 }]}>├─ Jefe de Brigada Contra Incendio: —</Text>
            <Text style={[styles.paragraph, { marginLeft: 20 }]}>├─ Jefe de Brigada de Comunicación: —</Text>
            <Text style={[styles.paragraph, { marginLeft: 20 }]}>└─ Jefe de Brigada de Búsqueda y Rescate: —</Text>
            <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 8 }]}>NIVEL 4: BRIGADISTAS</Text>
            <Text style={[styles.paragraph, { marginLeft: 20 }]}>└─ [Listado completo en anexo de integrantes]</Text>
          </View>
          <Text style={[styles.paragraph, { marginTop: 16, fontStyle: 'italic', color: '#666', fontSize: 9 }]}>
            NOTA: El organigrama visual se incorporará en una fase posterior de desarrollo del documento.
          </Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 19</Text>
      </Page>

      {/* PÁGINA 20: FUNCIONES POR ROL */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>XI. FUNCIONES Y RESPONSABILIDADES POR ROL</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>RESPONSABLE DEL INMUEBLE:</Text>
          <Text style={styles.paragraph}>• Autorizar y validar el Programa Interno de Protección Civil</Text>
          <Text style={styles.paragraph}>• Proporcionar los recursos necesarios para su implementación</Text>
          <Text style={styles.paragraph}>• Designar al Coordinador de la UIPC</Text>
          <Text style={styles.paragraph}>• Aprobar el calendario de capacitaciones y simulacros</Text>
          <Text style={styles.paragraph}>• Representar al inmueble ante las autoridades de protección civil</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>COORDINADOR DE LA UIPC:</Text>
          <Text style={styles.paragraph}>• Elaborar, implementar y actualizar el PIPC</Text>
          <Text style={styles.paragraph}>• Coordinar las acciones de las brigadas</Text>
          <Text style={styles.paragraph}>• Organizar capacitaciones y simulacros</Text>
          <Text style={styles.paragraph}>• Mantener actualizado el directorio de emergencias</Text>
          <Text style={styles.paragraph}>• Supervisar el mantenimiento de equipos de seguridad</Text>
          <Text style={styles.paragraph}>• Elaborar reportes de incidentes y simulacros</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>JEFES DE BRIGADA:</Text>
          <Text style={styles.paragraph}>• Dirigir las acciones de su brigada durante emergencias</Text>
          <Text style={styles.paragraph}>• Capacitar a los brigadistas a su cargo</Text>
          <Text style={styles.paragraph}>• Verificar el estado del equipo asignado</Text>
          <Text style={styles.paragraph}>• Reportar al Coordinador sobre necesidades y actividades</Text>
          <Text style={styles.paragraph}>• Participar en la planeación de simulacros</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>BRIGADISTAS:</Text>
          <Text style={styles.paragraph}>• Asistir a capacitaciones programadas</Text>
          <Text style={styles.paragraph}>• Participar activamente en simulacros</Text>
          <Text style={styles.paragraph}>• Ejecutar las acciones asignadas durante emergencias</Text>
          <Text style={styles.paragraph}>• Reportar condiciones inseguras al Jefe de Brigada</Text>
          <Text style={styles.paragraph}>• Mantener en buen estado el equipo asignado</Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 20</Text>
      </Page>

      {/* PÁGINA 21: SUBPROGRAMAS DE PROTECCIÓN CIVIL */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>XII. SUBPROGRAMAS DE PROTECCIÓN CIVIL</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>12.1 SUBPROGRAMA DE PREVENCIÓN</Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 4 }]}>Objetivo:</Text>
          <Text style={styles.paragraph}>
            Identificar, evaluar y reducir los riesgos a los que está expuesto el inmueble mediante
            acciones preventivas y de mitigación.
          </Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Actividades generales:</Text>
          <Text style={styles.paragraph}>• Análisis de riesgos periódico</Text>
          <Text style={styles.paragraph}>• Inspecciones de seguridad</Text>
          <Text style={styles.paragraph}>• Mantenimiento preventivo de instalaciones</Text>
          <Text style={styles.paragraph}>• Capacitación continua del personal</Text>
          <Text style={styles.paragraph}>• Difusión de cultura de protección civil</Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Responsable:</Text>
          <Text style={styles.paragraph}>Coordinador de la UIPC</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>12.2 SUBPROGRAMA DE AUXILIO</Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 4 }]}>Objetivo:</Text>
          <Text style={styles.paragraph}>
            Establecer los procedimientos de respuesta inmediata ante situaciones de emergencia
            para salvaguardar la vida de las personas.
          </Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Actividades generales:</Text>
          <Text style={styles.paragraph}>• Activación del plan de emergencia</Text>
          <Text style={styles.paragraph}>• Evacuación ordenada del inmueble</Text>
          <Text style={styles.paragraph}>• Atención de primeros auxilios</Text>
          <Text style={styles.paragraph}>• Combate de conatos de incendio</Text>
          <Text style={styles.paragraph}>• Coordinación con servicios de emergencia</Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Responsable:</Text>
          <Text style={styles.paragraph}>Coordinador de la UIPC y Jefes de Brigada</Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 21</Text>
      </Page>

      {/* PÁGINA 22: SUBPROGRAMA RECUPERACIÓN + CALENDARIZACIÓN */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>12.3 SUBPROGRAMA DE RECUPERACIÓN</Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 4 }]}>Objetivo:</Text>
          <Text style={styles.paragraph}>
            Restablecer las condiciones normales de operación del inmueble tras la ocurrencia
            de una emergencia o desastre.
          </Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Actividades generales:</Text>
          <Text style={styles.paragraph}>• Evaluación de daños</Text>
          <Text style={styles.paragraph}>• Restablecimiento de servicios básicos</Text>
          <Text style={styles.paragraph}>• Retorno seguro a las instalaciones</Text>
          <Text style={styles.paragraph}>• Reparación de daños</Text>
          <Text style={styles.paragraph}>• Actualización del PIPC con lecciones aprendidas</Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Responsable:</Text>
          <Text style={styles.paragraph}>Responsable del inmueble y Coordinador UIPC</Text>
        </View>
        <Text style={styles.sectionTitle}>XIII. CALENDARIZACIÓN GENERAL DE ACTIVIDADES</Text>
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Actividad</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Periodicidad</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Responsable</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Capacitación de brigadas</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Semestral</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Coordinador UIPC</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Simulacros</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Semestral</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Coordinador UIPC</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Mantenimiento de extintores</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Anual</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Proveedor externo</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Revisión de instalaciones</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Trimestral</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Mantenimiento</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Actualización del PIPC</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Anual</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Coordinador UIPC</Text>
            </View>
          </View>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 22</Text>
      </Page>

      {/* PÁGINA 23: DIRECTORIOS */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>XIV. DIRECTORIOS</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>14.1 DIRECTORIO INTERNO</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Cargo</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>Nombre</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>Teléfono</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Responsable UIPC</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>{uipc.responsable}</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Coordinador UIPC</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>{uipc.coordinador}</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Jefe Brigada Evacuación</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Jefe Brigada Primeros Aux.</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Jefe Brigada Incendio</Text>
              <Text style={[styles.tableCell, { width: '35%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '30%' }]}>—</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>14.2 DIRECTORIO DE EMERGENCIAS</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Institución</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>Teléfono</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Emergencias (Número único)</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>911</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Protección Civil Estatal</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Bomberos</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Cruz Roja</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '50%' }]}>Policía Municipal</Text>
              <Text style={[styles.tableCellLast, { width: '50%' }]}>—</Text>
            </View>
          </View>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 23</Text>
      </Page>

      {/* PÁGINA 24: INVENTARIO DE RECURSOS */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>XV. INVENTARIO DE RECURSOS</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>15.1 RECURSOS HUMANOS</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Brigada</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Cantidad</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>Capacitados</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>Estado</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Evacuación</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>—</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Primeros Auxilios</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>—</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Contra Incendio</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>—</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>Comunicación</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>—</Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>—</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>15.2 RECURSOS MATERIALES</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Recurso</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>Cantidad</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Ubicación</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>Estado</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Extintores</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>—</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Botiquines</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>—</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Señalización</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>—</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Lámparas de emergencia</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>—</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>—</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>Alarma audible</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>—</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>—</Text>
              <Text style={[styles.tableCellLast, { width: '20%' }]}>—</Text>
            </View>
          </View>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 24</Text>
      </Page>

      {/* PÁGINA 25: SEÑALIZACIÓN, MANTENIMIENTO, SIMULACROS */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>XVI. SEÑALIZACIÓN Y PLANOS</Text>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            El inmueble cuenta con señalización conforme a la normatividad vigente (NOM-003-SEGOB-2011),
            incluyendo señales de evacuación, prohibición, obligación y precaución. Los planos de
            ubicación de señalización, rutas de evacuación y puntos de reunión se anexan en la
            sección de anexos del presente documento.
          </Text>
        </View>
        <Text style={styles.sectionTitle}>XVII. MANTENIMIENTO Y DICTÁMENES</Text>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Se llevarán bitácoras de mantenimiento preventivo y correctivo de los sistemas y
            equipos de seguridad del inmueble, incluyendo:
          </Text>
          <Text style={styles.paragraph}>• Mantenimiento de extintores (anual)</Text>
          <Text style={styles.paragraph}>• Revisión de instalaciones eléctricas</Text>
          <Text style={styles.paragraph}>• Revisión de instalaciones de gas (si aplica)</Text>
          <Text style={styles.paragraph}>• Verificación de sistemas de alarma</Text>
          <Text style={styles.paragraph}>• Mantenimiento de lámparas de emergencia</Text>
          <Text style={[styles.paragraph, { marginTop: 8 }]}>
            Los dictámenes técnicos requeridos por la autoridad se mantendrán vigentes y
            disponibles para su consulta.
          </Text>
        </View>
        <Text style={styles.sectionTitle}>XVIII. SIMULACROS</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>Tipos de simulacro:</Text>
          <Text style={styles.paragraph}>• Simulacro de gabinete (sin movimiento físico)</Text>
          <Text style={styles.paragraph}>• Simulacro con previo aviso</Text>
          <Text style={styles.paragraph}>• Simulacro sin previo aviso</Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 8 }]}>Evaluación:</Text>
          <Text style={styles.paragraph}>
            Cada simulacro será evaluado mediante cédula de observación, midiendo tiempos de
            evacuación, participación del personal y desempeño de brigadas.
          </Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 8 }]}>Mejora continua:</Text>
          <Text style={styles.paragraph}>
            Los resultados de cada simulacro se documentarán y las áreas de oportunidad
            identificadas se integrarán al proceso de mejora del PIPC.
          </Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 25</Text>
      </Page>

      {/* PÁGINA 26: PROCEDIMIENTOS DE EMERGENCIA */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>XIX. PROCEDIMIENTOS DE EMERGENCIA</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>19.1 PROCEDIMIENTO EN CASO DE SISMO</Text>
          <Text style={styles.paragraph}>• Mantener la calma, no correr</Text>
          <Text style={styles.paragraph}>• Alejarse de ventanas y objetos que puedan caer</Text>
          <Text style={styles.paragraph}>• Ubicarse en zona de seguridad o bajo escritorio</Text>
          <Text style={styles.paragraph}>• Al término del sismo, evacuar ordenadamente</Text>
          <Text style={styles.paragraph}>• Reunirse en el punto de encuentro</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>19.2 PROCEDIMIENTO EN CASO DE INCENDIO</Text>
          <Text style={styles.paragraph}>• Activar alarma de emergencia</Text>
          <Text style={styles.paragraph}>• Llamar a bomberos (911)</Text>
          <Text style={styles.paragraph}>• Si es seguro, usar extintor en conato</Text>
          <Text style={styles.paragraph}>• Evacuar agachado si hay humo</Text>
          <Text style={styles.paragraph}>• No usar elevadores</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>19.3 PROCEDIMIENTO EN CASO DE FUGA DE GAS</Text>
          <Text style={styles.paragraph}>• No encender ni apagar luces</Text>
          <Text style={styles.paragraph}>• Cerrar válvula general de gas</Text>
          <Text style={styles.paragraph}>• Abrir puertas y ventanas</Text>
          <Text style={styles.paragraph}>• Evacuar el inmueble</Text>
          <Text style={styles.paragraph}>• Llamar a bomberos desde el exterior</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>19.4 PROCEDIMIENTO EN CASO DE AMENAZA DE BOMBA</Text>
          <Text style={styles.paragraph}>• Mantener la calma</Text>
          <Text style={styles.paragraph}>• Prolongar la conversación si es posible</Text>
          <Text style={styles.paragraph}>• Notificar a autoridades</Text>
          <Text style={styles.paragraph}>• No tocar objetos sospechosos</Text>
          <Text style={styles.paragraph}>• Evacuar según instrucciones</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>19.5 PROCEDIMIENTO EN CASO DE INUNDACIÓN</Text>
          <Text style={styles.paragraph}>• Desconectar energía eléctrica</Text>
          <Text style={styles.paragraph}>• Proteger documentos importantes</Text>
          <Text style={styles.paragraph}>• Evacuar a zonas altas</Text>
          <Text style={styles.paragraph}>• No caminar por zonas inundadas</Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 26</Text>
      </Page>

      {/* PÁGINA 27: CONTINUIDAD Y ANEXOS */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>XX. CONTINUIDAD DE OPERACIONES</Text>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            El Plan de Continuidad de Operaciones establece las acciones para mantener o
            restablecer las funciones críticas del inmueble después de una emergencia.
          </Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 8 }]}>Procesos críticos identificados:</Text>
          <Text style={styles.paragraph}>• Operaciones administrativas esenciales</Text>
          <Text style={styles.paragraph}>• Atención a clientes/usuarios</Text>
          <Text style={styles.paragraph}>• Sistemas de información</Text>
          <Text style={styles.paragraph}>• Comunicaciones</Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 8 }]}>Recursos esenciales:</Text>
          <Text style={styles.paragraph}>• Personal clave</Text>
          <Text style={styles.paragraph}>• Equipos y sistemas</Text>
          <Text style={styles.paragraph}>• Documentación crítica</Text>
          <Text style={styles.paragraph}>• Proveedores y servicios externos</Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 8 }]}>Recuperación post-evento:</Text>
          <Text style={styles.paragraph}>• Evaluación de daños</Text>
          <Text style={styles.paragraph}>• Activación de respaldos</Text>
          <Text style={styles.paragraph}>• Comunicación con partes interesadas</Text>
          <Text style={styles.paragraph}>• Retorno gradual a operaciones normales</Text>
        </View>
        <Text style={styles.sectionTitle}>XXI. ANEXOS</Text>
        <View style={styles.section}>
          <Text style={styles.paragraph}>El presente Programa Interno de Protección Civil incluye los siguientes anexos:</Text>
          <Text style={styles.paragraph}>• Anexo A: Listas de asistencia a capacitaciones</Text>
          <Text style={styles.paragraph}>• Anexo B: Evidencia fotográfica del inmueble y equipos</Text>
          <Text style={styles.paragraph}>• Anexo C: Planos de ubicación, rutas de evacuación y señalización</Text>
          <Text style={styles.paragraph}>• Anexo D: Constancias y reconocimientos de capacitación</Text>
          <Text style={styles.paragraph}>• Anexo E: Dictámenes técnicos vigentes</Text>
          <Text style={styles.paragraph}>• Anexo F: Cédulas de evaluación de simulacros</Text>
          <Text style={[styles.paragraph, { fontStyle: 'italic', color: '#666', marginTop: 10 }]}>
            Los anexos referidos se integran al final del documento impreso.
          </Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 27</Text>
      </Page>

      {/* PÁGINA 28 (FINAL): FIRMAS Y VALIDACIÓN */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>VALIDACIÓN DEL PROGRAMA INTERNO DE PROTECCIÓN CIVIL</Text>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            El presente Programa Interno de Protección Civil ha sido elaborado conforme a la
            normatividad vigente y contiene la información necesaria para la prevención, auxilio
            y recuperación ante emergencias y desastres.
          </Text>

          <Text style={[styles.paragraph, { marginTop: 10 }]}>
            Fecha de elaboración: {yesterdayDate}
          </Text>
          <Text style={styles.paragraph}>
            Vigencia: Un año a partir de su aprobación
          </Text>
          <Text style={styles.paragraph}>
            Próxima actualización: {oneYearFromNow}
          </Text>
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 30 }]}>FIRMAS DE VALIDACIÓN:</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 50 }}>
            <View style={{ width: '45%', textAlign: 'center' }}>
              <Text style={{ marginBottom: 40 }}>________________________________</Text>
              <Text style={{ fontWeight: 'bold' }}>{company_info.representante_legal || 'Representante Legal'}</Text>
              <Text style={{ fontSize: 9 }}>Representante Legal</Text>
              <Text style={{ fontSize: 9 }}>{client.razon_social || 'Razón Social'}</Text>
            </View>
            <View style={{ width: '45%', textAlign: 'center' }}>
              <Text style={{ marginBottom: 40 }}>________________________________</Text>
              <Text style={{ fontWeight: 'bold' }}>{uipc.responsable}</Text>
              <Text style={{ fontSize: 9 }}>Responsable de la Unidad Interna</Text>
              <Text style={{ fontSize: 9 }}>de Protección Civil</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
            <View style={{ width: '45%', textAlign: 'center' }}>
              <Text style={{ marginBottom: 40 }}>________________________________</Text>
              <Text style={{ fontWeight: 'bold' }}>Elaboró</Text>
              <Text style={{ fontSize: 9 }}>ASME Consultores</Text>
              <Text style={{ fontSize: 9 }}>Consultoría en Protección Civil</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 40, padding: 10, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#f9f9f9' }}>
          <Text style={{ fontSize: 8, textAlign: 'center', color: '#666' }}>
            Este documento es propiedad de {client.razon_social || 'la empresa'} y fue elaborado por ASME Consultores.
            Su reproducción total o parcial está prohibida sin autorización expresa.
          </Text>
        </View>

        <Text style={styles.footer}>
          Programa Interno de Protección Civil — Pág. 28
        </Text>
      </Page>

      {/* ============================================================ */}
      {/* SECCIÓN DE ANEXOS - FASE 7 ARCHITECTURE */}
      {/* ============================================================ */}

      {/* PORTADA DE ANEXOS */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>ANEXOS</Text>
          <Text style={{ fontSize: 14, marginBottom: 40 }}>PROGRAMA INTERNO DE PROTECCIÓN CIVIL</Text>
          <Text style={{ fontSize: 12 }}>{client.razon_social || 'EMPRESA'}</Text>
          <View style={{ marginTop: 60, width: '80%' }}>
            <Text style={{ fontSize: 10, marginBottom: 8 }}>ANEXO A: Marco Jurídico</Text>
            <Text style={{ fontSize: 10, marginBottom: 8 }}>ANEXO B: Objetivos del PIPC</Text>
            <Text style={{ fontSize: 10, marginBottom: 8 }}>ANEXO C: Definición del Programa Interno</Text>
            <Text style={{ fontSize: 10, marginBottom: 8 }}>ANEXO D: Subprogramas</Text>
            <Text style={{ fontSize: 10, marginBottom: 8 }}>ANEXO E: Procedimientos de Emergencia</Text>
            <Text style={{ fontSize: 10, marginBottom: 8 }}>ANEXO F: Fichas de Riesgo</Text>
            <Text style={{ fontSize: 10, marginBottom: 8 }}>ANEXO G: Fichas de Capacitación</Text>
            <Text style={{ fontSize: 10, marginBottom: 8 }}>ANEXO H: Evidencia Fotográfica</Text>
            <Text style={{ fontSize: 10, marginBottom: 8 }}>ANEXO I: Planos de Evacuación</Text>
            <Text style={{ fontSize: 10, marginBottom: 8 }}>ANEXO J: Firmas y Actas</Text>
            <Text style={{ fontSize: 10, marginBottom: 8 }}>ANEXO K: Bitácoras y Dictámenes</Text>
          </View>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 29</Text>
      </Page>

      {/* ANEXO A: MARCO JURÍDICO (STATIC) */}
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>ANEXO A</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 20 }}>MARCO JURÍDICO</Text>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            El presente Programa Interno de Protección Civil se fundamenta en el siguiente marco normativo:
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>A.1 LEY GENERAL DE PROTECCIÓN CIVIL</Text>
          <Text style={styles.paragraph}>
            Publicada en el Diario Oficial de la Federación el 6 de junio de 2012. Establece las bases de
            coordinación entre la Federación, las Entidades Federativas y los Municipios en materia de
            protección civil. Define la obligatoriedad de los programas internos para inmuebles con
            afluencia de personas.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>A.2 LEY DE PROTECCIÓN CIVIL DEL ESTADO DE BAJA CALIFORNIA</Text>
          <Text style={styles.paragraph}>
            Establece las disposiciones específicas para el estado en materia de protección civil,
            incluyendo los requisitos para la elaboración, implementación y actualización de los
            programas internos de protección civil.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>A.3 REGLAMENTOS MUNICIPALES</Text>
          <Text style={styles.paragraph}>
            Reglamento de Protección Civil del municipio correspondiente, que establece los requisitos
            documentales, procedimientos de autorización y criterios de evaluación para inmuebles
            dentro de la jurisdicción municipal.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>A.4 NORMAS OFICIALES MEXICANAS APLICABLES</Text>
          <Text style={styles.paragraph}>• NOM-002-STPS-2010: Condiciones de seguridad - Prevención y protección contra incendios</Text>
          <Text style={styles.paragraph}>• NOM-003-SEGOB-2011: Señales y avisos para protección civil</Text>
          <Text style={styles.paragraph}>• NOM-004-SEGOB-2014: Equipo de seguridad para brigadas de protección civil</Text>
          <Text style={styles.paragraph}>• NOM-026-STPS-2008: Colores y señales de seguridad e higiene</Text>
          <Text style={styles.paragraph}>• NOM-001-SEDE-2012: Instalaciones eléctricas (utilización)</Text>
          <Text style={styles.paragraph}>• NOM-017-STPS-2008: Equipo de protección personal</Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 30</Text>
      </Page>

      {/* ANEXO B: OBJETIVOS DEL PIPC (STATIC) */}
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>ANEXO B</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 20 }}>OBJETIVOS DEL PROGRAMA INTERNO DE PROTECCIÓN CIVIL</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>B.1 OBJETIVO GENERAL</Text>
          <Text style={styles.paragraph}>
            Establecer las acciones preventivas, de auxilio y recuperación destinadas a salvaguardar
            la integridad física de las personas, proteger los bienes y preservar el entorno del inmueble
            ante la eventualidad de un agente perturbador de origen natural o antropogénico.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>B.2 OBJETIVOS ESPECÍFICOS</Text>
          <Text style={styles.paragraph}>• Identificar y evaluar los riesgos internos y externos que pueden afectar al inmueble</Text>
          <Text style={styles.paragraph}>• Establecer medidas preventivas para reducir la vulnerabilidad</Text>
          <Text style={styles.paragraph}>• Organizar y capacitar a la Unidad Interna de Protección Civil</Text>
          <Text style={styles.paragraph}>• Definir procedimientos de actuación ante emergencias</Text>
          <Text style={styles.paragraph}>• Establecer los mecanismos de coordinación con autoridades</Text>
          <Text style={styles.paragraph}>• Implementar un programa de mantenimiento de equipos de seguridad</Text>
          <Text style={styles.paragraph}>• Realizar simulacros periódicos para evaluar la respuesta</Text>
          <Text style={styles.paragraph}>• Garantizar la continuidad de operaciones tras una emergencia</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>B.3 ENFOQUE DEL PROGRAMA</Text>
          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: 'bold' }}>Prevención: </Text>
            Conjunto de acciones y mecanismos implementados con anticipación a la ocurrencia de
            agentes perturbadores, con la finalidad de conocer los peligros, identificarlos y eliminarlos.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: 'bold' }}>Auxilio: </Text>
            Respuesta de ayuda a las personas en riesgo o las víctimas de un siniestro, emergencia
            o desastre, por parte de grupos especializados públicos o privados.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: 'bold' }}>Recuperación: </Text>
            Proceso orientado a la reconstrucción, mejoramiento o reestructuración del entorno físico,
            social y económico tras la ocurrencia de un desastre.
          </Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 31</Text>
      </Page>

      {/* ANEXO C: DEFINICIÓN DEL PROGRAMA INTERNO (STATIC) */}
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>ANEXO C</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 20 }}>DEFINICIÓN DEL PROGRAMA INTERNO DE PROTECCIÓN CIVIL</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>C.1 DEFINICIÓN</Text>
          <Text style={styles.paragraph}>
            El Programa Interno de Protección Civil (PIPC) es el instrumento de planeación y operación
            que se circunscribe al ámbito de una dependencia, entidad, institución u organismo del sector
            público, privado o social y se aplica en los inmuebles correspondientes, con el fin de
            establecer las acciones preventivas y de respuesta que se requieren para salvaguardar la
            integridad física de los ocupantes.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>C.2 ALCANCE</Text>
          <Text style={styles.paragraph}>
            El presente programa aplica a todas las áreas, instalaciones y personal que labora o
            transita en el inmueble, incluyendo:
          </Text>
          <Text style={styles.paragraph}>• Personal administrativo y operativo</Text>
          <Text style={styles.paragraph}>• Visitantes, clientes y proveedores</Text>
          <Text style={styles.paragraph}>• Contratistas y personal externo</Text>
          <Text style={styles.paragraph}>• Todas las áreas comunes e instalaciones</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>C.3 VIGENCIA</Text>
          <Text style={styles.paragraph}>
            El programa tiene una vigencia de un año a partir de su autorización por la autoridad
            competente y debe actualizarse anualmente o cuando existan modificaciones sustanciales
            en las instalaciones, procesos o estructura organizacional.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>C.4 RESPONSABILIDAD</Text>
          <Text style={styles.paragraph}>
            La implementación del programa es responsabilidad del propietario, representante legal
            o administrador del inmueble, quien debe designar a un responsable de la Unidad Interna
            de Protección Civil para su operación y seguimiento.
          </Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 32</Text>
      </Page>

      {/* ANEXO D: SUBPROGRAMAS (STATIC) */}
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>ANEXO D</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 20 }}>SUBPROGRAMAS</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>D.1 SUBPROGRAMA DE PREVENCIÓN</Text>
          <Text style={styles.paragraph}>
            Conjunto de acciones destinadas a evitar o mitigar los efectos destructivos de las calamidades
            sobre la vida y bienes de la población, la planta productiva, los servicios públicos y el medio ambiente.
          </Text>
          <Text style={styles.paragraph}>• Análisis de riesgos y vulnerabilidades</Text>
          <Text style={styles.paragraph}>• Programa de mantenimiento preventivo</Text>
          <Text style={styles.paragraph}>• Capacitación continua del personal</Text>
          <Text style={styles.paragraph}>• Difusión de cultura de protección civil</Text>
          <Text style={styles.paragraph}>• Verificación de señalización y equipos</Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 33</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>ANEXO D (Continuación)</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>D.2 SUBPROGRAMA DE AUXILIO</Text>
          <Text style={styles.paragraph}>
            Acciones destinadas a rescatar y salvaguardar la integridad física de las personas, sus bienes
            y la planta productiva, así como preservar los servicios públicos y el equilibrio ecológico.
          </Text>
          <Text style={styles.paragraph}>• Activación de alarmas y alertamiento</Text>
          <Text style={styles.paragraph}>• Procedimientos de evacuación</Text>
          <Text style={styles.paragraph}>• Operaciones de búsqueda y rescate</Text>
          <Text style={styles.paragraph}>• Atención de primeros auxilios</Text>
          <Text style={styles.paragraph}>• Coordinación con servicios de emergencia</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>D.3 SUBPROGRAMA DE RECUPERACIÓN</Text>
          <Text style={styles.paragraph}>
            Acciones orientadas a la reconstrucción, mejoramiento o reestructuración del entorno físico,
            social y económico, generación de empleo y reconstitución de la estructura de la comunidad.
          </Text>
          <Text style={styles.paragraph}>• Evaluación de daños</Text>
          <Text style={styles.paragraph}>• Rehabilitación de instalaciones</Text>
          <Text style={styles.paragraph}>• Continuidad de operaciones</Text>
          <Text style={styles.paragraph}>• Vuelta a la normalidad</Text>
          <Text style={styles.paragraph}>• Lecciones aprendidas y mejora continua</Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 34</Text>
      </Page>

      {/* ANEXO E: PROCEDIMIENTOS DE EMERGENCIA (STATIC - 5 TYPES) */}
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>ANEXO E</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 20 }}>PROCEDIMIENTOS DE EMERGENCIA</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>E.1 PROCEDIMIENTO ANTE SISMO</Text>
          <Text style={styles.paragraph}>Fase 1 (Durante): Conservar la calma, ubicarse en zonas seguras, alejarse de ventanas y objetos que puedan caer.</Text>
          <Text style={styles.paragraph}>Fase 2 (Después): Verificar lesionados, cortar suministros si hay daños, seguir instrucciones del personal de brigadas.</Text>
          <Text style={styles.paragraph}>Fase 3 (Evacuación): Dirigirse al punto de reunión, realizar conteo de personal, reportar ausencias.</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>E.2 PROCEDIMIENTO ANTE INCENDIO</Text>
          <Text style={styles.paragraph}>Fase 1 (Detección): Activar alarma, notificar al Coordinador, llamar a bomberos (911).</Text>
          <Text style={styles.paragraph}>Fase 2 (Respuesta): Si es conato, usar extintor con técnica PAAS. Si crece, evacuar inmediatamente.</Text>
          <Text style={styles.paragraph}>Fase 3 (Evacuación): Seguir rutas establecidas, no usar elevadores, dirigirse al punto de reunión.</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>E.3 PROCEDIMIENTO ANTE FUGA DE GAS</Text>
          <Text style={styles.paragraph}>Fase 1: NO encender/apagar luces, NO usar celulares, NO generar chispas ni llamas.</Text>
          <Text style={styles.paragraph}>Fase 2: Cerrar válvula de gas, ventilar el área, evaluar necesidad de evacuación.</Text>
          <Text style={styles.paragraph}>Fase 3: Evacuar, llamar a bomberos desde el exterior, esperar autorización para reingreso.</Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 35</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>ANEXO E (Continuación)</Text>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>E.4 PROCEDIMIENTO ANTE INUNDACIÓN</Text>
          <Text style={styles.paragraph}>Fase 1 (Alerta): Monitorear condiciones climáticas, verificar drenajes, proteger documentos y equipos.</Text>
          <Text style={styles.paragraph}>Fase 2 (Durante): Desconectar equipos eléctricos, evitar contacto con agua estancada, no cruzar corrientes.</Text>
          <Text style={styles.paragraph}>Fase 3 (Posterior): Evaluar daños, no reingresar hasta verificar seguridad estructural y eléctrica.</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.paragraph, { fontWeight: 'bold' }]}>E.5 PROCEDIMIENTO ANTE AMENAZA DE BOMBA</Text>
          <Text style={styles.paragraph}>Fase 1 (Recepción): Mantener calma, obtener información (ubicación, hora, motivo), notificar al Coordinador.</Text>
          <Text style={styles.paragraph}>Fase 2 (Evaluación): NO tocar objetos sospechosos, NO usar radios o celulares cerca, evacuar área.</Text>
          <Text style={styles.paragraph}>Fase 3 (Respuesta): Llamar al 911, evacuar todo el inmueble, esperar a autoridades especializadas.</Text>
        </View>
        <View style={{ marginTop: 10, borderWidth: 1, borderColor: '#ccc', padding: 10 }}>
          <Text style={{ fontSize: 9, fontStyle: 'italic' }}>
            NOTA: Los procedimientos detallados con diagramas de flujo se incorporarán en actualizaciones posteriores.
          </Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 36</Text>
      </Page>

      {/* ANEXO F: FICHAS DE RIESGO (DYNAMIC) */}
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>ANEXO F</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 20 }}>FICHAS DE RIESGO</Text>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            De conformidad con la Ley General de Protección Civil, se presenta el análisis detallado
            de cada riesgo identificado en el inmueble.
          </Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 37</Text>
      </Page>

      {/* Dynamic Risk Cards - One page per risk */}
      {risks.length > 0 ? (
        risks.map((risk, idx) => (
          <Page key={`risk-${idx}`} size="A4" style={styles.page}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>ANEXO F.{idx + 1}</Text>
            <Text style={styles.sectionTitle}>FICHA DE RIESGO: {risk.tipo || 'Sin especificar'}</Text>
            <View style={styles.section}>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, { width: '35%' }]}>Campo</Text>
                  <Text style={[styles.tableCellLast, { width: '65%' }]}>Información</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '35%', fontWeight: 'bold' }]}>Tipo de Riesgo</Text>
                  <Text style={[styles.tableCellLast, { width: '65%' }]}>{risk.tipo || '—'}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '35%', fontWeight: 'bold' }]}>Categoría</Text>
                  <Text style={[styles.tableCellLast, { width: '65%' }]}>{risk.categoria === 'interno' ? 'Riesgo Interno' : risk.categoria === 'externo' ? 'Riesgo Externo' : '—'}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '35%', fontWeight: 'bold' }]}>Nivel</Text>
                  <Text style={[styles.tableCellLast, { width: '65%' }]}>{risk.nivel || '—'}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '35%', fontWeight: 'bold' }]}>Descripción</Text>
                  <Text style={[styles.tableCellLast, { width: '65%' }]}>{risk.descripcion || 'Sin descripción'}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '35%', fontWeight: 'bold' }]}>Observaciones</Text>
                  <Text style={[styles.tableCellLast, { width: '65%' }]}>{risk.observaciones || '—'}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. {38 + idx}</Text>
          </Page>
        ))
      ) : (
        <Page size="A4" style={styles.page}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>ANEXO F.1</Text>
          <Text style={styles.sectionTitle}>FICHAS DE RIESGO</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              No se han registrado riesgos en el sistema. Las fichas se generarán automáticamente
              una vez que se identifiquen y registren los riesgos del inmueble.
            </Text>
          </View>
          <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. 38</Text>
        </Page>
      )}

      {/* ANEXO G: FICHAS DE CAPACITACIÓN (DYNAMIC) */}
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>ANEXO G</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 20 }}>FICHAS DE CAPACITACIÓN</Text>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Conforme a la Ley General de Protección Civil, se documenta el programa de capacitación
            impartido al personal del inmueble.
          </Text>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. {38 + Math.max(risks.length, 1) + 1}</Text>
      </Page>

      {/* Dynamic Training Cards - One page per course */}
      {training.length > 0 ? (
        training.map((curso, idx) => (
          <Page key={`training-${idx}`} size="A4" style={styles.page}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>ANEXO G.{idx + 1}</Text>
            <Text style={styles.sectionTitle}>FICHA DE CAPACITACIÓN: {curso.curso || 'Sin especificar'}</Text>
            <View style={styles.section}>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, { width: '35%' }]}>Campo</Text>
                  <Text style={[styles.tableCellLast, { width: '65%' }]}>Información</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '35%', fontWeight: 'bold' }]}>Curso</Text>
                  <Text style={[styles.tableCellLast, { width: '65%' }]}>{curso.curso || '—'}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '35%', fontWeight: 'bold' }]}>Fecha</Text>
                  <Text style={[styles.tableCellLast, { width: '65%' }]}>{curso.fecha ? new Date(curso.fecha).toLocaleDateString('es-MX') : '—'}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '35%', fontWeight: 'bold' }]}>Duración</Text>
                  <Text style={[styles.tableCellLast, { width: '65%' }]}>{curso.duracion || '—'}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. {38 + Math.max(risks.length, 1) + 2 + idx}</Text>
          </Page>
        ))
      ) : (
        <Page size="A4" style={styles.page}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>ANEXO G.1</Text>
          <Text style={styles.sectionTitle}>FICHAS DE CAPACITACIÓN</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              No se han registrado capacitaciones en el sistema. Las fichas se generarán
              automáticamente conforme se registren los cursos impartidos.
            </Text>
          </View>
          <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. {38 + Math.max(risks.length, 1) + 2}</Text>
        </Page>
      )}

      {/* ANEXO H: EVIDENCIA FOTOGRÁFICA */}
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, letterSpacing: 0.5 }}>ANEXO H</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 6, color: '#333' }}>EVIDENCIA FOTOGRÁFICA</Text>
        <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#333', marginBottom: 20, width: '40%', alignSelf: 'center' }} />

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            {evidence.fotos.length > 0 
              ? 'Se anexa evidencia fotográfica de los elementos de seguridad, señalización y equipos de protección civil del inmueble, conforme a los requisitos establecidos en la normativa aplicable.'
              : 'De conformidad con la Ley General de Protección Civil y la normativa estatal aplicable, en este apartado se integrará la evidencia fotográfica que documente los elementos de seguridad del inmueble.'
            }
          </Text>
        </View>

        {evidence.fotos.length > 0 ? (
          <View style={{ marginTop: 10 }}>
            {evidence.fotos.slice(0, 3).map((foto, idx) => (
              <View key={`foto-${idx}`} style={{ marginBottom: 15 }}>
                {foto.type === 'image' && foto.url ? (
                  <Image src={foto.url} style={styles.evidenceImage} />
                ) : (
                  <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 20, backgroundColor: '#fafafa' }}>
                    <Text style={{ textAlign: 'center', color: '#555' }}>[Documento PDF: {foto.caption}]</Text>
                  </View>
                )}
                <Text style={styles.evidenceCaption}>H.{idx + 1} — {foto.caption}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 10 }]}>Evidencia por integrar:</Text>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 16, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>H.1 — Fachada principal del inmueble</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 16, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>H.2 — Extintores y equipo contra incendio</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 16, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>H.3 — Señalización de protección civil</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 16, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>H.4 — Punto de reunión</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
          </View>
        )}
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. {38 + Math.max(risks.length, 1) + Math.max(training.length, 1) + 3}</Text>
      </Page>

      {/* Additional photo pages if more than 3 photos exist */}
      {evidence.fotos.length > 3 && (
        <Page size="A4" style={styles.page}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 6 }}>ANEXO H (Continuación)</Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#666', marginBottom: 16, width: '30%' }} />
          <View style={{ marginTop: 10 }}>
            {evidence.fotos.slice(3, 6).map((foto, idx) => (
              <View key={`foto-cont-${idx}`} style={{ marginBottom: 15 }}>
                {foto.type === 'image' && foto.url ? (
                  <Image src={foto.url} style={styles.evidenceImage} />
                ) : (
                  <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 20, backgroundColor: '#fafafa' }}>
                    <Text style={{ textAlign: 'center', color: '#555' }}>[Documento PDF: {foto.caption}]</Text>
                  </View>
                )}
                <Text style={styles.evidenceCaption}>H.{idx + 4} — {foto.caption}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. {38 + Math.max(risks.length, 1) + Math.max(training.length, 1) + 4}</Text>
        </Page>
      )}

      {/* ANEXO I: PLANOS DE EVACUACIÓN */}
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, letterSpacing: 0.5 }}>ANEXO I</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 6, color: '#333' }}>PLANOS Y CROQUIS DE EVACUACIÓN</Text>
        <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#333', marginBottom: 20, width: '40%', alignSelf: 'center' }} />

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            {evidence.planos.length > 0 
              ? 'Se anexan los planos y croquis del inmueble que muestran las rutas de evacuación, ubicación de equipos de seguridad y puntos de reunión, conforme a la NOM-003-SEGOB-2011.'
              : 'De conformidad con la NOM-003-SEGOB-2011 y la normativa estatal aplicable, en este apartado se integrarán los planos arquitectónicos y croquis de evacuación del inmueble.'
            }
          </Text>
        </View>

        {evidence.planos.length > 0 ? (
          <View style={{ marginTop: 10 }}>
            {evidence.planos.slice(0, 2).map((plano, idx) => (
              <View key={`plano-${idx}`} style={{ marginBottom: 15 }}>
                {plano.type === 'image' && plano.url ? (
                  <Image src={plano.url} style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain', marginBottom: 4 }} />
                ) : (
                  <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 40, backgroundColor: '#fafafa' }}>
                    <Text style={{ textAlign: 'center', color: '#555' }}>[Documento PDF: {plano.caption}]</Text>
                  </View>
                )}
                <Text style={styles.evidenceCaption}>I.{idx + 1} — {plano.caption}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 10 }]}>Documentación por integrar:</Text>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 30, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>I.1 — Plano arquitectónico del inmueble</Text>
              <Text style={{ fontSize: 9, color: '#555', marginTop: 4 }}>Deberá incluir: distribución de áreas, dimensiones generales y ubicación de accesos.</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 12 }}>[Por integrar]</Text>
            </View>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 30, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>I.2 — Croquis de rutas de evacuación</Text>
              <Text style={{ fontSize: 9, color: '#555', marginTop: 4 }}>Deberá incluir: rutas primarias y alternas, ubicación de extintores, señalización y puntos de reunión.</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 12 }}>[Por integrar]</Text>
            </View>
          </View>
        )}
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. {38 + Math.max(risks.length, 1) + Math.max(training.length, 1) + 4 + (evidence.fotos.length > 3 ? 1 : 0)}</Text>
      </Page>

      {/* ANEXO J: FIRMAS Y ACTAS */}
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, letterSpacing: 0.5 }}>ANEXO J</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 6, color: '#333' }}>ACTAS, CONSTANCIAS Y FIRMAS</Text>
        <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#333', marginBottom: 20, width: '40%', alignSelf: 'center' }} />

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            {evidence.actas.length > 0 
              ? 'Se integran los documentos oficiales que respaldan la constitución legal de la Unidad Interna de Protección Civil y la capacitación del personal brigadista.'
              : 'De conformidad con la Ley General de Protección Civil, en este apartado se integrarán las actas constitutivas, nombramientos y constancias que respalden la operación de la UIPC.'
            }
          </Text>
        </View>

        {evidence.actas.length > 0 ? (
          <View style={{ marginTop: 10 }}>
            {evidence.actas.slice(0, 2).map((acta, idx) => (
              <View key={`acta-${idx}`} style={{ marginBottom: 15 }}>
                {acta.type === 'image' && acta.url ? (
                  <Image src={acta.url} style={styles.evidenceImage} />
                ) : (
                  <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 30, backgroundColor: '#fafafa' }}>
                    <Text style={{ textAlign: 'center', color: '#555' }}>[Documento: {acta.caption}]</Text>
                  </View>
                )}
                <Text style={styles.evidenceCaption}>J.{idx + 1} — {acta.caption}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 10 }]}>Documentación por integrar:</Text>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 20, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>J.1 — Acta constitutiva de la UIPC</Text>
              <Text style={{ fontSize: 9, color: '#555', marginTop: 4 }}>Documento que formaliza la creación de la Unidad Interna de Protección Civil.</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 20, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>J.2 — Nombramientos de responsables y coordinadores</Text>
              <Text style={{ fontSize: 9, color: '#555', marginTop: 4 }}>Designación oficial del Responsable de la UIPC, Coordinador General y Jefes de Brigada.</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 20, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>J.3 — Constancias de capacitación</Text>
              <Text style={{ fontSize: 9, color: '#555', marginTop: 4 }}>Comprobantes de los cursos de capacitación impartidos al personal brigadista.</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 20, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>J.4 — Actas de simulacros realizados</Text>
              <Text style={{ fontSize: 9, color: '#555', marginTop: 4 }}>Registro documental de los ejercicios de simulacro ejecutados.</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
          </View>
        )}
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. {38 + Math.max(risks.length, 1) + Math.max(training.length, 1) + 5 + (evidence.fotos.length > 3 ? 1 : 0)}</Text>
      </Page>

      {/* ANEXO K: BITÁCORAS Y DICTÁMENES */}
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, letterSpacing: 0.5 }}>ANEXO K</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 6, color: '#333' }}>BITÁCORAS DE MANTENIMIENTO Y DICTÁMENES TÉCNICOS</Text>
        <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#333', marginBottom: 20, width: '40%', alignSelf: 'center' }} />

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            {evidence.bitacoras.length > 0 
              ? 'Se integran las bitácoras de mantenimiento preventivo y correctivo, así como los dictámenes técnicos de las instalaciones del inmueble.'
              : 'De conformidad con la normativa aplicable en materia de protección civil, en este apartado se integrarán las bitácoras de mantenimiento y los dictámenes técnicos requeridos.'
            }
          </Text>
        </View>

        {evidence.bitacoras.length > 0 ? (
          <View style={{ marginTop: 10 }}>
            {evidence.bitacoras.slice(0, 2).map((bitacora, idx) => (
              <View key={`bitacora-${idx}`} style={{ marginBottom: 15 }}>
                {bitacora.type === 'image' && bitacora.url ? (
                  <Image src={bitacora.url} style={styles.evidenceImage} />
                ) : (
                  <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 30, backgroundColor: '#fafafa' }}>
                    <Text style={{ textAlign: 'center', color: '#555' }}>[Documento: {bitacora.caption}]</Text>
                  </View>
                )}
                <Text style={styles.evidenceCaption}>K.{idx + 1} — {bitacora.caption}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 10 }]}>Documentación por integrar:</Text>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 20, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>K.1 — Bitácora de mantenimiento de extintores</Text>
              <Text style={{ fontSize: 9, color: '#555', marginTop: 4 }}>Registro de recargas, revisiones y mantenimiento de equipo contra incendio.</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 20, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>K.2 — Bitácora de revisión de instalaciones</Text>
              <Text style={{ fontSize: 9, color: '#555', marginTop: 4 }}>Registro de inspecciones periódicas de sistemas de seguridad y emergencia.</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 20, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>K.3 — Dictamen de instalaciones eléctricas</Text>
              <Text style={{ fontSize: 9, color: '#555', marginTop: 4 }}>Verificación de cumplimiento de la NOM-001-SEDE vigente.</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 20, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>K.4 — Dictamen de instalaciones de gas</Text>
              <Text style={{ fontSize: 9, color: '#555', marginTop: 4 }}>Verificación de cumplimiento de la NOM-002-SECRE vigente (si aplica).</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
            
            <View style={{ borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', padding: 20, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>K.5 — Dictamen de seguridad estructural</Text>
              <Text style={{ fontSize: 9, color: '#555', marginTop: 4 }}>Evaluación de condiciones estructurales del inmueble (si aplica).</Text>
              <Text style={{ fontSize: 9, color: '#555', textAlign: 'center', marginTop: 8 }}>[Por integrar]</Text>
            </View>
          </View>
        )}
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. {38 + Math.max(risks.length, 1) + Math.max(training.length, 1) + 6 + (evidence.fotos.length > 3 ? 1 : 0)}</Text>
      </Page>

      {/* CONTRAPORTADA FINAL */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 20 }}>FIN DEL DOCUMENTO</Text>
          <Text style={{ fontSize: 11, marginBottom: 40 }}>PROGRAMA INTERNO DE PROTECCIÓN CIVIL</Text>
          <Text style={{ fontSize: 12 }}>{client.razon_social || 'EMPRESA'}</Text>
          <View style={{ marginTop: 60 }}>
            <Text style={{ fontSize: 10, textAlign: 'center', color: '#666' }}>
              Elaborado por ASME Consultores — Consultoría en Protección Civil
            </Text>
            <Text style={{ fontSize: 10, textAlign: 'center', color: '#666', marginTop: 8 }}>
              Fecha de elaboración: {yesterdayDate}
            </Text>
          </View>
        </View>
        <Text style={styles.footer}>Programa Interno de Protección Civil — Pág. {38 + Math.max(risks.length, 1) + Math.max(training.length, 1) + 7 + (evidence.fotos.length > 3 ? 1 : 0)} (Final)</Text>
      </Page>

    </Document>
  );
}
