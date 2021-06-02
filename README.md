## Prerequisites

- Use node >= 12
- Run `yarn` at the project root to install the dependencies

### Usage

Run `$ node index.js -d <qrCodeDest> -p <qrCodePrefix> -l <csvPath>`

### Command line arguments

- **csvPath**: [path] this is the path to your csv file. This csv file must contain unique ids in a single column.

- **qrCodeDest** (option `-d` or `--dest`): [path] this is the path where all the generated QRcodes will be stored.

- **qrCodePrefix** (option `-p` or `--prefix`): [string] you can provide a prefix (e.g an url) that will be added to each qrCode encryted data

- option `-l` or `--label`: you can add a label on each QRCode image. This feature is disabled by default. Label will be added to the bottom center of each qrCode image

- Help command
  Run `$ node index.js -h` for information :

```
Usage: index [options] <csvPath>

Generate unique QR codes from a csv file

Options:
  -V, --version                output the version number
  -d, --dest <qrCodeDest>      path where all the generated QR codes will be
                               stored
  -p, --prefix <qrCodePrefix>  prefix that will be added to each id
  -l, --label                  whether to add label or not to each QR code
  -h, --help                   display help for command
```
