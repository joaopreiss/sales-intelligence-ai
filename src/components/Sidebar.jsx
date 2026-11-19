import {
  LayoutDashboard,
  Users,
  ChartNoAxesCombined,
  Target,
  Settings,
  BrainCircuit,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import BrandLogo from './BrandLogo'

const menuItems = [
  { label: 'Visão geral', icon: LayoutDashboard, path: '/' },
  { label: 'Leads', icon: Users, path: '/leads' },
  { label: 'Inteligência comercial', icon: BrainCircuit, path: '/inteligencia' },
  { label: 'Desempenho', icon: ChartNoAxesCombined, path: '/desempenho' },
  { label: 'Oportunidades', icon: Target, path: '/oportunidades' },
]

function Sidebar({ onOpenSettings }) {
  return (
    <aside className="sticky top-0 flex h-screen min-h-screen w-64 shrink-0 flex-col border-r border-white/[0.06] bg-[#0A0D14]/80 backdrop-blur-xl p-4 text-white">
      {/* Brand Identity / Minimalist SaaS Logo */}
      <div className="mb-8 flex items-center gap-3 px-2 pt-2">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg shadow-rose-950/50 ring-1 ring-white/20">
          <BrandLogo size={20} className="text-white drop-shadow" />
        </div>

        <div>
          <h1 className="text-sm font-semibold tracking-tight text-white">
            Sales Intelligence
          </h1>
        </div>
      </div>

      {/* Navegação Principal */}
      <div className="px-2 mb-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
          Plataforma
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-white/[0.07] text-white shadow-sm ring-1 ring-white/[0.08]'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator Bar Lateral */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]" />
                  )}
                  <Icon
                    size={17}
                    className={`transition-colors ${
                      isActive
                        ? 'text-rose-400'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Rodapé / Status & Botão de Configurações */}
      <div className="mt-auto border-t border-white/[0.06] pt-4">
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <Settings size={17} />
          <span>Configurações</span>
        </button>

        <div className="mt-3 rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <p className="text-[11px] font-medium text-slate-300">
              Supabase Realtime
            </p>
          </div>
          <p className="mt-1 text-[10px] text-slate-500 leading-tight">
            Pipeline de inteligência ativo e sincronizado
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
