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
    </Document>
  );
}
