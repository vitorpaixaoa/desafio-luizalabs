import { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export default function Button({ className = '', variant = 'primary', ...props }: Props) {
  const styles =
    variant === 'primary'
      ? 'bg-brand hover:brightness-110 text-black'
      : 'bg-neutral-800 hover:bg-neutral-700 text-white'
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${styles} ${className}`}
    />
  )
}


