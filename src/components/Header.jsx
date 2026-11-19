import { useState, useRef, useEffect } from 'react'
import {
  Search,
  Bell,
  Sparkles,
  Command,
  CheckCircle2,
  AlertCircle,
  Flame,
  User,
  Shield,
  Mail,
  Building,
  Check,
} from 'lucide-react'

function Header({ leads = [], onOpenSearch }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [notificationsRead, setNotificationsRead] = useState(false)

  const notifRef = useRef(null)
  const profileRef = useRef(null)

  // Fecha dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Gera eventos contextuais baseados nos dados reais de leads
  const leadsQuentes = leads.filter(
    (l) => l.classificacao_lead?.toLowerCase() === 'muito quente'
  )
  const precisamHumano = leads.filter((l) => l.precisa_de_humano === true)

  const notificationsList = [
    {
      id: 'hot',
      icon: Flame,
      iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      title: `${leadsQuentes.length} Lead(s) com alta propensão de fechamento`,
      time: 'Recente',
      desc: 'Classificados como "Muito Quente" pelo motor Gemini.',
    },
    {
      id: 'human',
      icon: AlertCircle,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: `${precisamHumano.length} Intervenções humanas requeridas`,
      time: 'Ação necessária',
      desc: 'A IA identificou solicitações complexas que necessitam de atendente.',
    },
    {
      id: 'sync',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: 'Supabase Realtime ativo',
      time: 'Agora',
      desc: 'Escuta ativa conectada à tabela "leads" e "insights_leads".',
    },
  ]

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#080A0F]/80 backdrop-blur-xl px-8">
      {/* Left Area: Modern Command Search Bar */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onOpenSearch}
          className="relative flex items-center"
        >
          <div className="flex h-9 w-72 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 text-xs text-slate-400 transition-all hover:border-white/15 hover:bg-white/[0.05]">
            <Search size={14} className="text-slate-500" />
            <span className="text-slate-400">Buscar leads, dados...</span>
          </div>
        </button>
      </div>

      {/* Right Controls: Notifications & User */}
      <div className="flex items-center gap-4">

        {/* Notifications Dropdown Container */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfile(false)
            }}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
              showNotifications
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-white/[0.07] bg-white/[0.03] text-slate-400 hover:border-white/15 hover:bg-white/[0.06] hover:text-white'
            }`}
          >
            <Bell size={16} />
            {!notificationsRead && (
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/[0.08] bg-[#0E121B] shadow-2xl shadow-black ring-1 ring-white/10 p-4 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-white">Notificações</h4>
                  {!notificationsRead && (
                    <span className="rounded-full bg-rose-500/20 px-1.5 py-0.2 text-[10px] font-bold text-rose-400">
                      3 novas
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsRead(true)}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Marcar como lidas
                </button>
              </div>

              <div className="space-y-2.5">
                {notificationsList.map((notif) => {
                  const Icon = notif.icon
                  return (
                    <div
                      key={notif.id}
                      className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5 transition-colors hover:border-white/10"
                    >
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${notif.iconColor}`}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-500 shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {notif.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-white/[0.08]" />

        {/* User Profile Container (Apenas Informações da Conta) */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfile(!showProfile)
              setShowNotifications(false)
            }}
            className={`flex items-center gap-3 rounded-xl border py-1 px-2.5 transition-all ${
              showProfile
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
          >
            <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#D80040] text-xs font-semibold text-rose-300 ring-1 ring-rose-500/30">
              JP
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-medium text-slate-200 leading-none">
                João Pedro
              </p>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                Administrador
              </p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/[0.08] bg-[#0E121B] shadow-2xl shadow-black ring-1 ring-white/10 p-4 z-50 animate-in fade-in duration-150">
              <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3 mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-sm font-bold text-white ring-1 ring-white/20 shadow-md">
                  JP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">João Pedro</h4>
                  <p className="text-[11px] text-slate-400">jpreis.dev@gmail.com</p>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.2 text-[9px] font-semibold text-emerald-400">
                    <Check size={9} />
                    Conta Verificada
                  </span>
                </div>
              </div>

              {/* Informações da Conta */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
                  <span className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <Shield size={13} className="text-rose-400" />
                    Nível de Acesso
                  </span>
                  <span className="font-semibold text-slate-200 text-[11px]">
                    Administrador Master
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
                  <span className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <Building size={13} className="text-slate-400" />
                    Organização
                  </span>
                  <span className="font-semibold text-slate-200 text-[11px]">
                    Sales Intelligence AI
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
                  <span className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <Sparkles size={13} className="text-purple-400" />
                    Plano Ativo
                  </span>
                  <span className="font-semibold text-rose-300 text-[11px]">
                    Enterprise AI Tier
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
