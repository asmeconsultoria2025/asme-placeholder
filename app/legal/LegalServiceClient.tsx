'use client';

import Image from 'next/image';

interface ServiceSection {
  title: string;
  description: string;
  image: string;
}

interface Props {
  sections: ServiceSection[];
  pageTitle: string;
  pageDescription: string;
}

export default function LegalServiceClient({ sections, pageTitle, pageDescription }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{pageTitle}</h1>
          <p className="text-xl text-gray-400">{pageDescription}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800">
              <div className={`grid md:grid-cols-2 gap-8 p-8 ${idx % 2 !== 0 ? 'md:grid-flow-dense' : ''}`}>
                <div className={`flex flex-col justify-center ${idx % 2 !== 0 ? 'md:col-start-2' : ''}`}>
                  <h3 className="text-3xl font-bold text-white mb-4">{section.title}</h3>
                  <p className="text-gray-400 text-lg">{section.description}</p>
                </div>

                <div className={`relative aspect-video rounded-lg overflow-hidden bg-gray-800 ${idx % 2 !== 0 ? 'md:col-start-1' : ''}`}>
                  {section.image ? (
                    <Image src={section.image} alt={section.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-500 text-sm">Próximamente</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}