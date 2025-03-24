// src/components/layouts/AdminLayout.tsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaCreditCard,
  FaShoppingBag,
  FaGlobe,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaBell
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

const AdminLayout = () => {
  const { user, logout, isSuperAdmin } = useContext(AuthContext);
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
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    if (path === '/regional-admin' && location.pathname === '/regional-admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin' && path !== '/regional-admin';
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Determinar la ruta base basado en el rol del usuario
  const basePath = isSuperAdmin ? '/admin' : '/regional-admin';

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
              {/* Notificaciones */}
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
                            <FaUsers className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">Nuevo usuario registrado</p>
                            <p className="text-xs text-gray-500">Hace 1 hora</p>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                            <FaShoppingBag className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">Nueva orden recibida</p>
                            <p className="text-xs text-gray-500">Hace 3 horas</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                        <Link
                          to={`${basePath}/notifications`}
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

              {/* Menu de usuario */}
              <div className="relative ml-3">
                <button
                  type="button"
                  className="flex items-center space-x-3 focus:outline-none"
                  onClick={toggleUserMenu}
                >
                  <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="hidden md:flex md:items-center">
                    <span className="text-sm font-medium text-gray-700 mr-1">{user?.name || 'Admin'}</span>
                    <FaChevronDown className="h-3 w-3 text-gray-400" />
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to={`${basePath}/profile`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaUsers className="mr-3 h-4 w-4 text-gray-500" />
                        Mi perfil
                      </Link>

                      <Link
                        to={`${basePath}/settings`}
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
                to={basePath}
                icon={<FaTachometerAlt className="h-5 w-5" />}
                label="Dashboard"
                active={isActive(basePath)}
                onClick={closeSidebar}
              />

              <SidebarItem
                to={`${basePath}/users`}
                icon={<FaUsers className="h-5 w-5" />}
                label="Usuarios"
                active={isActive(`${basePath}/users`)}
                onClick={closeSidebar}
              />

              {isSuperAdmin && (
                <SidebarItem
                  to={`${basePath}/regions`}
                  icon={<FaGlobe className="h-5 w-5" />}
                  label="Regiones"
                  active={isActive(`${basePath}/regions`)}
                  onClick={closeSidebar}
                />
              )}

              <SidebarItem
                to={`${basePath}/cards`}
                icon={<FaCreditCard className="h-5 w-5" />}
                label="Tarjetas"
                active={isActive(`${basePath}/cards`)}
                onClick={closeSidebar}
              />

              <SidebarItem
                to={`${basePath}/orders`}
                icon={<FaShoppingBag className="h-5 w-5" />}
                label="Órdenes"
                active={isActive(`${basePath}/orders`)}
                onClick={closeSidebar}
              />

              <SidebarItem
                to={`${basePath}/settings`}
                icon={<FaCog className="h-5 w-5" />}
                label="Configuración"
                active={isActive(`${basePath}/settings`)}
                onClick={closeSidebar}
              />
            </nav>

            <div className="mt-10 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900"
              >
                <FaSignOutAlt className="h-5 w-5 mr-3" />
                <span>Cerrar sesión</span>
              </button>
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

export default AdminLayout;