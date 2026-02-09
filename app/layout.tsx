import "@/styles/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      {" "}
      <body className="bg-[#0a0e17] text-white antialiased">{children}</body>
    </html>
  )
}
