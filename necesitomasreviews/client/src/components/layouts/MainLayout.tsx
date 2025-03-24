import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Añadiendo la exportación nombrada con 'export const'
export const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
<Link to="/" className="text-2xl font-bold">
  <span className="text-google-blue">Necesito</span>
  <span className="text-google-red">Mas</span>
  <span className="text-google-yellow">Reviews</span>
  <span className="text-google-green">.com</span>
</Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#beneficios" className="hover:text-google-blue transition">Beneficios</a>
            <a href="#como-funciona" className="hover:text-google-blue transition">Cómo Funciona</a>
            <a href="#paquetes" className="hover:text-google-blue transition">Precios</a>
            <a href="#contacto" className="hover:text-google-blue transition">Contacto</a>
          </nav>

          <div className="flex space-x-4">
            {user ? (
                <>
                  <Link to="/dashboard" className="py-2 px-4 rounded hover:bg-gray-100 transition">Dashboard</Link>
                  <button onClick={logout}
                          className="py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">Cerrar
                    Sesión
                  </button>
                </>
            ) : (
                <>
                <Link to="/login" className="py-2 px-4 rounded hover:bg-gray-100 transition">Iniciar Sesión</Link>
                <Link to="/register" className="py-2 px-4 bg-google-blue text-white rounded hover:bg-blue-600 transition">Registrarse</Link>
              </>
            )}
          </div>

          <button onClick={toggleMenu} className="md:hidden focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="container mx-auto px-4 py-3">
              <nav className="flex flex-col space-y-2">
                <a href="#beneficios" className="py-2 hover:text-google-blue transition"
                   onClick={toggleMenu}>Beneficios</a>
                <a href="#como-funciona" className="py-2 hover:text-google-blue transition" onClick={toggleMenu}>Cómo
                  Funciona</a>
                <a href="#paquetes" className="py-2 hover:text-google-blue transition" onClick={toggleMenu}>Precios</a>
                <a href="#contacto" className="py-2 hover:text-google-blue transition" onClick={toggleMenu}>Contacto</a>
                {user ? (
                    <>
                      <Link to="/dashboard" className="py-2 hover:text-google-blue transition"
                            onClick={toggleMenu}>Dashboard</Link>
                      <button onClick={() => {
                        logout();
                        toggleMenu();
                      }} className="py-2 text-left text-red-600 hover:text-red-800 transition">Cerrar Sesión
                      </button>
                    </>
                ) : (
                    <>
                      <Link to="/login" className="py-2 hover:text-google-blue transition" onClick={toggleMenu}>Iniciar
                        Sesión</Link>
                      <Link to="/register" className="py-2 text-google-blue hover:text-blue-700 transition"
                            onClick={toggleMenu}>Registrarse</Link>
                    </>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet/>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NecesitoMasReviews.com</h3>
              <p className="text-gray-400">La solución más sencilla para aumentar tus reseñas en Google con tecnología NFC.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#beneficios" className="text-gray-400 hover:text-white transition">Beneficios</a></li>
                <li><a href="#como-funciona" className="text-gray-400 hover:text-white transition">Cómo Funciona</a>
                </li>
                <li><a href="#paquetes" className="text-gray-400 hover:text-white transition">Precios</a></li>
                <li><a href="#contacto" className="text-gray-400 hover:text-white transition">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <div>
                  <ul className="space-y-2">
                    <li><Link to="/terms" className="text-gray-400 hover:text-white transition">Términos y
                      Condiciones</Link></li>
                    <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Política de
                      Privacidad</Link></li>
                    <li><Link to="/shipping" className="text-gray-400 hover:text-white transition">Política de
                      Envíos</Link></li>
                    <li><Link to="/refunds" className="text-gray-400 hover:text-white transition">Política de
                      Reembolsos</Link></li>
                  </ul>
                </div>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contáctanos</h4>
              <p className="text-gray-400 mb-2">
                <a href="mailto:contacto@necesitomasreviews.com" className="hover:text-white transition">
                  contacto@necesitomasreviews.com
                </a>
              </p>
              <p className="text-gray-400">Tenemos oficinas en Chile, México y Austin, Texas.</p>

              <h4 className="text-lg font-semibold mt-6 mb-4">Métodos de Pago</h4>
              <div className="flex space-x-4">
                <span className="text-gray-400">PayPal</span>
                <span className="text-gray-400">Mercado Pago</span>
                <span className="text-gray-400">WebPay Plus</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} NecesitoMasReviews. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Mantenemos también la exportación por defecto
export default MainLayout;