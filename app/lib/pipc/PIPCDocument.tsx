import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

interface Props {
  data: {
    project: any;
    company_info: any;
    occupancy: any;
    uipc: any;
    risks: any[];
    training: any[];
  };
}

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 40,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 12,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
  },
  paragraph: {
    marginBottom: 6,
    textAlign: 'justify',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  label: {
    width: '35%',
    fontWeight: 'bold',
  },
  value: {
    width: '65%',
  },
  table: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#eee',
  },
  tableCell: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  tableCellLast: {
    flex: 1,
    padding: 4,
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 9,
    color: '#555',
  },
});

export default function PIPCDocument({ data }: Props) {
  const { project, company_info, occupancy, uipc, risks, training } = data;
  const client = project.pipc_clients;

  const fullAddress = [
    company_info?.domicilio,
    company_info?.colonia,
    company_info?.municipio,
    company_info?.estado,
  ]
    .filter(Boolean)
    .join(', ');

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
            <Text style={styles.value}>{company_info?.telefono || '—'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Correo:</Text>
            <Text style={styles.value}>{company_info?.email || '—'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Representante Legal:</Text>
            <Text style={styles.value}>{company_info?.representante_legal || '—'}</Text>
          </View>
        </View>

        {/* II. OCUPACIÓN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II. OCUPACIÓN DEL INMUEBLE</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Población fija:</Text>
            <Text style={styles.value}>{occupancy?.poblacion_fija || 0}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Población flotante:</Text>
            <Text style={styles.value}>{occupancy?.poblacion_flotante || 0}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Edificios:</Text>
            <Text style={styles.value}>{occupancy?.edificios || 0}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Niveles:</Text>
            <Text style={styles.value}>{occupancy?.niveles || 0}</Text>
          </View>
        </View>

        {/* III. UIPC */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III. UNIDAD INTERNA DE PROTECCIÓN CIVIL</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Responsable:</Text>
            <Text style={styles.value}>{uipc?.responsable || '—'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Coordinador:</Text>
            <Text style={styles.value}>{uipc?.coordinador || '—'}</Text>
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
            <Text style={styles.value}>{uipc?.coordinador || 'Por asignar'}</Text>
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
            <Text style={styles.value}>{uipc?.coordinador || 'Por asignar'}</Text>
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
    </Document>
  );
}
