import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaCreditCard,
  FaShoppingBag,
  FaUserAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaTicketAlt,
  FaCog,
  FaBell,
  FaQuestion
} from 'react-icons/fa';
import { AuthContext } from "../../context/AuthContext";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active = false, onClick }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-colors duration-200 ${
        active 
          ? 'bg-blue-600 text-white font-medium' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
      onClick={onClick}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </Link>
  );
};

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-600 lg:hidden focus:outline-none"
                  onClick={toggleSidebar}
                >
                  <FaBars className="h-5 w-5" />
                </button>
                <Link to="/" className="text-2xl font-bold">
  <span className="text-google-blue">Necesito</span>
  <span className="text-google-red">Mas</span>
  <span className="text-google-yellow">Reviews</span>
  <span className="text-google-green">.com</span>
</Link>
              </div>
            </div>

            <div className="flex items-center">
              {/* Notifications */}
              <div className="relative ml-3">
                <button
                  type="button"
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                  onClick={toggleNotifications}
                >
                  <FaBell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                </button>

                {isNotificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Notificaciones</h3>
                        <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                          Marcar todas como leídas
                        </span>
                      </div>

                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="flex">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                            <FaBell className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">Nueva reseña recibida</p>
                            <p className="text-xs text-gray-500">Hace 2 horas</p>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                            <FaCreditCard className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">Tarjeta activada exitosamente</p>
                            <p className="text-xs text-gray-500">Ayer</p>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                            <FaShoppingBag className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">Tu pedido ha sido enviado</p>
                            <p className="text-xs text-gray-500">Hace 3 días</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                        <Link
                          to="/dashboard/notifications"
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => setIsNotificationsOpen(false)}
                        >
                          Ver todas las notificaciones
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Help */}
              <Link
                to="/help"
                className="ml-3 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                <FaQuestion className="h-5 w-5" />
              </Link>

              {/* User menu */}
              <div className="relative ml-3">
                <button
                  type="button"
                  className="flex items-center space-x-3 focus:outline-none"
                  onClick={toggleUserMenu}
                >
                  <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden md:flex md:items-center">
                    <span className="text-sm font-medium text-gray-700 mr-1">{user?.name || 'Usuario'}</span>
                    <FaChevronDown className="h-3 w-3 text-gray-400" />
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaUserAlt className="mr-3 h-4 w-4 text-gray-500" />
                        Mi perfil
                      </Link>

                      <Link
                        to="/dashboard/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaCog className="mr-3 h-4 w-4 text-gray-500" />
                        Configuración
                      </Link>

                      <button
                        type="button"
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-500" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar and Main Content */}
      <div className="pt-16 flex min-h-screen">
        {/* Mobile sidebar backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto lg:shadow-none ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto pt-20 pb-6 px-4 lg:pt-6">
            <div className="flex justify-between lg:hidden">
              <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={closeSidebar}
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 space-y-1">
              <SidebarItem
                to="/dashboard"
                icon={<FaTachometerAlt className="h-5 w-5" />}
                label="Dashboard"
                active={isActive('/dashboard')}
                onClick={closeSidebar}
              />

              <SidebarItem
                to="/dashboard/cards"
                icon={<FaCreditCard className="h-5 w-5" />}
                label="Mis Tarjetas"
                active={isActive('/dashboard/cards')}
                onClick={closeSidebar}
              />

              <SidebarItem
                to="/dashboard/orders"
                icon={<FaShoppingBag className="h-5 w-5" />}
                label="Mis Pedidos"
                active={isActive('/dashboard/orders')}
                onClick={closeSidebar}
              />

              {user?.role === 'PROMOTER' && (
                <SidebarItem
                  to="/dashboard/promoter"
                  icon={<FaTicketAlt className="h-5 w-5" />}
                  label="Códigos de Descuento"
                  active={isActive('/dashboard/promoter')}
                  onClick={closeSidebar}
                />
              )}

              <SidebarItem
                to="/dashboard/profile"
                icon={<FaUserAlt className="h-5 w-5" />}
                label="Mi Perfil"
                active={isActive('/dashboard/profile')}
                onClick={closeSidebar}
              />
            </nav>

            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2">¿Necesitas más tarjetas?</h3>
                <p className="text-sm text-blue-600 mb-3">
                  Amplía tu colección de tarjetas NFC para obtener más reseñas.
                </p>
                <Link
                  to="/checkout"
                  className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  onClick={closeSidebar}
                >
                  Comprar más tarjetas
                </Link>
              </div>

              <div className="mt-6">
                <Link
                  to="/help"
                  className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900"
                  onClick={closeSidebar}
                >
                  <FaQuestion className="h-5 w-5 mr-3" />
                  <span>Centro de ayuda</span>
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden p-4 sm:p-6">
          <main className="max-w-7xl mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;