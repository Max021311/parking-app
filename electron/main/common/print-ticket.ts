import { app, ipcMain } from 'electron'
import fs from 'node:fs'
import { join } from 'node:path'
import PdfPrinter from 'pdfmake'

const fonts = {
  Roboto: {
    normal: join(process.cwd(), 'fonts/Roboto-Regular.ttf'),
    bold: join(process.cwd(), 'fonts/Roboto-Medium.ttf'),
    italics: join(process.cwd(), 'fonts/Roboto-Italic.ttf'),
    bolditalics: join(process.cwd(), 'fonts/Roboto-MediumItalic.ttf')
  }
};

const pdfPrinter = new PdfPrinter(fonts)

function milimetersToPoints (milimeters: number) {
  return (milimeters/25.4)*78
}

export function printTicket (ticketData: TicketData) {
  const tempDir = app.getPath('temp')
  const filename = `${ticketData.date.replace(/\s/g, '-')}-${ticketData.id}.pdf`
  const filepath = join(tempDir, filename)
  const pdf = pdfPrinter.createPdfKitDocument({
    pageSize: { width: milimetersToPoints(58), height: 'auto' },
    pageOrientation: 'portrait',
    pageMargins: 10,
    content: [
      { text: `ID: ${ticketData.id}`, style: 'body' },
      { text: `Fecha: ${ticketData.date}`, style: 'body' },
      { text: `Lugar: ${ticketData.position}`, style: 'body' },
      { qr: JSON.stringify({ id: ticketData.id }) }
    ],
    styles: {
      body: { fontSize: 5 }
    }
  })
  pdf.pipe(fs.createWriteStream(filepath))
  pdf.end()
  return filepath
}
