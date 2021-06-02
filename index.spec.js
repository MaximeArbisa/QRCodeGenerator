const path = require('path')
const { promises: fs } = require('fs')
const { exec } = require('child_process')

function cli(args) {
  return new Promise((resolve) => {
    exec(`node ${path.join(__dirname, 'index')} ${args.join(' ')}`, { cwd: '.' }, (error, stdout, stderr) => {
      resolve({
        code: error && error.code ? error.code : 0,
        error,
        stdout,
        stderr,
      })
    })
  })
}

test('Should return code 1 if destination is not specified', async () => {
  const result = await cli(['input_ids.csv'])

  expect(result.code).toBe(1)
  expect(result.stderr).toBe(`error: required option '-d, --dest <qrCodeDest>' not specified\n`)
})

test('Should return code 1 if csv path is not specified', async () => {
  const result = await cli(['-d', 'output'])

  expect(result.code).toBe(1)
  expect(result.stderr).toBe(`error: missing required argument 'csvPath'\n`)
})

test('Should generate 7 qr codes and return code 0', async () => {
  const result = await cli(['-d', 'output', 'input_ids.csv'])

  // Check for folder creation and number of created files
  const outputPath = path.join(__dirname, 'output')
  const stats = await fs.stat(outputPath)
  const files = await fs.readdir(outputPath)

  expect(result.code).toBe(0)
  expect(result.stdout).toBe(`✓ QR codes generated, 7 succeeded, 0 failed\n`)
  expect(files.length).toBe(7)
  expect(stats.isDirectory()).toBe(true)

  // Delete generated folder after test
  await fs.rmdir(outputPath, { recursive: true })
})
