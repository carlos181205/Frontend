"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, Settings, Users, Activity, Menu, X, Truck, BarChart3 } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Pedidos", href: "/orders", icon: ShoppingCart },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Proveedores", href: "/suppliers", icon: Truck },
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "Reportes", href: "/reports", icon: BarChart3 },
  { name: "Sistema", href: "/status", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-200"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 flex flex-col 
        bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl
        border-r border-gray-200/50 dark:border-white/10
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-16 flex items-center px-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight">
              OrderSystem
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  group flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-500/20" 
                    : "text-gray-600 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200 hover:translate-x-1 border border-transparent"}
                `}
              >
                <item.icon className={`
                  w-5 h-5 mr-3 transition-colors
                  ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 group-hover:text-gray-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"}
                `} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200/50 dark:border-white/10 mt-auto">
          <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200 transition-all border border-transparent">
            <Settings className="w-5 h-5 mr-3 text-gray-400 dark:text-zinc-500" />
            Configuración
          </button>
        </div>
      </aside>
    </>
  );
}
