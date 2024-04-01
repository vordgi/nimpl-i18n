export const metadata = {
  title: 'Next.js @nimpl/i18n Example',
  description: '',
}

type RootLayoutProps = { children: React.ReactNode }

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
