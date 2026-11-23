// Draws the invoice as an A4 page in the browser and saves it as a PNG, JPEG or PDF file:
// no print dialog and no extra libraries. The PDF is a single page holding the JPEG.

export type InvoiceFileData = {
  number: string;
  issued: string;
  amount: string;
  rows: [string, string][];
  nextSteps: string[];
  contactLine: string;
  academy: { address: string; phone: string; email: string };
};

export type InvoiceFormat = "pdf" | "jpeg" | "png";

// A4 at 150dpi
const WIDTH = 1240;
const HEIGHT = 1754;
const MARGIN = 110;

const colors = {
  page: "#ffffff",
  brand: "#123f3a",
  teal: "#02796c",
  charcoal: "#303735",
  sage: "#c6d9d2",
  pending: "#9a6a12",
};

/** The site's fonts (next/font gives them generated names, kept in CSS variables) */
function fontFamily(variable: string, fallback: string) {
  const name = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return name || fallback;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Writes text wrapped to a width; returns the y below the last line */
function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, lineHeight: number) {
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > width && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}

async function drawInvoice(data: InvoiceFileData) {
  await document.fonts.ready;
  const body = fontFamily("--font-dm-sans", "sans-serif");
  const heading = fontFamily("--font-manrope", "sans-serif");

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = colors.page;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.textBaseline = "alphabetic";

  // Header: logo left, BiscoTech's details right
  const logo = await loadImage("/img/logo-mark.png");
  ctx.drawImage(logo, MARGIN, 90, 102, 120);
  ctx.textAlign = "right";
  ctx.fillStyle = colors.brand;
  ctx.font = `700 30px ${heading}`;
  ctx.fillText("BiscoTech Academy", WIDTH - MARGIN, 120);
  ctx.fillStyle = colors.charcoal;
  ctx.font = `400 24px ${body}`;
  ctx.fillText(data.academy.address, WIDTH - MARGIN, 160);
  ctx.fillText(`${data.academy.phone} · ${data.academy.email}`, WIDTH - MARGIN, 196);

  ctx.fillStyle = colors.sage;
  ctx.fillRect(MARGIN, 250, WIDTH - MARGIN * 2, 2);

  // Title and status
  ctx.textAlign = "left";
  ctx.fillStyle = colors.brand;
  ctx.font = `700 60px ${heading}`;
  ctx.fillText("Invoice", MARGIN, 350);
  ctx.textAlign = "right";
  ctx.fillStyle = colors.pending;
  ctx.font = `600 26px ${body}`;
  ctx.fillText("Payment pending", WIDTH - MARGIN, 340);

  // Amount due panel
  ctx.textAlign = "left";
  ctx.fillStyle = colors.sage;
  ctx.beginPath();
  ctx.roundRect(MARGIN, 400, WIDTH - MARGIN * 2, 170, 16);
  ctx.fill();
  ctx.fillStyle = colors.charcoal;
  ctx.font = `500 26px ${body}`;
  ctx.fillText("AMOUNT DUE", MARGIN + 40, 460);
  ctx.fillStyle = colors.brand;
  ctx.font = `600 54px ${heading}`;
  ctx.fillText(data.amount, MARGIN + 40, 530);

  // Details, one row each
  let y = 650;
  for (const [label, value] of data.rows) {
    ctx.textAlign = "left";
    ctx.fillStyle = colors.charcoal;
    ctx.font = `400 26px ${body}`;
    ctx.fillText(label, MARGIN, y);
    ctx.textAlign = "right";
    ctx.fillStyle = label === "Payment status" ? colors.pending : colors.brand;
    ctx.font = `600 26px ${body}`;
    ctx.fillText(value, WIDTH - MARGIN, y);
    ctx.fillStyle = "#e3ece9";
    ctx.fillRect(MARGIN, y + 22, WIDTH - MARGIN * 2, 1);
    y += 62;
  }

  // What next
  y += 40;
  ctx.textAlign = "left";
  ctx.fillStyle = colors.brand;
  ctx.font = `600 34px ${heading}`;
  ctx.fillText("What next?", MARGIN, y);
  y += 54;
  ctx.font = `400 25px ${body}`;
  for (const step of data.nextSteps) {
    ctx.fillStyle = colors.teal;
    ctx.beginPath();
    ctx.arc(MARGIN + 8, y - 9, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.charcoal;
    y = wrap(ctx, step, MARGIN + 34, y, WIDTH - MARGIN * 2 - 34, 36) + 10;
  }
  ctx.font = `400 23px ${body}`;
  wrap(ctx, data.contactLine, MARGIN, y + 10, WIDTH - MARGIN * 2, 34);

  // Footer line
  ctx.textAlign = "center";
  ctx.fillStyle = colors.teal;
  ctx.font = `500 22px ${body}`;
  ctx.fillText(`Invoice ${data.number} · Issued ${data.issued} · biscotech.org`, WIDTH / 2, HEIGHT - 70);

  return canvas;
}

/** A one-page A4 PDF holding a JPEG (the image is stored as-is, DCTDecode) */
function jpegToPdf(jpeg: Uint8Array, width: number, height: number) {
  const pageW = 595.28;
  const pageH = 841.89;
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (chunk: Uint8Array | string) => {
    const bytes = typeof chunk === "string" ? encoder.encode(chunk) : chunk;
    parts.push(bytes);
    length += bytes.length;
  };
  const object = (n: number, body: string) => {
    offsets[n] = length;
    push(`${n} 0 obj\n${body}\nendobj\n`);
  };

  const content = `q ${pageW} 0 0 ${pageH} 0 0 cm /Im0 Do Q`;
  push("%PDF-1.4\n");
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  object(
    3,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
  );
  offsets[4] = length;
  push(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
  );
  push(jpeg);
  push("\nendstream\nendobj\n");
  object(5, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  const xref = length;
  push(`xref\n0 6\n0000000000 65535 f \n`);
  for (let n = 1; n <= 5; n++) push(`${String(offsets[n]).padStart(10, "0")} 00000 n \n`);
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);

  return new Blob(parts as BlobPart[], { type: "application/pdf" });
}

function canvasBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not create image"))), type, 0.92),
  );
}

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Draws the invoice and saves it in the chosen format */
export async function downloadInvoice(data: InvoiceFileData, format: InvoiceFormat) {
  const canvas = await drawInvoice(data);
  const name = `BiscoTech-invoice-${data.number}`;

  if (format === "png") return save(await canvasBlob(canvas, "image/png"), `${name}.png`);

  const jpeg = await canvasBlob(canvas, "image/jpeg");
  if (format === "jpeg") return save(jpeg, `${name}.jpg`);

  const bytes = new Uint8Array(await jpeg.arrayBuffer());
  save(jpegToPdf(bytes, WIDTH, HEIGHT), `${name}.pdf`);
}
