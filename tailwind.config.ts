import type { Config } from 'tailwindcss'

const withOpacity = (variable: string) => ({ opacityValue, opacityVariable }: { opacityValue?: string, opacityVariable?: string } = {}) => {
  if (opacityValue !== undefined) return `hsl(var(${variable}) / ${opacityValue})`
  if (opacityVariable !== undefined) return `hsl(var(${variable}) / var(${opacityVariable}))`
  return `hsl(var(${variable}))`
}

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: withOpacity('--background'),
        foreground: withOpacity('--foreground'),

        card: withOpacity('--card'),
        'card-foreground': withOpacity('--card-foreground'),

        popover: withOpacity('--popover'),
        'popover-foreground': withOpacity('--popover-foreground'),

        primary: withOpacity('--primary'),
        'primary-foreground': withOpacity('--primary-foreground'),

        secondary: withOpacity('--secondary'),
        'secondary-foreground': withOpacity('--secondary-foreground'),

        muted: withOpacity('--muted'),
        'muted-foreground': withOpacity('--muted-foreground'),

        accent: withOpacity('--accent'),
        'accent-foreground': withOpacity('--accent-foreground'),

        destructive: withOpacity('--destructive'),
        'destructive-foreground': withOpacity('--destructive-foreground'),

        border: withOpacity('--border'),
        input: withOpacity('--input'),
        ring: withOpacity('--ring'),
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 0.125rem)',
        sm: 'calc(var(--radius) - 0.25rem)'
      }
    }
  },
  plugins: [],
}

export default config
