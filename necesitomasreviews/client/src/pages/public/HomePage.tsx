// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import FAQSection from '../../components/FAQSection';

const HomePage = () => {
  return (
    <div>
{/* Hero Section */}
<section className="hero-pattern py-20 relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent z-0"></div>
  <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
    <div className="md:w-1/2 mb-10 md:mb-0 animate-fadeIn">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
        Más <span className="text-google-blue">reseñas</span> en Google con un simple <span className="text-google-red">toque</span>
      </h1>
      <p className="text-xl mb-8 text-gray-700 leading-relaxed">
        Con nuestras tarjetas inteligentes NFC, tus clientes pueden dejar reseñas en Google con solo acercar su teléfono. Sin códigos QR ni URLs complicadas.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <a href="#paquetes" className="flex items-center justify-center py-3 px-8 bg-google-blue text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors transform hover:scale-105 duration-300 shadow-md">
          <span>Ver Paquetes</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </a>
        <a href="#como-funciona" className="flex items-center justify-center py-3 px-8 border-2 border-google-blue text-google-blue rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
          <span>Cómo Funciona</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
      <div className="mt-8 flex items-center text-sm text-gray-500">
        <svg className="w-5 h-5 text-google-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Envío gratuito a todo el mundo</span>
        <span className="mx-4">|</span>
        <svg className="w-5 h-5 text-google-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Más de 10,000 clientes satisfechos</span>
      </div>
    </div>
    <div className="md:w-1/2 flex justify-center animate-slideInUp">
      <div className="relative">
<img src="/images/nfc-card-demo.png" alt="Tarjeta NFC para Reviews"
     className="rounded-lg max-w-md w-full z-10 relative"/>
        <div className="absolute -bottom-6 -right-6 bg-google-blue/10 w-48 h-48 rounded-full z-0"></div>
        <div className="absolute -top-6 -left-6 bg-google-red/10 w-32 h-32 rounded-full z-0"></div>
      </div>
    </div>
  </div>

  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
</section>

     {/* Country Selector - Mejorado con SVG */}
<section className="py-6 bg-gray-100">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-center">
      <span className="mr-4 font-medium">Selecciona tu país:</span>
      <div className="relative inline-block">
        <select
          className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-google-blue"
          defaultValue="cl"
          onChange={(e) => {
            // Aquí puedes manejar el cambio de país
            console.log("País seleccionado:", e.target.value);

            // Actualizar la bandera visible (opcional si usas JavaScript)
            const flagIcon = document.getElementById('current-flag');
            if (flagIcon) {
              switch(e.target.value) {
                case 'cl': flagIcon.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" class="w-5 h-3">
                    <rect width="1200" height="600" fill="#fff"/>
                    <rect width="400" height="300" fill="#0039a6"/>
                    <path d="M 200,150 238.564,264.627 119.376,197.373H280.624L161.436,264.627z" fill="#fff"/>
                    <rect y="300" width="1200" height="300" fill="#d52b1e"/>
                  </svg>
                `; break;
                case 'mx': flagIcon.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" class="w-5 h-3">
                    <rect width="400" height="600" fill="#006847"/>
                    <rect width="400" height="600" x="400" fill="#fff"/>
                    <rect width="400" height="600" x="800" fill="#ce1126"/>
                  </svg>
                `; break;
                case 'us': flagIcon.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" class="w-5 h-3">
                    <rect width="1200" height="600" fill="#bf0a30"/>
                    <rect y="46.154" width="1200" height="46.154" fill="#fff"/>
                    <rect y="138.462" width="1200" height="46.154" fill="#fff"/>
                    <rect y="230.769" width="1200" height="46.154" fill="#fff"/>
                    <rect y="323.077" width="1200" height="46.154" fill="#fff"/>
                    <rect y="415.385" width="1200" height="46.154" fill="#fff"/>
                    <rect y="507.692" width="1200" height="46.154" fill="#fff"/>
                    <rect width="500" height="323.077" fill="#002868"/>
                  </svg>
                `; break;
                case 'es': flagIcon.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" class="w-5 h-3">
                    <rect width="750" height="500" fill="#c60b1e"/>
                    <rect width="750" height="250" y="125" fill="#ffc400"/>
                  </svg>
                `; break;
                case 'co': flagIcon.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" class="w-5 h-3">
                    <rect width="900" height="600" fill="#fcd116"/>
                    <rect width="900" height="300" y="300" fill="#003893"/>
                    <rect width="900" height="150" y="450" fill="#ce1126"/>
                  </svg>
                `; break;
                case 'ar': flagIcon.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" class="w-5 h-3">
                    <rect width="1200" height="600" fill="#75aadb"/>
                    <rect y="200" width="1200" height="200" fill="#fff"/>
                  </svg>
                `; break;
                case 'pe': flagIcon.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" class="w-5 h-3">
                    <rect width="300" height="600" fill="#D91023"/>
                    <rect width="300" height="600" x="300" fill="#fff"/>
                    <rect width="300" height="600" x="600" fill="#D91023"/>
                  </svg>
                `; break;
                default: flagIcon.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-3">
                    <circle cx="12" cy="12" r="10" fill="#2196f3"/>
                    <path d="M12,2 a10,10 0 0 1 0,20 a10,10 0 0 1 0,-20" stroke="#fff" stroke-width="1" fill="none"/>
                    <path d="M2,12 h20 M12,2 v20" stroke="#fff" stroke-width="1"/>
                  </svg>
                `;
              }
            }
          }}
        >
          <option value="cl">Chile</option>
          <option value="mx">México</option>
          <option value="us">Estados Unidos</option>
          <option value="es">España</option>
          <option value="co">Colombia</option>
          <option value="ar">Argentina</option>
          <option value="pe">Perú</option>
          <option value="other">Otros países</option>
        </select>

        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" id="current-flag">
          {/* Bandera de Chile en SVG - valor predeterminado */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" className="w-5 h-3">
            <rect width="1200" height="600" fill="#fff"/>
            <rect width="400" height="300" fill="#0039a6"/>
            <path d="M 200,150 238.564,264.627 119.376,197.373H280.624L161.436,264.627z" fill="#fff"/>
            <rect y="300" width="1200" height="300" fill="#d52b1e"/>
          </svg>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Beneficios de nuestras tarjetas NFC</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-google-blue bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-google-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Rápido y sencillo</h3>
              <p className="text-gray-600">Tus clientes solo necesitan acercar su teléfono a la tarjeta para dejar una reseña. Sin complicaciones.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-google-red bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-google-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Mayor visibilidad</h3>
              <p className="text-gray-600">Aumenta tu presencia en Google y atrae más clientes con reseñas positivas y auténticas.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-google-green bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-google-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analítica detallada</h3>
              <p className="text-gray-600">Monitorea el uso de tus tarjetas y analiza las tendencias para optimizar tu estrategia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-google-blue rounded-full flex items-center justify-center mb-4 text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Compra tus tarjetas</h3>
              <p className="text-gray-600">Selecciona el paquete que mejor se adapte a tu negocio.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-google-red rounded-full flex items-center justify-center mb-4 text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Activa las tarjetas</h3>
              <p className="text-gray-600">Configura tus tarjetas con la URL de tu perfil de Google.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-google-yellow rounded-full flex items-center justify-center mb-4 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Coloca en tu negocio</h3>
              <p className="text-gray-600">Ubica las tarjetas en lugares visibles para tus clientes.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-google-green rounded-full flex items-center justify-center mb-4 text-white text-2xl font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2">Recibe reseñas</h3>
              <p className="text-gray-600">Tus clientes dejarán reseñas con solo acercar su teléfono.</p>
            </div>
          </div>
        </div>
      </section>

{/* Pricing Section - Improved */}
<section id="paquetes" className="py-20 bg-gradient-to-b from-white to-gray-50">
  <div className="container mx-auto px-4">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-4xl font-bold mb-4">Planes para Potenciar tus Reseñas</h2>
      <p className="text-xl text-gray-600">Elige el paquete que mejor se adapte a las necesidades de tu negocio. Todos incluyen envío gratuito y acceso premium a nuestra plataforma de análisis.</p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Paquete 1: Básico */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-center mb-2">Básico</h3>
          <p className="text-center text-gray-500 mb-6">Ideal para pequeños negocios</p>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">$29</span>
            <span className="text-gray-600 ml-1">USD</span>
            <p className="text-sm text-gray-500 mt-1">Pago único</p>
          </div>
          <div className="bg-gray-50 -mx-8 px-8 py-4 mb-8">
            <p className="text-center font-semibold">Incluye:</p>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span><strong>1 Tarjeta</strong> inteligente NFC</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Dashboard de análisis básico</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Soporte por email</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Activación instantánea</span>
            </li>
          </ul>
          <Link to="/checkout?package=basic" className="block text-center py-3 px-4 bg-google-blue text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium">
            Comprar Ahora
          </Link>
        </div>
      </div>

      {/* Paquete 2: Estándar */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-center mb-2">Estándar</h3>
          <p className="text-center text-gray-500 mb-6">Para negocios en crecimiento</p>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">$59</span>
            <span className="text-gray-600 ml-1">USD</span>
            <p className="text-sm text-gray-500 mt-1">Pago único</p>
          </div>
          <div className="bg-gray-50 -mx-8 px-8 py-4 mb-8">
            <p className="text-center font-semibold">Incluye:</p>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span><strong>3 Tarjetas</strong> inteligentes NFC</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Dashboard completo</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Soporte prioritario</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Informes semanales</span>
            </li>
          </ul>
          <Link to="/checkout?package=standard" className="block text-center py-3 px-4 bg-google-red text-white rounded-lg hover:bg-red-600 transition-colors duration-300 font-medium">
            Comprar Ahora
          </Link>
        </div>
      </div>

      {/* Paquete 3: Premium (Destacado) */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-google-yellow relative transform hover:-translate-y-2 transition-all duration-300">
        <div className="absolute top-0 right-0 bg-google-yellow text-xs text-white px-3 py-1 font-bold tracking-wider rounded-bl">MÁS POPULAR</div>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-center mb-2">Premium</h3>
          <p className="text-center text-gray-500 mb-6">Para negocios establecidos</p>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">$79</span>
            <span className="text-gray-600 ml-1">USD</span>
            <p className="text-sm text-gray-500 mt-1">Pago único</p>
          </div>
          <div className="bg-yellow-50 -mx-8 px-8 py-4 mb-8">
            <p className="text-center font-semibold">Incluye:</p>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span><strong>5 Tarjetas</strong> inteligentes NFC</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Analytics avanzado</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Soporte telefónico</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Personalización de diseño</span>
            </li>
          </ul>
          <Link to="/checkout?package=premium" className="block text-center py-3 px-4 bg-google-yellow text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300 font-medium">
            Comprar Ahora
          </Link>
        </div>
      </div>

      {/* Paquete 4: Empresarial */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-center mb-2">Empresarial</h3>
          <p className="text-center text-gray-500 mb-6">Para múltiples ubicaciones</p>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">$119</span>
            <span className="text-gray-600 ml-1">USD</span>
            <p className="text-sm text-gray-500 mt-1">Pago único</p>
          </div>
          <div className="bg-gray-50 -mx-8 px-8 py-4 mb-8">
            <p className="text-center font-semibold">Incluye:</p>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span><strong>10 Tarjetas</strong> inteligentes NFC</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Analytics premium</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Soporte 24/7</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Branding personalizado</span>
            </li>
          </ul>
          <Link to="/checkout?package=business" className="block text-center py-3 px-4 bg-google-green text-white rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium">
            Comprar Ahora
          </Link>
        </div>
      </div>
    </div>

    <div className="mt-12 text-center max-w-2xl mx-auto">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <p className="text-lg mb-2">¿Tienes un código de descuento?</p>
        <p className="text-gray-600 mb-4">Podrás ingresarlo durante el proceso de compra</p>
        <div className="flex items-center justify-center space-x-4">
          <img src="/icons/paypal.svg" alt="PayPal" className="h-8" />
          <img src="/icons/mercadopago.svg" alt="Mercado Pago" className="h-8" />
          <img src="/icons/webpay.svg" alt="WebPay Plus" className="h-8" />
        </div>
      </div>
    </div>
  </div>
</section>

   {/* Subscription Plans Section */}
<section id="suscripciones" className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-4xl font-bold mb-4">Planes de Suscripción Premium</h2>
      <p className="text-xl text-gray-600">Potencia tu experiencia con funciones avanzadas y análisis detallados de tus tarjetas NFC.</p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {/* Plan Básico (Gratuito) */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-center mb-2">Básico</h3>
          <p className="text-center text-gray-500 mb-6">Incluido con tus tarjetas</p>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">$0</span>
            <span className="text-gray-600 ml-1">USD</span>
            <p className="text-sm text-gray-500 mt-1">Para siempre</p>
          </div>
          <div className="bg-gray-50 -mx-8 px-8 py-4 mb-8">
            <p className="text-center font-semibold">Funciones incluidas:</p>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Estadísticas básicas</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Dashboard básico</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Soporte por email</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-red mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span className="text-gray-400">Estadísticas avanzadas</span>
            </li>
          </ul>
          <div className="block text-center py-3 px-4 bg-gray-100 text-gray-700 rounded-lg transition-colors duration-300 font-medium">
            Incluido
          </div>
        </div>
      </div>

      {/* Plan Premium Mensual (Destacado) */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-google-blue relative transform hover:-translate-y-2 transition-all duration-300">
        <div className="absolute top-0 right-0 bg-google-blue text-xs text-white px-3 py-1 font-bold tracking-wider rounded-bl">RECOMENDADO</div>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-center mb-2">Premium</h3>
          <p className="text-center text-gray-500 mb-6">Análisis avanzado mensual</p>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">$19</span>
            <span className="text-gray-600 ml-1">USD</span>
            <p className="text-sm text-gray-500 mt-1">por mes</p>
          </div>
          <div className="bg-blue-50 -mx-8 px-8 py-4 mb-8">
            <p className="text-center font-semibold">Todo lo básico más:</p>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-blue mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Estadísticas avanzadas</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-blue mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Exportación de reportes</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-blue mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Alertas personalizadas</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-blue mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Soporte prioritario</span>
            </li>
          </ul>
          <Link to="/dashboard/subscription-plans" className="block text-center py-3 px-4 bg-google-blue text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium">
            Comenzar ahora
          </Link>
        </div>
      </div>

      {/* Plan Premium Anual */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-center mb-2">Premium Anual</h3>
          <p className="text-center text-gray-500 mb-6">Mayor ahorro</p>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">$199</span>
            <span className="text-gray-600 ml-1">USD</span>
            <p className="text-sm text-gray-500 mt-1">por año</p>
            <p className="text-sm text-google-red font-medium mt-1">Ahorra 2 meses</p>
          </div>
          <div className="bg-gray-50 -mx-8 px-8 py-4 mb-8">
            <p className="text-center font-semibold">Todo lo del plan Premium más:</p>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Análisis de tendencias anuales</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Reportes comparativos</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Ahorro de 2 meses</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-google-green mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Soporte telefónico</span>
            </li>
          </ul>
          <Link to="/dashboard/subscription-plans" className="block text-center py-3 px-4 bg-google-green text-white rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium">
            Comenzar ahora
          </Link>
        </div>
      </div>
    </div>

    <div className="mt-12 text-center max-w-2xl mx-auto">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="text-xl font-semibold mb-4">¿Por qué suscribirte al plan Premium?</h4>
        <p className="text-gray-600 mb-6">Desbloquea todo el potencial de tus tarjetas NFC con estadísticas detalladas, análisis profundo y herramientas avanzadas que te ayudarán a entender mejor el comportamiento de tus clientes y maximizar tus reseñas.</p>
        <Link to="/dashboard" className="text-google-blue hover:underline font-medium">
          Ver todas las características →
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* Testimonials Section */}
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-4xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
      <p className="text-xl text-gray-600">Miles de negocios ya están aumentando sus reseñas con nuestras tarjetas NFC</p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
     {/* Testimonial 1 */}
      <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 mr-4">
            <img className="h-16 w-16 rounded-full object-cover" src="/images/testimonial-1.jpg" alt="Cliente" />
          </div>
          <div>
            <h4 className="text-xl font-semibold">Restaurante El Fogón</h4>
            <div className="flex text-google-yellow">
              <span>★★★★★</span>
            </div>
          </div>
        </div>
        <blockquote className="text-gray-700 mb-4">
          "Desde que implementamos las tarjetas NFC, nuestras reseñas en Google han aumentado un 300%. La plataforma es muy fácil de usar y los clientes adoran la experiencia."
        </blockquote>
        <p className="text-gray-500 font-medium">Carlos Mendoza, Propietario</p>
      </div>

      {/* Testimonial 2 */}
      <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 mr-4">
            <img className="h-16 w-16 rounded-full object-cover" src="/images/testimonial-2.jpg" alt="Cliente" />
          </div>
          <div>
            <h4 className="text-xl font-semibold">Clínica Dental Sonrisa</h4>
            <div className="flex text-google-yellow">
              <span>★★★★★</span>
            </div>
          </div>
        </div>
        <blockquote className="text-gray-700 mb-4">
          "Las tarjetas NFC han revolucionado la forma en que recopilamos reseñas. Nuestros pacientes encuentran el proceso tan sencillo que nuestras calificaciones han mejorado significativamente."
        </blockquote>
        <p className="text-gray-500 font-medium">Dra. Laura Sánchez, Directora</p>
      </div>

      {/* Testimonial 3 */}
      <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 mr-4">
            <img className="h-16 w-16 rounded-full object-cover" src="/images/testimonial-3.jpg" alt="Cliente" />
          </div>
          <div>
            <h4 className="text-xl font-semibold">Hotel Vista Hermosa</h4>
            <div className="flex text-google-yellow">
              <span>★★★★★</span>
            </div>
          </div>
        </div>
        <blockquote className="text-gray-700 mb-4">
          "La inversión en estas tarjetas ha sido altamente rentable. Hemos visto un aumento del 40% en las reservas directas gracias a las mejores calificaciones en Google."
        </blockquote>
        <p className="text-gray-500 font-medium">Miguel Ángel Torres, Gerente</p>
      </div>
    </div>
  </div>
</section>

      <FAQSection />

      {/* Contact Section - Improved */}
<section id="contacto" className="py-20">
  <div className="container mx-auto px-4">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-4xl font-bold mb-4">¿Necesitas ayuda?</h2>
      <p className="text-xl text-gray-600">Nuestro equipo está listo para responder tus preguntas y ayudarte a elegir la mejor opción para tu negocio.</p>
    </div>

    <div className="grid md:grid-cols-2 gap-12 items-start">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold mb-6">Envíanos un mensaje</h3>
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" id="name" name="name" placeholder="Tu nombre" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" name="email" placeholder="tu@email.com"
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition"/>
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
            <input type="text" id="subject" name="subject" placeholder="¿En qué podemos ayudarte?"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition"/>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea id="message" name="message" rows={4} placeholder="Escribe tu mensaje aquí..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition"></textarea>
          </div>
          <div className="flex items-start">
            <input type="checkbox" id="privacy" name="privacy" className="mt-1 mr-2"/>
            <label htmlFor="privacy" className="text-sm text-gray-600">
              Acepto la <a href="/privacy" className="text-google-blue hover:underline">Política de Privacidad</a> y
              recibir comunicaciones de NecesitoMasReviews.
            </label>
          </div>
          <button type="submit"
                  className="w-full py-3 px-4 bg-google-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md">
            Enviar Mensaje
          </button>
        </form>
      </div>

      <div>
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-google-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                <p className="text-gray-600">contacto@necesitomasreviews.com</p>
                <p className="text-gray-600">soporte@necesitomasreviews.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-google-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Teléfono</h4>
                <p className="text-gray-600">+56 2 2123 4567 (Chile)</p>
                <p className="text-gray-600">+52 55 1234 5678 (México)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Nuestras Oficinas</h3>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-google-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Santiago, Chile <span
                    className="text-sm text-gray-500">(Sede Principal)</span></h4>
                <p className="text-gray-600">Av. Providencia 1234, Providencia</p>
                <p className="text-gray-600">Santiago, Chile</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-google-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Ciudad de México, México</h4>
                <p className="text-gray-600">Av. Reforma 567, Cuauhtémoc</p>
                <p className="text-gray-600">CDMX, México</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-google-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Austin, Texas, USA</h4>
                <p className="text-gray-600">Congress Avenue 890, Downtown</p>
                <p className="text-gray-600">Austin, TX, USA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
};

export default HomePage;