import { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function IconHome(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9" />
    </svg>
  )
}

export function IconArtist(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  )
}

export function IconPlaylist(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M3 6h14" />
      <path d="M3 12h10" />
      <path d="M17 8v8a3 3 0 1 0 3-3h-3" />
    </svg>
  )
}

export function IconUser(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M4 21c1.8-3.6 5-5.5 8-5.5s6.2 1.9 8 5.5" />
    </svg>
  )
}

export function IconDownload(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 7v8" />
      <path d="M8.5 11.5 12 15l3.5-3.5" />
    </svg>
  )
}


