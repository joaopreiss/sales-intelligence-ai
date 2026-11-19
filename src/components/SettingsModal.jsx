import { useState } from 'react'
import {
  X,
  Sliders,
  Bell,
  Database,
  Webhook,
  Sparkles,
  Check,
  ShieldCheck,
} from 'lucide-react'

function SettingsModal({ isOpen, onClose }) {
  const [minScoreAlert, setMinScoreAlert] = useState(70)
  const [notifyHumanNeeded, setNotifyHumanNeeded] = useState(true)
  const [saved, setSaved] = useState(false)

  if (!isOpen) return null

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 800)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/[0.1] bg-[#0E121B] shadow-2xl shadow-black ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] bg-gradient-to-r from-rose-500/[0.05] via-transparent to-transparent p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <Sliders size={18} />
            </div>
            <div>
              <h2 id="settings-title" className="text-base font-bold text-white tracking-tight">
                Configurações da Plataforma
              </h2>
              <p className="text-xs text-slate-400">
                Ajuste os parâmetros de alertas, notificações e integrações.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Seção 1: Filtros de Alerta & Notificações */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-rose-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Gatilhos de Notificação
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Alerta de Lead Quente (Score mínimo)</span>
                  <span className="font-bold text-rose-400 tabular-nums">≥ {minScoreAlert} pts</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="90"
                  step="5"
                  value={minScoreAlert}
                  onChange={(e) => setMinScoreAlert(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                />
              </div>

              <label className="flex items-center justify-between cursor-pointer rounded-xl border border-white/[0.04] bg-[#07090E] p-3 transition-colors hover:border-white/10">
                <div>
                  <p className="text-xs font-medium text-slate-200">
                    Avisar quando precisar de humano
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Gera notificação prioritária no sino de alertas
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyHumanNeeded}
                  onChange={(e) => setNotifyHumanNeeded(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/10 accent-rose-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Seção 2: Conexões e Endpoints Ativos */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Status das Conexões Ativas
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-[#07090E] p-2.5">
                <span className="flex items-center gap-2 text-slate-300">
                  <Database size={14} className="text-emerald-400" />
                  Supabase PostgreSQL & Realtime
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Conectado
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-[#07090E] p-2.5">
                <span className="flex items-center gap-2 text-slate-300">
                  <Webhook size={14} className="text-rose-400" />
                  n8n Workflow Automation
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Webhook Ativo
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-[#07090E] p-2.5">
                <span className="flex items-center gap-2 text-slate-300">
                  <Sparkles size={14} className="text-purple-400" />
                  Google Gemini AI Engine
                </span>
                <span className="text-[11px] font-medium text-emerald-400">
                  API Pronta
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.01] p-5">
          <span className="text-[11px] text-slate-500 font-mono">
            v2.4.0-enterprise
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-950/50 transition-all hover:bg-rose-600"
            >
              {saved ? (
                <>
                  <Check size={14} />
                  Salvo!
                </>
              ) : (
                'Salvar Preferências'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
