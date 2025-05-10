'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ComponenteAvaliacao() {
  const googleReviewUrl =
    'https://www.google.com.br/search?q=turma+do+vandre&sca_esv=aca16de1709f852f&hl=pt-BR&source=hp&ei=cs7-Z9bXDuPN1sQPtbvNgQE&iflsig=ACkRmUkAAAAAZ_7cgvrzI341M24Xk1_VzjLYHVoAORx3&gs_ssp=eJzj4tVP1zc0zDMzKKywzCkxYLRSNaiwNElOTTU1SbVMNTFKSzFLsTKoMEtJsTQ3sEhOMjA3Tkw1N_PiLyktyk1USMlXKEvMSylKBQDiuxV8&oq=turma+do+vand&gs_lp=Egdnd3Mtd2l6Ig10dXJtYSBkbyB2YW5kKgIIADIOEC4YgAQYxwEYjgUYrwEyBRAAGIAEMgYQABgWGB4yAhAmMgUQABjvBTIFEAAY7wUyCBAAGIAEGKIESM8nUPIDWOodcAF4AJABAJgBvgKgAfcQqgEIMC4xMC4yLjG4AQHIAQD4AQGYAg6gApkRqAIKwgIKEAAYAxjqAhiPAcICChAuGAMY6gIYjwHCAgsQABiABBixAxiDAcICERAuGIAEGLEDGNEDGIMBGMcBwgIREC4YgAQYsQMYgwEY1AIYigXCAggQABiABBixA8ICCBAuGIAEGLEDwgIOEAAYgAQYsQMYgwEYigXCAgsQABiABBiSAxiKBcICDhAAGIAEGLEDGIMBGMkDwgIOEC4YgAQYsQMY0QMYxwHCAgsQLhiABBixAxjUAsICBRAuGIAEwgILEC4YgAQYsQMYgwHCAgoQLhiABBixAxgKmAMG8QXzpPTtMdIfN5IHCDEuMTAuMi4xoAePogGyBwgwLjEwLjIuMbgHkxE&sclient=gws-wiz#lrd=0x94cee54e9e42fd6d:0x6dd9708cb073ae76,1';

  return (
    <section className="py-20 relative overflow-hidden z-10">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{
            backgroundImage: "url('/images/fundo-vandre-colorido.svg')",
            width: '100%',
            height: '100%',
          }}
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <Card className="w-[90%] max-w-2xl mx-auto bg-white/90 backdrop-blur-md shadow-xl border-0 overflow-hidden rounded-2xl">
          <div className="p-8 flex flex-col md:flex-row items-center gap-8">
            {/* Ícone do Google */}
            <div className="md:w-1/4 flex justify-center">
              <div className="w-24 h-24 relative flex items-center justify-center">
                <div className="absolute w-full h-full bg-white rounded-full shadow-md"></div>
                <svg viewBox="0 0 24 24" className="w-16 h-16 relative z-10">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
            </div>

            <div className="md:w-3/4 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-4">
                Avalie a Turma do Vandré no Google
              </h2>
              <p className="text-gray-600 mb-6">
                Sua opinião nos ajuda a melhorar nossos serviços e auxilia
                outros viajantes na escolha da agência ideal para suas férias.
                Leva apenas um minuto!
              </p>

              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <a
                  href={`${googleReviewUrl}&review=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  Avaliar no Google
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
