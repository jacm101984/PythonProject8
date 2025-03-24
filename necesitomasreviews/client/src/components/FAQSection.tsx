import React, { useState } from 'react';

// Este componente puede ser usado dentro de tu HomePage
const FAQSection = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {/* FAQ Item 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-google-blue focus:ring-opacity-50"
              onClick={() => toggleFaq(0)}
            >
              <span className="font-semibold text-lg">¿Cómo funcionan las tarjetas inteligentes?</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openFaqIndex === 0 ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openFaqIndex === 0 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 pb-4 pt-2">
                <p className="text-gray-600">Las tarjetas utilizan tecnología NFC (Near Field Communication) que permite a los smartphones leer información con solo acercarlos. Cuando un cliente acerca su teléfono a la tarjeta, es dirigido automáticamente a tu página de Google para dejar una reseña.</p>
              </div>
            </div>
          </div>

          {/* FAQ Item 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-google-blue focus:ring-opacity-50"
              onClick={() => toggleFaq(1)}
            >
              <span className="font-semibold text-lg">¿Son compatibles con todos los teléfonos?</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openFaqIndex === 1 ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openFaqIndex === 1 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 pb-4 pt-2">
                <p className="text-gray-600">Sí, nuestras tarjetas inteligentes son compatibles con la mayoría de los smartphones modernos. Los dispositivos iPhone 7 o superior y la mayoría de los dispositivos Android fabricados después de 2014 tienen capacidad NFC. Para iPhone, solo necesitan acercar el teléfono a la tarjeta. Para Android, es posible que necesiten tener el NFC activado en la configuración.</p>
              </div>
            </div>
          </div>

          {/* FAQ Item 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-google-blue focus:ring-opacity-50"
              onClick={() => toggleFaq(2)}
            >
              <span className="font-semibold text-lg">¿Cómo configuro mis tarjetas inteligentes?</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openFaqIndex === 2 ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openFaqIndex === 2 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 pb-4 pt-2">
                <p className="text-gray-600">El proceso es muy sencillo. Después de comprar, te enviaremos instrucciones detalladas. Básicamente, accederás a tu dashboard en nuestra plataforma, introducirás la URL de tu perfil de Google Business y vincularás tus tarjetas. No se requieren conocimientos técnicos y todo el proceso toma menos de 5 minutos.</p>
              </div>
            </div>
          </div>

          {/* FAQ Item 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-google-blue focus:ring-opacity-50"
              onClick={() => toggleFaq(3)}
            >
              <span className="font-semibold text-lg">¿Cuánto duran las tarjetas inteligentes?</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openFaqIndex === 3 ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openFaqIndex === 3 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 pb-4 pt-2">
                <p className="text-gray-600">Nuestras tarjetas inteligentes están diseñadas para durar años. El chip NFC integrado tiene una vida útil de más de 10 años en condiciones normales. Las tarjetas son resistentes al agua y están fabricadas con materiales duraderos para soportar el uso diario en entornos comerciales.</p>
              </div>
            </div>
          </div>

          {/* FAQ Item 5 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-google-blue focus:ring-opacity-50"
              onClick={() => toggleFaq(4)}
            >
              <span className="font-semibold text-lg">¿Puedo cambiar la URL de mi perfil después de configurarla?</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openFaqIndex === 4 ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openFaqIndex === 4 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 pb-4 pt-2">
                <p className="text-gray-600">¡Absolutamente! Puedes cambiar la URL de destino de tus tarjetas inteligentes en cualquier momento desde tu dashboard. Esto te permite actualizar tu perfil si cambia, o incluso utilizar las tarjetas para diferentes negocios o sucursales según tus necesidades.</p>
              </div>
            </div>
          </div>

          {/* FAQ Item 6 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-google-blue focus:ring-opacity-50"
              onClick={() => toggleFaq(5)}
            >
              <span className="font-semibold text-lg">¿Ofrecen diseños personalizados para las tarjetas?</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openFaqIndex === 5 ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openFaqIndex === 5 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 pb-4 pt-2">
                <p className="text-gray-600">Sí, ofrecemos opciones de personalización. Nuestros paquetes Premium y Empresarial incluyen personalización básica con tu logo y colores de marca. Para personalización más avanzada o diseños totalmente personalizados, contáctanos para discutir tus necesidades específicas y te proporcionaremos un presupuesto.</p>
              </div>
            </div>
          </div>

          {/* FAQ Item 7 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-google-blue focus:ring-opacity-50"
              onClick={() => toggleFaq(6)}
            >
              <span className="font-semibold text-lg">¿Cuánto tiempo tarda en llegar mi pedido?</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openFaqIndex === 6 ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openFaqIndex === 6 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 pb-4 pt-2">
                <p className="text-gray-600">El tiempo de entrega varía según tu ubicación. Para la mayoría de los países de Latinoamérica, el tiempo de entrega es de 7-14 días hábiles. Para Estados Unidos y España, generalmente 5-10 días hábiles. Para otros países, el tiempo estimado es de 10-20 días hábiles. Recibirás un número de seguimiento una vez que tu pedido sea enviado.</p>
              </div>
            </div>
          </div>

          {/* FAQ Item 8 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-google-blue focus:ring-opacity-50"
              onClick={() => toggleFaq(7)}
            >
              <span className="font-semibold text-lg">¿Puedo ver estadísticas de uso de mis tarjetas?</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openFaqIndex === 7 ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openFaqIndex === 7 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 pb-4 pt-2">
                <p className="text-gray-600">Sí, todos nuestros planes incluyen acceso a un dashboard de analítica donde podrás ver cuántas veces se han escaneado tus tarjetas, en qué momentos del día, y cuántas reseñas has recibido como resultado. Los planes Premium y Empresarial incluyen análisis más detallados y la posibilidad de exportar informes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;