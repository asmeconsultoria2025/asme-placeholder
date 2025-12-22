import {
  BookOpen,
  type LucideIcon,
  Home,
  Briefcase,
  Info,
  Mail,
  LayoutDashboard,
  User,
  FileText,
  Calendar,
  PenSquare,
  Gavel,
  HeartHandshake,
  Landmark,
  FileBadge,
  Users2Icon
} from 'lucide-react';
import type { Service } from './types';
import { SiLichess } from "react-icons/si";
import { GiFireExtinguisher, GiOrganigram, GiTeacher, GiPhotoCamera, } from "react-icons/gi";
import { PiBlueprintDuotone } from "react-icons/pi";
import { IoMedicalSharp } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";


export const NAV_LINKS = [
  { href: '/', label: 'Inicio', Icon: Home },
  { href: '/servicios', label: 'Servicios', Icon: Briefcase },
  { href: '/galeria', label: 'Galería', Icon: GiPhotoCamera },
  { href: '/instalaciones', label: 'Instalaciones' },
  { href: '/nosotros', label: 'Nosotros', Icon: Info },
  { href: '/blog', label: 'Blog', Icon: BookOpen },
  { href: '/citas', label: 'Citas' },
  { href: '/contacto', label: 'Contacto', Icon: Mail },
];

export const LEGAL_NAV_LINKS = [
  { href: '/legal', label: 'Inicio', Icon: Home },
  { href: '/legal/litigio-familiar', label: 'Litigio Familiar' },
  { href: '/legal/litigio-penal', label: 'Litigio Penal' },
  { href: '/legal/litigio-civil', label: 'Litigio Civil' },
  { href: '/legal/amparos', label: 'Amparos' },
  { href: '/legal/blog', label: 'Blog Abogados', Icon: BookOpen },
  { href: '/legal/nosotros', label: 'Nosotros' },
];

export const SERVICES: Service[] = [
  {
    title: 'Consultoría especializada en seguridad y protección civil',
    description:
      'Nuestra consultoría en seguridad y protección civil acompaña a tu empresa en cada paso para cumplir con la normativa, prevenir riesgos y estar lista ante cualquier emergencia. Diseñamos e implementamos programas de seguridad, salud laboral y planes internos de protección civil, con auditorías, capacitaciones y simulacros que transforman la prevención en cultura.',
    Icon: IoMedicalSharp,
    slug: 'seguridad-y-proteccion-civil',
    color: '#2563EB', // ASME blue
    images: [
      '/images/servicios/consultoria1.jpeg',
      '/images/servicios/consultoria2.jpeg',
      '/images/servicios/consultoria3.jpeg',
    ],
  },
  {
    title: 'Análisis y evaluación de riesgos.',
    description:
      'El análisis y evaluación de riesgos es mucho más que un requisito: es la base para mantener seguras a las personas, las instalaciones y las operaciones de tu empresa. En México este proceso identifica y controla riesgos naturales, tecnológicos y químicos, evaluando vulnerabilidades para crear estrategias efectivas de prevención y respuesta. Todo se integra en tu Programa Interno de Protección Civil (PIPC), fortaleciendo la seguridad y la confianza en cada nivel de tu organización.',
    Icon: GiFireExtinguisher,
    slug: 'analisis-y-evaluacion-de-riesgos',
    color: '#DC2626',  // amber / warning tone
    images: [
      '/images/servicios/riesgos1.jpeg',
      '/images/servicios/riesgos2.jpeg',
      '/images/servicios/riesgos3.jpeg',
    ],
  },
  {
    title: 'Elaboración de programas internos de protección civil.',
    description:
      'La elaboración del Programa Interno de Protección Civil (PIPC) es la base para que tu empresa esté lista ante cualquier emergencia. Diseñamos un plan de acción que previene riesgos, protege a las personas y asegura la continuidad de tus operaciones. Desde la mitigación de riesgos hasta la respuesta y recuperación ante desastres, cada paso está pensado para cuidar lo más importante: tu gente, tus instalaciones y tu futuro.',
    Icon: PiBlueprintDuotone,
    slug: 'elaboracion-programas-internos',
    color: '#16A34A', // safety green
    images: [
      '/images/servicios/programas1.jpeg',
      '/images/servicios/programas2.jpeg',
      '/images/servicios/programas3.jpeg',
    ],
  },
  {
    title: 'Capacitación y formación de brigadas.',
    description:
      'La capacitación y formación de brigadas de emergencia fortalece la capacidad de respuesta de tu empresa ante cualquier eventualidad. Nuestro objetivo es dotar a tu personal de los conocimientos teóricos y prácticos necesarios para actuar con eficacia frente a incendios, desastres naturales, accidentes laborales o fugas de materiales peligrosos. Desde la atención de primeros auxilios hasta la evacuación segura de instalaciones, formamos brigadas que saben responder con precisión y liderazgo cuando más se necesita.',
    Icon: GiTeacher,
    slug: 'formacion-de-brigadas',
    modalContent: '1. Primeros auxilios 2. Reanimación Cardiopulmonar 3. Evacuación y Resguardo 4. Búsqueda y Rescate 5. Uso y manejo de extintores 6. Formación de brigadas 7. Análisis de riesgos 8. Materiales Peligrosos Y mas...',
    color: '#EA580C', // orange
    images: [
      '/images/servicios/brigadas1.jpg',
      '/images/servicios/brigadas2.jpg',
      '/images/servicios/brigadas3.jpeg',
    ],
  },
  {
    title: 'Organización de simulacros y planes de contingencia.',
    description:
      'La organización de simulacros y planes de contingencia garantiza que tu empresa esté preparada para responder con eficacia ante cualquier emergencia. Los planes de contingencia establecen acciones claras, recursos y protocolos de actuación; los simulacros ponen a prueba esos planes, fortaleciendo la coordinación, la toma de decisiones y la calma del personal frente a situaciones críticas. Con cada ejercicio, tu equipo gana experiencia, confianza y capacidad de reacción. Porque la preparación no se improvisa: se entrena.',
    Icon: GiOrganigram,
    slug: 'simulacros-y-contingencia',
    color: '#F59E0B', // red for emergency/fire
    images: [
      '/images/servicios/simulacros1.jpg',
      '/images/servicios/simulacros2.jpg',
      '/images/servicios/simulacros3.jpeg',
    ],
  },
  {
    title: 'Asesoría y defensa legal en materia de protección civil.',
    description:
      'Cumplir con la normativa no solo es una obligación, es una garantía de seguridad jurídica y operativa para tu empresa. Nuestro despacho ofrece asesoría y defensa legal especializada en Protección Civil, respaldando a organizaciones que buscan operar dentro del marco legal y evitar sanciones o contingencias administrativas. Brindamos acompañamiento integral en la elaboración de programas internos, gestión de permisos, cumplimiento normativo y representación legal ante autoridades estatales y municipales. Con un equipo de abogados expertos en derecho civil y normatividad local, aseguramos soluciones precisas, actualizadas y alineadas con las regulaciones vigentes en Baja California.',
    Icon: SiLichess,
    slug: 'asesoria-y-defensa-legal',
    color: 'white', // navy / authority tone
    images: [
      '/images/servicios/legal1.jpeg',
      '/images/servicios/legal2.jpeg',
      '/images/servicios/legal3.jpeg',
    ],
  },
];

export const DASHBOARD_LINKS = [
  { href: '/dashboard', label: 'Resumen', Icon: LayoutDashboard },
  { href: '/dashboard/agenda', label: 'Agenda', Icon: Calendar },
  { href: '/dashboard/galeria', label: 'Galería', Icon: GiPhotoCamera },
  { href: '/dashboard/clientes', label: 'Clientes', Icon: User },
  { href: '/dashboard/equipo', label: 'Equipo', icon: FaPeopleGroup },
  { href: '/dashboard/clientes/pipc-bc', label: 'PIPC-BC', icon: Users2Icon},
  { href: '/dashboard/recibos', label: 'Recibos', Icon: FileText },
  { href: '/dashboard/blog', label: 'Blog', Icon: PenSquare },
  { href: '/dashboard/legal-blog', label: 'Blog Legal', Icon: PenSquare },
  { href: '/dashboard/service-cards', label: 'Tarjetas de Servicio', Icon: PenSquare },
];

export const LEGAL_SERVICES = [
  {
    title: 'Litigio Familiar',
    description:
      'Defensa y asesoría en casos de divorcio, pensiones, custodias y más. Protegemos el bienestar de tu familia.',
    Icon: HeartHandshake,
    href: '/legal/litigio-familiar',
  },
  {
    title: 'Litigio Penal',
    description:
      'Representación legal experta en todas las etapas del proceso penal. Tu libertad y tus derechos son nuestra prioridad.',
    Icon: Gavel,
    href: '/legal/litigio-penal',
  },
  {
    title: 'Litigio Civil',
    description:
      'Soluciones estratégicas para conflictos corporativos, mercantiles y contractuales. Blindamos tu negocio.',
    Icon: Landmark,
    href: '/legal/litigio-civil',
  },
  {
    title: 'Amparos',
    description:
      'Gestión y agilización de todo tipo de permisos y licencias gubernamentales. Evita multas y retrasos.',
    Icon: FileBadge,
    href: '/legal/amparos',
  },
];
