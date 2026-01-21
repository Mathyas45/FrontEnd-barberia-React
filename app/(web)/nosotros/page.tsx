/**
 * ============================================================
 * PÁGINA - NOSOTROS (Pública)
 * ============================================================
 * 
 * Información sobre la barbería, historia, equipo, etc.
 * 
 * Esta es una página de contenido estático que puedes
 * personalizar según las necesidades del negocio.
 */

import { Award, Clock, MapPin, Users } from 'lucide-react';

export default function NosotrosPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Sobre Nosotros</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Más de 10 años brindando servicios de barbería de primera calidad
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Imagen placeholder */}
            <div className="bg-gray-200 rounded-xl h-80 flex items-center justify-center">
              <span className="text-gray-400">Imagen de la barbería</span>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nuestra Historia
              </h2>
              <p className="text-gray-600 mb-4">
                Fundada en 2015, nuestra barbería nació con la visión de ofrecer 
                servicios de barbería tradicional combinados con las últimas tendencias.
              </p>
              <p className="text-gray-600 mb-4">
                A lo largo de los años, hemos atendido a miles de clientes, 
                construyendo relaciones duraderas basadas en la confianza y la calidad.
              </p>
              <p className="text-gray-600">
                Hoy contamos con un equipo de profesionales altamente capacitados, 
                listos para brindarte la mejor experiencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-blue-100">Años de experiencia</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5000+</div>
              <div className="text-blue-100">Clientes satisfechos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">8</div>
              <div className="text-blue-100">Profesionales</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-blue-100">Servicios</div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Calidad</h3>
              <p className="text-gray-600 text-sm">
                Utilizamos los mejores productos y técnicas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Profesionalismo</h3>
              <p className="text-gray-600 text-sm">
                Equipo capacitado y comprometido
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Puntualidad</h3>
              <p className="text-gray-600 text-sm">
                Respetamos tu tiempo con citas programadas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-600 text-sm">
                Ubicación céntrica y accesible
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
