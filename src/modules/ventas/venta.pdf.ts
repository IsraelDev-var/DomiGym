import PDFDocument from 'pdfkit';

interface ItemData {
  nombreItem: string;
  tipo: string;
  cantidad: number;
  precioUnitario: number | string;
  subtotal: number | string;
}

interface VentaData {
  numeroVenta: string;
  fechaVenta: Date | string;
  estado: string;
  subtotal: number | string;
  impuesto: number | string;
  total: number | string;
  metodoPago: string;
  notas?: string | null;
  clienteNombre?: string | null;
  miembro?: { usuario?: { nombre?: string; email?: string } } | null;
  sucursal?: { nombre?: string } | null;
  items?: ItemData[];
}

export function generateVentaPdf(venta: VentaData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const PRIMARY = '#1a1a2e';
    const ACCENT = '#e94560';
    const LIGHT_GRAY = '#f5f5f5';
    const TEXT_GRAY = '#555555';

    // ── HEADER ──────────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 100).fill(PRIMARY);

    doc.fillColor('#ffffff').fontSize(28).font('Helvetica-Bold').text('DomiGym', 50, 30);
    doc.fontSize(10).font('Helvetica').text('Sistema de Gestión de Gimnasio', 50, 62);

    doc
      .fontSize(10)
      .text('RUC: 1234567890001', 350, 30, { align: 'right', width: 195 })
      .text('Av. Principal 123, Ciudad', 350, 44, { align: 'right', width: 195 })
      .text('Tel: +593 99 999 9999', 350, 58, { align: 'right', width: 195 })
      .text('info@domigym.com', 350, 72, { align: 'right', width: 195 });

    // ── TÍTULO RECIBO ───────────────────────────────────────────────
    doc.fillColor(ACCENT).rect(50, 115, doc.page.width - 100, 3).fill();
    doc
      .fillColor(PRIMARY)
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('RECIBO DE VENTA', 50, 125, { align: 'center' });
    doc.fillColor(ACCENT).rect(50, 148, doc.page.width - 100, 3).fill();

    // ── DATOS VENTA & CLIENTE ───────────────────────────────────────
    const fechaStr = new Date(venta.fechaVenta).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    doc.y = 165;
    const col1 = 50;
    const col2 = 310;

    const labelVal = (label: string, value: string, x: number, y: number) => {
      doc.fillColor(TEXT_GRAY).fontSize(9).font('Helvetica').text(label, x, y);
      doc.fillColor(PRIMARY).fontSize(10).font('Helvetica-Bold').text(value, x, y + 12);
    };

    const clienteNombre =
      venta.miembro?.usuario?.nombre ?? venta.clienteNombre ?? 'Cliente general';
    const clienteEmail = venta.miembro?.usuario?.email ?? '—';
    const sucursalNombre = venta.sucursal?.nombre ?? '—';

    labelVal('N° VENTA', venta.numeroVenta, col1, 165);
    labelVal('FECHA', fechaStr, col2, 165);
    labelVal('CLIENTE', clienteNombre, col1, 200);
    labelVal('EMAIL', clienteEmail, col2, 200);
    labelVal('SUCURSAL', sucursalNombre, col1, 235);
    labelVal('MÉTODO DE PAGO', venta.metodoPago, col2, 235);

    // ── TABLA DE ÍTEMS ──────────────────────────────────────────────
    doc.y = 280;
    const tableTop = doc.y;
    const colWidths = [220, 70, 60, 75, 75];
    const headers = ['DESCRIPCIÓN', 'TIPO', 'CANT.', 'P. UNIT.', 'SUBTOTAL'];
    const colX = [50, 270, 340, 400, 475];

    // Header fila
    doc.rect(50, tableTop, doc.page.width - 100, 20).fill(PRIMARY);
    headers.forEach((h, i) => {
      doc
        .fillColor('#ffffff')
        .fontSize(8)
        .font('Helvetica-Bold')
        .text(h, colX[i], tableTop + 6, { width: colWidths[i], align: i > 1 ? 'right' : 'left' });
    });

    let rowY = tableTop + 20;
    const items = venta.items ?? [];

    items.forEach((item, idx) => {
      const bg = idx % 2 === 0 ? '#ffffff' : LIGHT_GRAY;
      doc.rect(50, rowY, doc.page.width - 100, 18).fill(bg);

      doc.fillColor(PRIMARY).fontSize(9).font('Helvetica');
      doc.text(item.nombreItem, colX[0], rowY + 5, { width: colWidths[0] });
      doc.text(item.tipo, colX[1], rowY + 5, { width: colWidths[1], align: 'left' });
      doc.text(String(item.cantidad), colX[2], rowY + 5, { width: colWidths[2], align: 'right' });
      doc.text(`$${Number(item.precioUnitario).toFixed(2)}`, colX[3], rowY + 5, {
        width: colWidths[3],
        align: 'right',
      });
      doc.text(`$${Number(item.subtotal).toFixed(2)}`, colX[4], rowY + 5, {
        width: colWidths[4],
        align: 'right',
      });

      rowY += 18;
    });

    // ── TOTALES ─────────────────────────────────────────────────────
    doc.fillColor(ACCENT).rect(50, rowY + 5, doc.page.width - 100, 1).fill();
    rowY += 15;

    const totalesX = 380;
    const totalesValX = 475;
    const totalesW = 70;

    const totalRow = (label: string, value: string, bold = false, color = PRIMARY) => {
      doc
        .fillColor(TEXT_GRAY)
        .fontSize(9)
        .font('Helvetica')
        .text(label, totalesX, rowY, { width: 90 });
      doc
        .fillColor(color)
        .fontSize(bold ? 11 : 9)
        .font(bold ? 'Helvetica-Bold' : 'Helvetica')
        .text(value, totalesValX, rowY, { width: totalesW, align: 'right' });
      rowY += 16;
    };

    totalRow('Subtotal:', `$${Number(venta.subtotal).toFixed(2)}`);
    totalRow('IVA (12%):', `$${Number(venta.impuesto).toFixed(2)}`);
    doc.fillColor(PRIMARY).rect(totalesX, rowY, totalesW + 95, 1).fill();
    rowY += 4;
    totalRow('TOTAL:', `$${Number(venta.total).toFixed(2)}`, true, ACCENT);

    // ── ESTADO ──────────────────────────────────────────────────────
    rowY += 10;
    const estadoColor =
      venta.estado === 'COMPLETADA'
        ? '#16a34a'
        : venta.estado === 'ANULADA'
          ? '#dc2626'
          : '#d97706';
    doc
      .rect(50, rowY, 100, 20)
      .fill(estadoColor)
      .fillColor('#ffffff')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(venta.estado, 50, rowY + 6, { width: 100, align: 'center' });

    // ── NOTAS ───────────────────────────────────────────────────────
    if (venta.notas) {
      rowY += 35;
      doc
        .fillColor(TEXT_GRAY)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Notas:', 50, rowY);
      doc
        .font('Helvetica')
        .text(venta.notas, 50, rowY + 12, { width: doc.page.width - 100 });
    }

    // ── FOOTER ──────────────────────────────────────────────────────
    doc
      .fillColor(PRIMARY)
      .rect(0, doc.page.height - 40, doc.page.width, 40)
      .fill()
      .fillColor('#aaaaaa')
      .fontSize(8)
      .font('Helvetica')
      .text('Generado por DomiGym — Sistema de Gestión de Gimnasio', 50, doc.page.height - 25, {
        align: 'center',
        width: doc.page.width - 100,
      });

    doc.end();
  });
}
