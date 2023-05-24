import { app, ipcMain } from 'electron'
import fs from 'node:fs'
import { join } from 'node:path'
import PdfPrinter from 'pdfmake'
import { isPackaged } from 'electron-is-packaged'

const resourcePath = isPackaged ? process.resourcesPath : join(process.cwd(), 'resources')
const fonts = {
  Roboto: {
    normal: join(resourcePath, 'fonts/Roboto-Regular.ttf'),
    bold: join(resourcePath, 'fonts/Roboto-Medium.ttf'),
    italics: join(resourcePath, 'fonts/Roboto-Italic.ttf'),
    bolditalics: join(resourcePath, 'fonts/Roboto-MediumItalic.ttf')
  }
};

const pdfPrinter = new PdfPrinter(fonts)

function milimetersToPoints (milimeters: number) {
  return (milimeters/25.4)*78
}

export function printTicket (ticketData: TicketData) {
  const tempDir = app.getPath('temp')
  const filename = `${ticketData.entry_date.replace(/:/g, '-')}-${ticketData.id}.pdf`
  const filepath = join(tempDir, filename)
  const pdf = pdfPrinter.createPdfKitDocument({
    pageSize: { width: milimetersToPoints(58), height: 'auto' },
    pageOrientation: 'portrait',
    pageMargins: 10,
    content: [
      { text: `ID: ${ticketData.id}`, style: 'body' },
      { text: `Fecha: ${ticketData.entry_date}`, style: 'body' },
      { text: `Lugar: ${ticketData.parking_place.slug}`, style: 'body' },
      { text: `Tipo de lugar: ${ticketData.parking_place.type}`, style: 'body' },
      { qr: ticketData.id.toString(), style: 'center' }
    ],
    styles: {
      body: { fontSize: 5 },
      center: { alignment: 'center' }
    }
  })
  pdf.pipe(fs.createWriteStream(filepath))
  pdf.end()
  return filepath
}
