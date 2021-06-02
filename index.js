#!/usr/bin/env node

const { promises: fs } = require('fs')
const csv = require('csvtojson')
const path = require('path')
const { program } = require('commander')
const QRCode = require('qrcode')
const jimp = require('jimp')

const QR_CODE_SIZE = 300 // Size in pixels

program
  .version('1.0.0')
  .description('generate unique QR codes from a csv file')
  // csvPath is required by commander
  .arguments('<csvPath>')
  // --dest is required by commander
  .requiredOption('-d, --dest <qrCodeDest>', 'path where all the generated QR codes will be stored')
  .option('-p, --prefix <qrCodePrefix>', 'prefix that will be added to each id')
  .option('-l, --label', 'Whether to add label or not to each QR code')
  .action(async (csvPath, options) => {
    try {
      // Get ids from CSV
      const csvFilePath = path.join(__dirname, csvPath)
      const jsonIds = await csv({ noheader: true }).fromFile(csvFilePath)
      const ids = jsonIds.map((jsonId) => jsonId.field1.replace(';', ''))

      // Create new output folder
      const outputPath = path.join(__dirname, options.dest)
      await fs.mkdir(outputPath, { recursive: true })

      // Load font for all QR codes if a label is required
      const qrFont = options.label ? await jimp.loadFont(jimp.FONT_SANS_16_BLACK) : null

      // Generate QR codes in parallel
      const failedIds = []

      await Promise.all(
        ids.map(async (id) => {
          try {
            const data = `${options.prefix ? `${options.prefix}/` : ''}${id}`
            const qrPath = path.join(outputPath, `${id}.png`)

            // Generate QR code
            await QRCode.toFile(qrPath, data, {
              width: QR_CODE_SIZE,
            })

            // Ending if a label is not needed
            if (!options.label) {
              return
            }

            // Reading image
            const image = await jimp.read(qrPath)

            // Computing label position according to font and QR code size
            const textWidth = jimp.measureText(qrFont, id)
            const textHeight = jimp.measureTextHeight(qrFont, id)

            const labelX = QR_CODE_SIZE / 2 - textWidth / 2
            const labelY = QR_CODE_SIZE - textHeight - 8 // 8px margin-bottom

            // Adding label on image
            image.print(qrFont, labelX, labelY, id)
            return image.writeAsync(qrPath)
          } catch (err) {
            // Don't stop execution for other QR codes
            failedIds.push(id)
            console.error('QR Code failed', id, err)
          }
        }),
      )

      // Exit process successfully
      console.log(`✓ QR codes generated, ${ids.length - failedIds.length} succeeded, ${failedIds.length} failed`)
      process.exit(0)
    } catch (err) {
      console.error('QR Code generation failed', err)
      process.exit(1)
    }
  })
  .parse(process.argv)
