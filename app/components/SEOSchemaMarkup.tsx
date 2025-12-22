// app/components/SEOSchemaMarkup.tsx
// Add this component to your app/layout.tsx or pages that need it

export function SEOSchemaMarkup() {
  const schemaData = {
    // 1. Local Business Schema
    localBusiness: {
      '@context': 'https://schema.org',
      '@type': 'Attorney',
      'name': 'ASME Abogados',
      'image': 'https://asmeconsultoria.com/logo.png',
      'description': 'Despacho de abogados especializado en violencia vicaria, custodia y litigio familiar en Tijuana, Baja California.',
      'url': 'https://asmeconsultoria.com',
      'telephone': '+52 664 201 6011',
      'email': 'info@asmeabogados.com',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Carretera Tijuana-Rosarito, Fraccionamiento Francisco Zarco 9650',
        'addressLocality': 'Tijuana',
        'addressRegion': 'Baja California',
        'postalCode': '22260',
        'addressCountry': 'MX'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '32.3161', // Tijuana coordinates - update with exact location
        'longitude': '-117.0382'
      },
      'areaServed': [
        {
          '@type': 'City',
          'name': 'Tijuana'
        },
        {
          '@type': 'State',
          'name': 'Baja California',
          'addressCountry': 'MX'
        },
        {
          '@type': 'City',
          'name': 'Ensenada'
        },
        {
          '@type': 'City',
          'name': 'Rosarito'
        },
        {
          '@type': 'City',
          'name': 'Tecate'
        }
      ],
      'priceRange': '$$',
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          'opens': '09:00',
          'closes': '18:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': 'Saturday',
          'opens': '10:00',
          'closes': '14:00'
        }
      ],
      'sameAs': [
        'https://www.facebook.com/asmeabogados', // Add your socials
        'https://www.instagram.com/asmeabogados',
        'https://www.linkedin.com/company/asmeabogados'
      ],
      'knowsAbout': [
        'Violencia Vicaria',
        'Litigio Familiar',
        'Custodia de Menores',
        'Falsas Acusaciones',
        'Defensa de Madres',
        'Litigio Penal',
        'Litigio Empresarial',
        'Trámites Gubernamentales'
      ]
    },

    // 2. Organization Schema
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'ASME Abogados',
      'legalName': 'ASME Abogados, S.C.',
      'url': 'https://asmeconsultoria.com',
      'logo': 'https://asmeconsultoria.com/logo.png',
      'description': 'Despacho especializado en defensa de violencia vicaria, custodia y litigio familiar en Tijuana, Baja California, México.',
      'email': 'info@asmeconsultoria.com',
      'telephone': '+52 664 201 6011',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Carretera Tijuana-Rosarito, Fraccionamiento Francisco Zarco 9650',
        'addressLocality': 'Tijuana',
        'addressRegion': 'Baja California',
        'postalCode': '22260',
        'addressCountry': 'MX'
      },
      'foundingDate': '2015', // Update with actual founding year
      'sameAs': [
        'https://www.facebook.com/asmeabogados',
        'https://www.instagram.com/asmeabogados'
      ]
    },

    // 3. Person Schema - Rubén Jiménez
    person: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'Rubén Jiménez',
      'jobTitle': 'Abogado Especialista en Violencia Vicaria',
      'url': 'https://asmeconsultoria.com',
      'email': 'info@asmeconsultoria.com',
      'affiliation': {
        '@type': 'Organization',
        'name': 'ASME Abogados'
      },
      'knowsAbout': [
        'Violencia Vicaria',
        'Litigio Familiar',
        'Defensa de Madres',
        'Falsas Acusaciones en Custodia',
        'Derechos de Menores'
      ],
      'worksFor': {
        '@type': 'Organization',
        'name': 'ASME Abogados',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Carretera Tijuana-Rosarito, Fraccionamiento Francisco Zarco 9650',
          'addressLocality': 'Tijuana',
          'addressRegion': 'Baja California',
          'postalCode': '22260',
          'addressCountry': 'MX'
        }
      }
    },

    // 4. Service Schema - For each service
    services: {
      violenciaVicaria: {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        'name': 'Defensa Especializada en Violencia Vicaria',
        'description': 'Representación legal experta para madres enfrentando violencia vicaria, criminalización y falsas acusaciones en procedimientos de custodia.',
        'provider': {
          '@type': 'Attorney',
          'name': 'ASME Abogados',
          'url': 'https://asmeconsultoria.com'
        },
        'serviceType': ['Litigio Familiar', 'Defensa Legal', 'Asesoría Jurídica'],
        'areaServed': {
          '@type': 'State',
          'name': 'Baja California',
          'addressCountry': 'MX'
        }
      },
      
      custodia: {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        'name': 'Custodia y Derechos de Menores',
        'description': 'Defensa en procedimientos de custodia, modificación de sentencias, y protección de derechos de menores en Tijuana.',
        'provider': {
          '@type': 'Attorney',
          'name': 'ASME Abogados'
        },
        'serviceType': ['Litigio Familiar', 'Defensa de Custodia'],
        'areaServed': {
          '@type': 'State',
          'name': 'Baja California'
        }
      }
    },

    // 5. FAQ Schema (for featured snippets)
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': '¿Qué es la violencia vicaria?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'La violencia vicaria es una forma de abuso en la que un agresor utiliza a los hijos como arma para atacar, controlar o manipular al otro progenitor, típicamente la madre. Incluye falsas acusaciones, criminalización y uso del sistema judicial como instrumento de control.'
          }
        },
        {
          '@type': 'Question',
          'name': '¿Cómo defenderme de falsas acusaciones en custodia?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'La defensa contra falsas acusaciones requiere evidencia sólida, testimonios, análisis de patrones de comportamiento del acusador y representación legal especializada. Es fundamental trabajar con un abogado familiarizado con violencia vicaria.'
          }
        },
        {
          '@type': 'Question',
          'name': '¿Cuáles son mis derechos como madre en un procedimiento de custodia?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Tienes derecho a una defensa legal adecuada, a ser escuchada en el procedimiento, a presentar evidencia, a contradecir acusaciones falsas, y a que se resuelva el caso considerando el interés superior del menor.'
          }
        },
        {
          '@type': 'Question',
          'name': '¿Qué evidencia es importante en casos de custodia?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Evidencia importante incluye: comunicaciones entre padres, registros de visitas, evaluaciones psicológicas, testimonios de terceros, registros médicos/escolares, y documentación que demuestre capacidad y dedicación en el cuidado de los menores.'
          }
        }
      ]
    },

    // 6. Breadcrumb Schema
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Inicio',
          'item': 'https://asmeconsultoria.com'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Servicios Legales',
          'item': 'https://asmeconsultoria.com/legal'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'Violencia Vicaria',
          'item': 'https://asmeconsultoria.com/legal/litigio-familiar'
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.localBusiness),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.organization),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.person),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.faq),
        }}
      />
    </>
  );
}