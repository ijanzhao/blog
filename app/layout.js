export const metadata = {
  title: 'Helleborus R&D DB',
  description: 'Scientific database system'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial' }}>
        {children}
      </body>
    </html>
  )
}
