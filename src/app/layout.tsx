import "./globals.css";
import type { Metadata } from 'next';

// Using the correct metadata type from Next.js
export const metadata: Metadata = {
  title: "Turma do Vandré - Agência de Turismo",
  description: "Experimente a magia de explorar os destinos mais deslumbrantes do mundo com os nossos pacotes de viagens personalizados para todos os aventureiros.",
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}