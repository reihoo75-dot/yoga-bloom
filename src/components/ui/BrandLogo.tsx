interface BrandLogoProps {
  size?: number
}

export function BrandLogo({ size = 120 }: BrandLogoProps) {
  return (
    <img
      src="/images/logo.png"
      width={size}
      height={size}
      alt="Yoga Flow Journal"
      style={{ objectFit: 'contain' }}
    />
  )
}
