import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11 },
  title: { fontSize: 18, marginBottom: 12 },
  section: { marginBottom: 12 },
  label: { fontWeight: 'bold' },
});

export default function PIPCPDF({
  project,
  companyInfo,
  occupancy,
  uipc,
  risks,
  training,
}: any) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Programa Interno de Protección Civil</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Empresa</Text>
          <Text>{project.pipc_clients.razon_social}</Text>
          <Text>RFC: {project.pipc_clients.rfc}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Riesgos Identificados</Text>
          {risks.map((r: any, i: number) => (
            <Text key={i}>• {r.nombre}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Capacitación</Text>
          {training.map((t: any, i: number) => (
            <Text key={i}>
              • {t.curso} — {t.fecha || 'Sin fecha'}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
