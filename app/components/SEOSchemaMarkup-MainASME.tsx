// app/components/SEOSchemaMarkup-MainASME.tsx
// Schema markup for main ASME site covering all services

export function SEOSchemaMarkupMainASME() {
  const schemaData = {
    // 1. LOCAL BUSINESS - Training & Consulting Company
    localBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'ASME',
      'legalName': 'ASME S.A. de C.V.',
      'image': 'https://asmeconsultoria.com/logo.png',
      'description': 'Empresa especializada en capacitación profesional, consultoría en protección civil y servicios legales empresariales.',
      'url': 'https://asmeconsultoria.com',
      'telephone': '+52 664 201 6011',
      'email': 'info@asmeconsultoria.com',
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
        'latitude': '32.3161',
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
          '@type': 'Country',
          'name': 'Mexico'
        }
      ],
      'priceRange': '$$$',
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          'opens': '08:00',
          'closes': '18:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': 'Saturday',
          'opens': '09:00',
          'closes': '14:00'
        }
      ],
      'sameAs': [
        'https://www.facebook.com/asmeoficial', // Update
        'https://www.instagram.com/asmeoficial',
        'https://www.linkedin.com/company/asme'
      ],
      'knowsAbout': [
        'Capacitación RCP',
        'Primeros Auxilios',
        'Protección Civil',
        'PIPC',
        'Evaluación de Riesgos',
        'Seguridad Industrial',
        'Litigio Empresarial',
        'Asesoría Legal'
      ]
    },

    // 2. ORGANIZATION SCHEMA
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'ASME',
      'legalName': 'ASME S.A. de C.V.',
      'url': 'https://asmeconsultoria.com',
      'logo': 'https://asmeconsultoria.com/logo.png',
      'description': 'Líder en capacitación, consultoría de protección civil y servicios legales para empresas en México.',
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
      'foundingDate': '2010', // Update with actual year
      'sameAs': [
        'https://www.facebook.com/asmeoficial',
        'https://www.instagram.com/asmeoficial'
      ]
    },

    // 3. TRAINING ORGANIZATION SCHEMA
    trainingOrganization: {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      'name': 'ASME - Centro de Capacitación',
      'url': 'https://asmeconsultoria.com/capacitacion',
      'description': 'Centro certificado de capacitación en RCP, primeros auxilios y seguridad ocupacional.',
      'telephone': '+52 664 201 6011',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Carretera Tijuana-Rosarito, Fraccionamiento Francisco Zarco 9650',
        'addressLocality': 'Tijuana',
        'addressRegion': 'Baja California',
        'postalCode': '22260',
        'addressCountry': 'MX'
      },
      'parentOrganization': {
        '@type': 'Organization',
        'name': 'ASME'
      },
      'offersEducation': [
        {
          '@type': 'EducationEvent',
          'name': 'Curso RCP',
          'description': 'Reanimación Cardiopulmonar certificada',
          'url': 'https://asmeconsultoria.com/capacitacion/rcp'
        },
        {
          '@type': 'EducationEvent',
          'name': 'Primeros Auxilios',
          'description': 'Capacitación integral en primeros auxilios',
          'url': 'https://asmeconsultoria.com/capacitacion/primeros-auxilios'
        }
      ]
    },

    // 4. SERVICES SCHEMA - Capacitación
    capacitacionService: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      'name': 'Capacitación RCP y Primeros Auxilios',
      'description': 'Cursos certificados de reanimación cardiopulmonar y primeros auxilios para empresas.',
      'provider': {
        '@type': 'Organization',
        'name': 'ASME',
        'url': 'https://asmeconsultoria.com'
      },
      'serviceType': ['Capacitación Profesional', 'Educación Continua'],
      'areaServed': {
        '@type': 'State',
        'name': 'Baja California',
        'addressCountry': 'MX'
      },
      'offers': {
        '@type': 'Offer',
        'priceCurrency': 'MXN',
        'price': 'Consultar', // Update with actual price
        'availability': 'https://schema.org/InStock'
      }
    },

    // 5. SERVICES SCHEMA - Protección Civil
    proteccionCivilService: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      'name': 'Plan Interno Protección Civil (PIPC)',
      'description': 'Diseño, implementación y evaluación de PIPC. Consultoría integral en protección civil.',
      'provider': {
        '@type': 'Organization',
        'name': 'ASME'
      },
      'serviceType': ['Consultoría', 'Asesoría'],
      'areaServed': {
        '@type': 'State',
        'name': 'Baja California',
        'addressCountry': 'MX'
      }
    },

    // 6. SERVICES SCHEMA - Legal Services
    serviciosLegalesService: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      'name': 'Servicios Legales Empresariales',
      'description': 'Litigio empresarial, asesoría legal y defensa de empresas.',
      'provider': {
        '@type': 'Attorney',
        'name': 'ASME - Servicios Legales',
        'url': 'https://asmeconsultoria.com'
      },
      'serviceType': ['Litigio Empresarial', 'Asesoría Legal'],
      'areaServed': {
        '@type': 'State',
        'name': 'Baja California',
        'addressCountry': 'MX'
      }
    },

    // 7. COURSE SCHEMA - RCP
    rcpCourse: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      'name': 'Curso RCP - Reanimación Cardiopulmonar',
      'description': 'Capacitación certificada en reanimación cardiopulmonar. Presencial y en línea. Válido para brigadas empresariales.',
      'url': 'https://asmeconsultoria.com/capacitacion/rcp',
      'provider': {
        '@type': 'Organization',
        'name': 'ASME'
      },
      'courseCode': 'RCP-2024',
      'duration': 'PT8H', // 8 hours
      'inLanguage': 'es-MX',
      'teaches': ['Reanimación Cardiopulmonar', 'RCP Básico', 'Técnicas de Respiración'],
      'hasCourseInstance': {
        '@type': 'CourseInstance',
        'name': 'RCP - Presencial Tijuana',
        'description': 'Curso presencial en Tijuana',
        'courseMode': 'OnSiteDeliveryMode',
        'courseSchedule': {
          '@type': 'Schedule',
          'duration': 'P1D'
        },
        'instructor': {
          '@type': 'Person',
          'name': 'Instructores Certificados ASME'
        },
        'offers': {
          '@type': 'Offer',
          'priceCurrency': 'MXN',
          'price': 'Consultar',
          'availability': 'https://schema.org/InStock'
        }
      }
    },

    // 8. FAQ SCHEMA
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': '¿Qué es un PIPC?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'El Plan Interno de Protección Civil (PIPC) es un documento que toda empresa debe tener para prepararse ante emergencias. Incluye evaluación de riesgos, procedimientos de evacuación y asignación de responsabilidades.'
          }
        },
        {
          '@type': 'Question',
          'name': '¿Dónde puedo tomar el curso RCP en Tijuana?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'ASME ofrece cursos certificados de RCP presenciales y en línea en Tijuana. Contáctanos al +52 664 201 6011 para agendar.'
          }
        },
        {
          '@type': 'Question',
          'name': '¿Es obligatorio tener PIPC en mi empresa?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Sí, según la normativa mexicana, todas las empresas deben contar con un Plan Interno de Protección Civil. Es un requisito legal de seguridad.'
          }
        },
        {
          '@type': 'Question',
          'name': '¿Qué incluye la asesoría legal de ASME?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Ofrecemos litigio empresarial, asesoría legal, defensa en procedimientos y cumplimiento normativo para empresas.'
          }
        }
      ]
    },

    // 9. BREADCRUMB SCHEMA
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
          'name': 'Servicios',
          'item': 'https://asmeconsultoria.com/servicios'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'Capacitación',
          'item': 'https://asmeconsultoria.com/capacitacion'
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
          __html: JSON.stringify(schemaData.trainingOrganization),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.capacitacionService),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.proteccionCivilService),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.serviciosLegalesService),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.rcpCourse),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.faq),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.breadcrumb),
        }}
      />
    </>
  );
}