import PDFDocument from 'pdfkit';

// Datos fijos de la empresa
const EMPRESA = {
  nombre: 'DomiGym',
  ruc: '1792345678001',
  direccion: 'Av. Principal 123, Quito',
  telefono: '+593 2 234-5678',
  email: 'info@domigym.com',
  tagline: 'Tu salud, nuestra pasión',
};

// Colores
const COLOR_PRIMARY = '#1d4ed8';   // azul
const COLOR_DARK    = '#111827';   // negro
const COLOR_GRAY    = '#6b7280';
const COLOR_LIGHT   = '#f3f4f6';
const COLOR_GREEN   = '#059669';
const COLOR_RED     = '#dc2626';

type FacturaData = {
  numeroFactura: string;
  fechaEmision: Date | string;
  estado: string;
  subtotal: number;
  impuesto: number;
  total: number;
  notas?: string | null;
  pago: {
    metodoPago: string;
    numeroComprobante?: string | null;
    fechaPago: Date | string;
    miembro: {
      fechaInicio: Date | string;
      fechaFin: Date | string;
      usuario: { nombre: string; email: string };
      sucursal: { nombre: string; ciudad: string; direccion: string };
      planMembresia: { nombre: string; precio: number; duracionDias: number };
    };
  };
};

export function generateFacturaPdf(factura: FacturaData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const { pago } = factura;
    const { miembro } = pago;
    const pageWidth = doc.page.width - 100; // margen 50 a cada lado

    // ── ENCABEZADO ────────────────────────────────────────────────
    // Fondo azul del header
    doc.rect(0, 0, doc.page.width, 110).fill(COLOR_PRIMARY);

    // Nombre empresa
    doc
      .font('Helvetica-Bold')
      .fontSize(28)
      .fillColor('white')
      .text(EMPRESA.nombre, 50, 30);

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('white')
      .text(EMPRESA.tagline, 50, 62);

    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor('white')
      .text(`${EMPRESA.direccion}  |  ${EMPRESA.telefono}  |  ${EMPRESA.email}`, 50, 80);

    // Texto "FACTURA" a la derecha
    doc
      .font('Helvetica-Bold')
      .fontSize(22)
      .fillColor('white')
      .text('FACTURA', 50, 30, { align: 'right' });

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('white')
      .text(`N° ${factura.numeroFactura}`, 50, 58, { align: 'right' });

    const estadoColor = factura.estado === 'EMITIDA' ? '#bbf7d0' : '#fecaca';
    const estadoText  = factura.estado === 'EMITIDA' ? COLOR_GREEN   : COLOR_RED;

    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(estadoText)
      .text(factura.estado, 50, 80, { align: 'right' });

    // ── BLOQUE INFORMATIVO (Empresa + Cliente) ───────────────────
    const infoY = 130;

    // Columna izquierda: Datos de empresa
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(COLOR_GRAY)
      .text('DATOS DE LA EMPRESA', 50, infoY);

    doc.font('Helvetica').fontSize(9).fillColor(COLOR_DARK);
    doc.text(`RUC: ${EMPRESA.ruc}`, 50, infoY + 14);
    doc.text(EMPRESA.direccion, 50, infoY + 26);
    doc.text(EMPRESA.telefono, 50, infoY + 38);
    doc.text(EMPRESA.email, 50, infoY + 50);

    // Columna derecha: Datos del cliente
    const rx = 320;
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(COLOR_GRAY)
      .text('CLIENTE', rx, infoY);

    doc.font('Helvetica').fontSize(9).fillColor(COLOR_DARK);
    doc.text(miembro.usuario.nombre, rx, infoY + 14);
    doc.text(miembro.usuario.email, rx, infoY + 26);
    doc.text(`Sucursal: ${miembro.sucursal.nombre}`, rx, infoY + 38);
    doc.text(`${miembro.sucursal.ciudad} — ${miembro.sucursal.direccion}`, rx, infoY + 50);

    // ── FECHAS ────────────────────────────────────────────────────
    const fechaY = infoY + 80;
    doc.rect(50, fechaY, pageWidth, 30).fill(COLOR_LIGHT);

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor(COLOR_GRAY)
      .text('FECHA EMISIÓN', 60, fechaY + 6)
      .text('FECHA PAGO', 220, fechaY + 6)
      .text('COMPROBANTE', 370, fechaY + 6);

    doc.font('Helvetica').fontSize(9).fillColor(COLOR_DARK);
    doc.text(formatDate(factura.fechaEmision), 60, fechaY + 17);
    doc.text(formatDate(pago.fechaPago), 220, fechaY + 17);
    doc.text(pago.numeroComprobante ?? '—', 370, fechaY + 17);

    // ── TABLA DE SERVICIOS ────────────────────────────────────────
    const tableY = fechaY + 50;

    // Encabezado tabla
    doc.rect(50, tableY, pageWidth, 22).fill(COLOR_PRIMARY);
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor('white')
      .text('DESCRIPCIÓN',    60, tableY + 7)
      .text('PERÍODO',       280, tableY + 7)
      .text('PRECIO',        460, tableY + 7, { width: 80, align: 'right' });

    // Fila del servicio
    const rowY = tableY + 22;
    doc.rect(50, rowY, pageWidth, 30).fill('#f9fafb');

    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLOR_DARK);
    doc.text(miembro.planMembresia.nombre, 60, rowY + 6);
    doc.font('Helvetica').fontSize(8).fillColor(COLOR_GRAY);
    doc.text(`Plan ${miembro.planMembresia.duracionDias} días`, 60, rowY + 17);

    doc.font('Helvetica').fontSize(9).fillColor(COLOR_DARK);
    const periodo = `${formatDate(miembro.fechaInicio)} — ${formatDate(miembro.fechaFin)}`;
    doc.text(periodo, 280, rowY + 11);

    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(COLOR_DARK)
      .text(`$${Number(miembro.planMembresia.precio).toFixed(2)}`, 460, rowY + 11, { width: 80, align: 'right' });

    // ── TOTALES ───────────────────────────────────────────────────
    const totalsY = rowY + 50;
    const totalsX = 360;

    doc.moveTo(totalsX, totalsY).lineTo(530, totalsY).stroke(COLOR_LIGHT);

    drawTotalRow(doc, totalsX, totalsY + 8,  'Subtotal (sin IVA):', `$${factura.subtotal.toFixed(2)}`);
    drawTotalRow(doc, totalsX, totalsY + 24, 'IVA (12%):', `$${factura.impuesto.toFixed(2)}`);

    // Línea separadora
    doc.moveTo(totalsX, totalsY + 40).lineTo(530, totalsY + 40).lineWidth(1).stroke(COLOR_GRAY);

    // Total final con fondo
    doc.rect(totalsX - 5, totalsY + 44, 175, 22).fill(COLOR_PRIMARY);
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('white')
      .text('TOTAL:', totalsX, totalsY + 50)
      .text(`$${factura.total.toFixed(2)}`, totalsX, totalsY + 50, { width: 165, align: 'right' });

    // ── MÉTODO DE PAGO ────────────────────────────────────────────
    const metodoPagoY = totalsY + 90;
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(COLOR_GRAY)
      .text('MÉTODO DE PAGO', 50, metodoPagoY);

    doc.font('Helvetica').fontSize(9).fillColor(COLOR_DARK);
    doc.text(formatMetodo(pago.metodoPago), 50, metodoPagoY + 14);

    // ── NOTAS ─────────────────────────────────────────────────────
    if (factura.notas) {
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(COLOR_GRAY)
        .text('NOTAS', 50, metodoPagoY + 40);

      doc.font('Helvetica').fontSize(9).fillColor(COLOR_DARK).text(factura.notas, 50, metodoPagoY + 54);
    }

    // ── FOOTER ────────────────────────────────────────────────────
    const footerY = doc.page.height - 60;
    doc.rect(0, footerY, doc.page.width, 60).fill(COLOR_LIGHT);
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(COLOR_GRAY)
      .text(
        'Este documento es una factura electrónica generada por el sistema DomiGym.',
        50,
        footerY + 14,
        { align: 'center', width: pageWidth },
      )
      .text(
        `${EMPRESA.nombre}  ·  RUC ${EMPRESA.ruc}  ·  ${EMPRESA.telefono}`,
        50,
        footerY + 28,
        { align: 'center', width: pageWidth },
      );

    doc.end();
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatMetodo(metodo: string): string {
  const map: Record<string, string> = {
    EFECTIVO: 'Efectivo',
    TARJETA: 'Tarjeta de crédito/débito',
    TRANSFERENCIA: 'Transferencia bancaria',
  };
  return map[metodo] ?? metodo;
}

function drawTotalRow(doc: PDFKit.PDFDocument, x: number, y: number, label: string, value: string) {
  doc.font('Helvetica').fontSize(9).fillColor(COLOR_GRAY).text(label, x, y);
  doc.font('Helvetica').fontSize(9).fillColor(COLOR_DARK).text(value, x, y, { width: 165, align: 'right' });
}
