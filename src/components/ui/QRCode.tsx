import { QrCode, Ecc } from '@/lib/qrcodegen'

const ECC_LEVEL_MAP: Record<string, Ecc> = {
  L: Ecc.LOW,
  M: Ecc.MEDIUM,
  Q: Ecc.QUARTILE,
  H: Ecc.HIGH,
}

interface QRCodeSVGProps {
  value: string
  size?: number
  level?: 'L' | 'M' | 'Q' | 'H'
  marginSize?: number
  fgColor?: string
  bgColor?: string
}

export function QRCodeSVG({
  value,
  size = 128,
  level = 'L',
  marginSize = 4,
  fgColor = '#000000',
  bgColor = '#ffffff',
}: QRCodeSVGProps) {
  const ecl = ECC_LEVEL_MAP[level] ?? Ecc.LOW
  const qr = QrCode.encodeText(value, ecl)
  const modules = qr.size
  const margin = marginSize
  const viewBoxSize = modules + margin * 2

  const cells: string[] = []
  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      if (qr.getModule(x, y)) {
        cells.push(`M${x + margin},${y + margin}h1v1h-1z`)
      }
    }
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      shapeRendering="crispEdges"
    >
      {bgColor && bgColor !== 'none' && (
        <rect width={viewBoxSize} height={viewBoxSize} fill={bgColor} />
      )}
      <path fill={fgColor} d={cells.join('')} />
    </svg>
  )
}
