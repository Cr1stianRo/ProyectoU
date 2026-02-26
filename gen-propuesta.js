const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, convertInchesToTwip, PageBreak, TabStopType, TabStopPosition, NumberFormat, LevelFormat, Footer, Header } = require("docx");
const fs = require("fs");

// ─── Estilos APA 7: Times New Roman 12pt, doble espacio, sangría ───
const FONT = "Times New Roman";
const SIZE = 24; // 12pt en half-points
const LINE_SPACING = 360; // doble espacio (240 * 1.5 ~= 360 aprox, 480 = doble real)
const DBLSPACE = 480;
const INDENT = convertInchesToTwip(0.5);

function tn(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: SIZE, ...opts });
}

function tnBold(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: SIZE, bold: true, ...opts });
}

function tnItalic(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: SIZE, italics: true, ...opts });
}

// Párrafo normal con sangría primera línea y doble espacio
function parr(...runs) {
  return new Paragraph({
    spacing: { line: DBLSPACE, after: 0 },
    indent: { firstLine: INDENT },
    children: runs,
  });
}

// Párrafo sin sangría
function parrNoIndent(...runs) {
  return new Paragraph({
    spacing: { line: DBLSPACE, after: 0 },
    children: runs,
  });
}

// Título centrado en negrita (Nivel 1 APA)
function heading1(text) {
  return new Paragraph({
    spacing: { line: DBLSPACE, before: 240, after: 0 },
    alignment: AlignmentType.CENTER,
    children: [tnBold(text)],
  });
}

// Subtítulo alineado izquierda negrita (Nivel 2 APA)
function heading2(text) {
  return new Paragraph({
    spacing: { line: DBLSPACE, before: 240, after: 0 },
    children: [tnBold(text)],
  });
}

// Nivel 3 APA: negrita cursiva alineado izquierda
function heading3(text) {
  return new Paragraph({
    spacing: { line: DBLSPACE, before: 240, after: 0 },
    indent: { firstLine: INDENT },
    children: [tnBold(text, { italics: true })],
  });
}

function empty() {
  return new Paragraph({ spacing: { line: DBLSPACE, after: 0 }, children: [tn("")] });
}

// Referencia APA (con sangría francesa)
function ref(text) {
  return new Paragraph({
    spacing: { line: DBLSPACE, after: 0 },
    indent: { left: INDENT, hanging: INDENT },
    children: [tn(text)],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ─── TABLA DE CRONOGRAMA ───
const { Table, TableRow, TableCell, WidthType, ShadingType, VerticalAlign } = require("docx");

function cronCell(text, opts = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts.shading ? { type: ShadingType.SOLID, color: opts.shading } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { line: 276, after: 0 },
      children: [new TextRun({ text, font: FONT, size: 20, bold: !!opts.bold })],
    })],
  });
}

function cronHeader() {
  const h = (t, w) => cronCell(t, { bold: true, center: true, shading: "D9E2F3", width: w });
  return new TableRow({
    children: [
      h("Fase", 10), h("Actividad", 30),
      h("M1", 7.5), h("M2", 7.5), h("M3", 7.5), h("M4", 7.5), h("M5", 7.5), h("M6", 7.5), h("M7", 7.5),
    ],
  });
}

function cronRow(fase, actividad, meses) {
  const cells = [
    cronCell(fase, { center: true, width: 10 }),
    cronCell(actividad, { width: 30 }),
  ];
  for (let i = 1; i <= 7; i++) {
    cells.push(cronCell("", {
      center: true, width: 7.5,
      shading: meses.includes(i) ? "4472C4" : undefined,
    }));
  }
  return new TableRow({ children: cells });
}

// ═══════════════════════════════════════════════════════════
//                    DOCUMENTO PRINCIPAL
// ═══════════════════════════════════════════════════════════

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT, size: SIZE },
        paragraph: { spacing: { line: DBLSPACE } },
      },
    },
  },
  numbering: {
    config: [{
      reference: "apa-list",
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: "\u2022",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: convertInchesToTwip(0.75), hanging: convertInchesToTwip(0.25) } } },
      }],
    }],
  },
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left: convertInchesToTwip(1),
          right: convertInchesToTwip(1),
        },
      },
    },
    children: [

      // ═══════════ PORTADA ═══════════
      empty(), empty(), empty(), empty(), empty(),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: DBLSPACE, after: 0 },
        children: [tnBold("Desarrollo de un Sistema de Gestión de Contenido Modular para la Creación y Personalización de Sitios Web de Hogares Geriátricos")],
      }),
      empty(), empty(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: DBLSPACE, after: 0 },
        children: [tn("Propuesta de Investigación")],
      }),
      empty(), empty(), empty(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: DBLSPACE, after: 0 },
        children: [tn("Ingeniería de Sistemas / Ingeniería de Software")],
      }),
      empty(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: DBLSPACE, after: 0 },
        children: [tn("2025")],
      }),

      pageBreak(),

      // ═══════════ CONTENIDO ═══════════
      heading1("Contenido"),
      empty(),
      parrNoIndent(tn("Título de la propuesta de investigación")),
      parrNoIndent(tn("Planteamiento del problema")),
      parrNoIndent(tn("Justificación")),
      parrNoIndent(tn("Objetivos")),
      parr(tn("Objetivo general")),
      parr(tn("Objetivos específicos")),
      parrNoIndent(tn("Títulos del marco teórico")),
      parrNoIndent(tn("Estrategia metodológica")),
      parrNoIndent(tn("Cronograma")),
      parrNoIndent(tn("Referencias bibliográficas")),

      pageBreak(),

      // ═══════════ TÍTULO ═══════════
      heading1("Título de la Propuesta de Investigación"),
      empty(),
      parr(tn("Desarrollo de un Sistema de Gestión de Contenido Modular para la Creación y Personalización de Sitios Web de Hogares Geriátricos")),

      empty(),

      // ═══════════ PLANTEAMIENTO DEL PROBLEMA ═══════════
      heading1("Planteamiento del Problema"),
      empty(),

      parr(
        tn("El envejecimiento poblacional representa una de las transformaciones demográficas más significativas del siglo XXI. Según la Organización Mundial de la Salud (OMS, 2022), se estima que para el año 2030 una de cada seis personas en el mundo tendrá más de 60 años, lo que incrementará la demanda de servicios de atención geriátrica especializada. En Colombia, el Departamento Administrativo Nacional de Estadística (DANE, 2023) reporta que la población mayor de 65 años pasó del 7,7% en 2018 al 9,1% en 2023, con proyecciones que indican un crecimiento sostenido en las próximas décadas."),
      ),

      parr(
        tn("Frente a este panorama, los hogares geriátricos cumplen un papel fundamental en la prestación de servicios de cuidado integral para adultos mayores. Sin embargo, muchas de estas instituciones, particularmente las de menor escala, enfrentan dificultades para establecer una presencia digital efectiva. La ausencia de un sitio web profesional limita su capacidad para comunicar los servicios que ofrecen, generar confianza en las familias que buscan opciones de cuidado y competir en un mercado donde la primera impresión frecuentemente ocurre en el ámbito digital (Gómez y Rodríguez, 2021)."),
      ),

      parr(
        tn("Las soluciones existentes para la creación de sitios web, como WordPress o Wix, si bien son herramientas consolidadas, presentan limitaciones específicas cuando se aplican al sector geriátrico. Estas plataformas requieren un nivel de conocimiento técnico que muchos administradores de hogares geriátricos no poseen, generan costos recurrentes por licencias y plugins especializados, y no ofrecen plantillas ni funcionalidades orientadas a las necesidades particulares del sector, como la presentación de servicios de cuidado diurno y permanente, la exhibición de equipos interdisciplinarios de salud o la integración directa con canales de comunicación como WhatsApp (Morales, 2022)."),
      ),

      parr(
        tn("Adicionalmente, los sistemas de gestión de contenido genéricos no incorporan mecanismos de multi-tenencia que permitan a múltiples instituciones operar de manera independiente bajo una misma plataforma, lo cual resulta esencial para lograr escalabilidad y reducir los costos operativos de mantenimiento tecnológico (Bezemer y Zaidman, 2010)."),
      ),

      parr(
        tn("Ante esta problemática surge la siguiente pregunta orientadora: ¿Cómo desarrollar un sistema de gestión de contenido web que permita a los hogares geriátricos crear y personalizar su sitio de manera autónoma, sin requerir conocimientos técnicos, garantizando una arquitectura modular, escalable y multi-tenant?"),
      ),

      empty(),

      // ═══════════ JUSTIFICACIÓN ═══════════
      heading1("Justificación"),
      empty(),

      parr(
        tn("La transformación digital ha dejado de ser una opción para convertirse en una necesidad transversal a todos los sectores productivos y de servicios. En el ámbito del cuidado geriátrico, la presencia web no solo funciona como vitrina institucional, sino como canal de comunicación directa con las familias que buscan opciones de atención para sus adultos mayores. Estudios recientes demuestran que más del 70% de las familias inician su búsqueda de servicios geriátricos a través de internet antes de realizar visitas presenciales (Anderson y Perrin, 2023)."),
      ),

      parr(
        tn("El presente proyecto se justifica desde múltiples perspectivas. Desde el punto de vista de la "),
        tnBold("novedad"),
        tn(", no se identifican en el mercado actual plataformas CMS diseñadas específicamente para el sector geriátrico colombiano que combinen una arquitectura multi-tenant con un enfoque modular orientado a las necesidades particulares de estas instituciones. Las soluciones existentes obligan a los usuarios a adaptarse a plantillas genéricas que no contemplan secciones específicas como servicios de cuidado permanente, equipos interdisciplinarios de salud, galerías de actividades terapéuticas o integración nativa con WhatsApp Business."),
      ),

      parr(
        tn("Desde la perspectiva de la "),
        tnBold("viabilidad técnica"),
        tn(", el proyecto se fundamenta en tecnologías de código abierto ampliamente documentadas y soportadas por comunidades activas de desarrollo. La combinación de React para el frontend, Node.js con Express para el backend y MongoDB como sistema de base de datos constituye un stack tecnológico maduro, escalable y con abundante documentación técnica disponible (Subramanian, 2019). La arquitectura modular propuesta permite el desarrollo incremental, donde cada módulo funciona de manera independiente, lo que reduce el riesgo técnico y facilita las pruebas unitarias e integración continua."),
      ),

      parr(
        tn("En cuanto a la "),
        tnBold("trascendencia social"),
        tn(", el sistema democratiza el acceso a herramientas de comunicación digital para instituciones que históricamente han sido excluidas de los procesos de transformación tecnológica. Un hogar geriátrico que cuente con un sitio web profesional puede comunicar con mayor claridad sus servicios, generar confianza institucional, facilitar la toma de decisiones de las familias y, en última instancia, contribuir al bienestar de la población adulta mayor al conectar oferta y demanda de servicios de cuidado de manera más eficiente."),
      ),

      parr(
        tn("La "),
        tnBold("factibilidad económica"),
        tn(" del proyecto radica en que la funcionalidad de exportación estática permite a cada institución desplegar su sitio web en plataformas de hosting gratuitas como Netlify, Vercel o GitHub Pages, eliminando los costos recurrentes asociados a servidores dedicados o licencias de software propietario. Esto resulta especialmente relevante para hogares geriátricos con presupuestos limitados que no pueden destinar recursos significativos a infraestructura tecnológica."),
      ),

      parr(
        tn("Finalmente, desde el punto de vista "),
        tnBold("académico"),
        tn(", el proyecto integra competencias fundamentales de la ingeniería de software: diseño de arquitecturas multi-tenant, desarrollo full-stack con tecnologías modernas, implementación de patrones de diseño como MVC y RESTful, gestión de autenticación con JWT, pruebas automatizadas con Playwright y metodologías ágiles de desarrollo. Representa una oportunidad para aplicar de manera práctica los conocimientos adquiridos durante la formación profesional en un contexto real con impacto social tangible."),
      ),

      empty(),

      // ═══════════ OBJETIVOS ═══════════
      heading1("Objetivos"),
      empty(),

      heading2("Objetivo General"),
      empty(),
      parr(
        tn("Desarrollar un sistema de gestión de contenido web modular y multi-tenant que permita a los hogares geriátricos crear, personalizar y exportar sitios web profesionales de manera autónoma, sin requerir conocimientos técnicos en programación."),
      ),

      empty(),

      heading2("Objetivos Específicos"),
      empty(),
      parr(
        tn("1. Diseñar una arquitectura de software basada en módulos independientes que facilite la creación, edición y organización dinámica de las secciones del sitio web, garantizando escalabilidad y mantenibilidad del sistema."),
      ),
      parr(
        tn("2. Implementar un sistema de autenticación multi-tenant con aislamiento de datos por usuario, utilizando JSON Web Tokens y MongoDB, que asegure la privacidad y la independencia de la configuración de cada institución."),
      ),
      parr(
        tn("3. Construir una interfaz de administración intuitiva con editores visuales y vista previa en tiempo real para cada módulo del sitio, que permita a usuarios sin formación técnica gestionar el contenido de manera efectiva."),
      ),
      parr(
        tn("4. Desarrollar una funcionalidad de exportación que genere una versión estática del sitio web en formato comprimido, lista para su despliegue en plataformas de hosting gratuitas, eliminando la dependencia del servidor backend."),
      ),

      empty(),

      // ═══════════ MARCO TEÓRICO ═══════════
      heading1("Títulos del Marco Teórico"),
      empty(),
      parr(tn("A continuación se presentan los temas que darán contexto teórico a la investigación:")),
      empty(),

      parrNoIndent(tnBold("1. Sistemas de Gestión de Contenido (CMS)")),
      parr(tn("Definición, evolución histórica, clasificación (headless, tradicional, estático) y análisis comparativo de plataformas existentes como WordPress, Strapi y Ghost.")),
      empty(),

      parrNoIndent(tnBold("2. Arquitectura Multi-Tenant en Aplicaciones Web")),
      parr(tn("Modelos de aislamiento de datos (base de datos compartida vs. separada), estrategias de implementación, ventajas y desafíos en aplicaciones SaaS.")),
      empty(),

      parrNoIndent(tnBold("3. Desarrollo Web Full-Stack con JavaScript")),
      parr(tn("Ecosistema de Node.js y React, patrón de diseño MVC, API RESTful, comunicación cliente-servidor y gestión de estado en aplicaciones de página única (SPA).")),
      empty(),

      parrNoIndent(tnBold("4. Autenticación y Seguridad en Aplicaciones Web")),
      parr(tn("JSON Web Tokens (JWT), cifrado de contraseñas con bcrypt, middleware de autorización, validación de entradas y prevención de vulnerabilidades OWASP.")),
      empty(),

      parrNoIndent(tnBold("5. Bases de Datos NoSQL y Modelado Flexible")),
      parr(tn("MongoDB como sistema de base de datos orientado a documentos, esquemas flexibles con Mongoose, campos de tipo Mixed y estrategias de indexación por usuario.")),
      empty(),

      parrNoIndent(tnBold("6. Diseño de Interfaces de Usuario y Experiencia de Usuario (UI/UX)")),
      parr(tn("Principios de usabilidad, diseño responsivo con Bootstrap, sistemas de diseño basados en variables CSS y personalización dinámica de temas visuales.")),
      empty(),

      parrNoIndent(tnBold("7. Generación de Sitios Estáticos y Estrategias de Despliegue")),
      parr(tn("Renderizado estático vs. dinámico, empaquetado de archivos con Archiver, plataformas de hosting estático (Netlify, Vercel, GitHub Pages) y optimización para producción.")),
      empty(),

      parrNoIndent(tnBold("8. Envejecimiento Poblacional y Transformación Digital en el Sector Geriátrico")),
      parr(tn("Contexto demográfico colombiano, necesidades de comunicación digital de los hogares geriátricos y brecha tecnológica en instituciones de cuidado del adulto mayor.")),
      empty(),

      // ═══════════ ESTRATEGIA METODOLÓGICA ═══════════
      heading1("Estrategia Metodológica"),
      empty(),

      parr(
        tn("El desarrollo del proyecto se lleva a cabo siguiendo una metodología de desarrollo ágil incremental, organizada en fases secuenciales que permiten la construcción progresiva del sistema. Cada fase produce entregables funcionales que se integran de manera acumulativa hasta conformar el producto final. A continuación se describen las fases de desarrollo:"),
      ),
      empty(),

      heading2("Fase 1: Análisis de Requisitos y Diseño Arquitectónico"),
      parr(
        tn("Se realiza un levantamiento de requisitos funcionales y no funcionales a partir del análisis de sitios web existentes de hogares geriátricos, tomando como referencia instituciones como Casa de Campo Edén. Se define la arquitectura del sistema con enfoque multi-tenant, el modelo de datos basado en PageConfig con secciones dinámicas, el stack tecnológico (React, Node.js, Express, MongoDB) y los patrones de diseño a implementar (MVC, RESTful, modular)."),
      ),
      empty(),

      heading2("Fase 2: Implementación del Núcleo del Sistema"),
      parr(
        tn("Se desarrolla la infraestructura base del sistema: configuración del servidor Express con middleware de CORS y manejo de JSON, conexión a MongoDB mediante Mongoose, sistema de autenticación con registro, inicio de sesión y generación de JWT, middleware de verificación de tokens, y el modelo de datos central PageConfig con soporte para secciones de tipo Mixed. Se implementa también la instancia de Axios con interceptor de JWT en el frontend y el contexto de autenticación con React Context."),
      ),
      empty(),

      heading2("Fase 3: Desarrollo de Módulos de Contenido"),
      parr(
        tn("Se construyen los módulos de edición de contenido de manera incremental, donde cada módulo comprende un controlador backend con endpoints GET y PUT, un componente frontend con editor visual y vista previa en tiempo real, y su integración en el panel de administración. Los módulos implementados incluyen: Bloque Principal (hero), Carrusel de Galería, Servicios y Comodidades, Valores Institucionales, Sobre Nosotros, Equipo Humano, Video Institucional, Mapa y Ubicación, Galería del Hogar y Cuidado Día. Cada módulo sigue un patrón de desarrollo documentado que garantiza consistencia arquitectónica."),
      ),
      empty(),

      heading2("Fase 4: Implementación del Módulo de Diseño y Personalización"),
      parr(
        tn("Se desarrolla el módulo de personalización visual que permite al usuario configurar la paleta de colores del sitio mediante ocho paletas predefinidas o selectores de color personalizados, seleccionar tipografías con carga dinámica desde Google Fonts, ajustar el estilo de componentes (bordes, botones) y reorganizar el orden de visualización de las secciones con vista previa en tiempo real. Se implementa el ThemeProvider como componente global que aplica las variables CSS dinámicamente."),
      ),
      empty(),

      heading2("Fase 5: Sistema de Exportación Estática"),
      parr(
        tn("Se construye la funcionalidad de exportación que genera un archivo ZIP conteniendo un sitio web estático completamente funcional. El proceso incluye la obtención de toda la configuración del usuario desde MongoDB, la generación de HTML con las secciones renderizadas en el orden configurado, la creación de un archivo CSS con las variables del tema personalizado, la descarga paralela de todas las imágenes referenciadas y el empaquetado mediante la librería Archiver. El resultado es un sitio desplegable en cualquier plataforma de hosting estático."),
      ),
      empty(),

      heading2("Fase 6: Pruebas, Documentación y Refinamiento"),
      parr(
        tn("Se ejecutan pruebas funcionales automatizadas mediante Playwright para validar los flujos principales del sistema. Se documenta el código fuente con comentarios técnicos, se genera la guía de usuario y se realizan ajustes de usabilidad basados en las pruebas realizadas. Se verifica la exportación estática en plataformas de despliegue como Netlify para confirmar la funcionalidad completa del sitio generado."),
      ),
      empty(),

      heading2("Fase 7: Entrega Final y Socialización"),
      parr(
        tn("Se consolidan los entregables del proyecto: código fuente documentado, documento de propuesta de investigación, guía de usuario del sistema y demostración funcional. Se prepara la socialización del proyecto ante la comunidad académica."),
      ),

      empty(),

      // ═══════════ CRONOGRAMA ═══════════
      heading1("Cronograma"),
      empty(),
      parr(tn("La siguiente tabla presenta la relación de actividades por fase y su distribución temporal en meses:")),
      empty(),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          cronHeader(),
          cronRow("1", "Análisis de requisitos y diseño arquitectónico", [1]),
          cronRow("2", "Implementación del núcleo (auth, BD, API base)", [1, 2]),
          cronRow("3", "Desarrollo de módulos de contenido", [2, 3, 4]),
          cronRow("4", "Módulo de diseño y personalización visual", [4, 5]),
          cronRow("5", "Sistema de exportación estática (ZIP)", [5]),
          cronRow("6", "Pruebas, documentación y refinamiento", [5, 6]),
          cronRow("7", "Entrega final y socialización", [6, 7]),
        ],
      }),
      empty(),
      parr(tn("Nota: M1 a M7 representan los meses de ejecución del proyecto. Las celdas sombreadas indican el período de actividad de cada fase.")),

      pageBreak(),

      // ═══════════ REFERENCIAS ═══════════
      heading1("Referencias Bibliográficas"),
      empty(),

      ref("Anderson, M. y Perrin, A. (2023). Tech adoption climbs among older adults. Pew Research Center. https://www.pewresearch.org/internet/2023/01/31/tech-adoption-climbs-among-older-adults/"),

      ref("Bezemer, C. P. y Zaidman, A. (2010). Multi-tenant SaaS applications: Maintenance dream or nightmare? Proceedings of the Joint ERCIM Workshop on Software Evolution and International Workshop on Principles of Software Evolution, 88–92. https://doi.org/10.1145/1862372.1862393"),

      ref("DANE. (2023). Proyecciones de población y estadísticas vitales. Departamento Administrativo Nacional de Estadística. https://www.dane.gov.co/index.php/estadisticas-por-tema/demografia-y-poblacion"),

      ref("Gómez, A. y Rodríguez, M. (2021). Transformación digital en instituciones de cuidado del adulto mayor en América Latina: retos y oportunidades. Revista Iberoamericana de Tecnología en Educación y Educación en Tecnología, (29), 45–53. https://doi.org/10.24215/18509959.29.e5"),

      ref("Meta Platforms. (2024). React: A JavaScript library for building user interfaces (Versión 18) [Software]. https://react.dev/"),

      ref("MongoDB, Inc. (2024). MongoDB documentation. https://www.mongodb.com/docs/"),

      ref("Morales, J. (2022). Análisis comparativo de sistemas de gestión de contenido para pequeñas y medianas empresas en Colombia. Revista Colombiana de Computación, 23(1), 34–48."),

      ref("Node.js Foundation. (2024). Node.js documentation (Versión 18 LTS) [Software]. https://nodejs.org/docs/latest-v18.x/api/"),

      ref("Organización Mundial de la Salud. (2022). Envejecimiento y salud. https://www.who.int/es/news-room/fact-sheets/detail/ageing-and-health"),

      ref("Subramanian, V. (2019). Pro MERN Stack: Full stack web app development with Mongo, Express, React, and Node (2.ª ed.). Apress. https://doi.org/10.1007/978-1-4842-4391-6"),

    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("propuesta-investigacion.docx", buffer);
  console.log("OK: propuesta-investigacion.docx generado");
});
