import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  X,
  Target,
  ArrowRight,
  Flame,
  LayoutDashboard,
  Users,
  BrainCircuit,
  ChartNoAxesCombined,
  Command,
} from 'lucide-react'

function CommandPalette({ isOpen, onClose, leads = [] }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  // Filtra leads pelo termo digitado
  const leadsFiltrados = query.trim()
    ? leads
        .filter((lead) => {
          const termo = query.toLowerCase()
          return (
            String(lead.id).includes(termo) ||
            lead.categoria?.toLowerCase().includes(termo) ||
            lead.mensagem?.toLowerCase().includes(termo) ||
            lead.classificacao_lead?.toLowerCase().includes(termo) ||
            lead.necessidade?.toLowerCase().includes(termo)
          )
        })
        .slice(0, 5)
    : []

  const quickLinks = [
    { label: 'Ir para Visão Geral', icon: LayoutDashboard, path: '/' },
    { label: 'Ir para Leads', icon: Users, path: '/leads' },
    { label: 'Ir para Inteligência Comercial', icon: BrainCircuit, path: '/inteligencia' },
    { label: 'Ir para Desempenho', icon: ChartNoAxesCombined, path: '/desempenho' },
    { label: 'Ir para Oportunidades Quentes', icon: Target, path: '/oportunidades' },
  ].filter((item) =>
    query.trim()
      ? item.label.toLowerCase().includes(query.toLowerCase())
      : true
  )

  const handleSelectLink = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md p-4 pt-20 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0E121B] shadow-2xl shadow-black ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3.5">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por lead #ID, demanda, necessidade, navegação..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          ) : (
            <kbd className="flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-4">
          {/* Leads Encontrados */}
          {leadsFiltrados.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Leads Correspondentes
              </p>
              <div className="mt-1 space-y-1">
                {leadsFiltrados.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => handleSelectLink('/leads')}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-white/[0.06] group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-semibold text-slate-300 group-hover:border-rose-500/30 group-hover:text-rose-400">
                        #{lead.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">Lead #{lead.id}</span>
                          <span className="text-slate-400">({lead.categoria || 'Geral'})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {lead.necessidade || lead.mensagem || 'Sem detalhes'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-400 tabular-nums">
                        {lead.lead_score ?? '—'} pts
                      </span>
                      <ArrowRight size={13} className="text-slate-500 group-hover:text-white" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navegação Rápida */}
          {quickLinks.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Ações & Navegação
              </p>
              <div className="mt-1 space-y-1">
                {quickLinks.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleSelectLink(item.path)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className="text-slate-400 group-hover:text-rose-400" />
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight size={13} className="text-slate-500 group-hover:text-white" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {query.trim() && leadsFiltrados.length === 0 && quickLinks.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              Nenhum resultado correspondente a &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.01] px-4 py-2 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            Navegue com <Command size={11} /> K ou clique
          </span>
          <span>Pressione ESC para fechar</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette

