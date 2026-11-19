import { useState } from 'react'
import {
  X,
  Eye,
  MessageSquare,
  UserRound,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Clock,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'

function LeadsTable({
  leads = [],
  loading = false,
  title = 'Leads Recentes',
  subtitle = 'Pipeline enriquecido em tempo real com qualificação e scoring preditivo de IA.',
  hideInternalSearch = false,
}) {
  const [leadSelecionado, setLeadSelecionado] = useState(null)
  const [buscaTabela, setBuscaTabela] = useState('')

  function formatarClassificacao(classificacao) {
    if (!classificacao) return 'Não classificado'
    return classificacao.replace(/\b\w/g, (letra) => letra.toUpperCase())
  }

  function formatarCategoria(categoria) {
    const categorias = {
      automacao: 'Automação',
      software: 'Software',
      consultoria: 'Consultoria',
      outro: 'Outro',
    }
    return categorias[categoria?.toLowerCase()] || categoria || 'Não informado'
  }

  function formatarPrioridade(prioridade) {
    if (!prioridade) return 'Normal'
    return prioridade.charAt(0).toUpperCase() + prioridade.slice(1)
  }

  function formatarData(data) {
    if (!data) return 'Data n/d'
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Estilização sofisticada de Badges de Temperatura com Glow
  const getBadgeStyle = (classificacao = '') => {
    switch (classificacao.toLowerCase()) {
      case 'muito quente':
        return 'border-rose-500/40 bg-rose-500/15 text-rose-300 shadow-[0_0_14px_rgba(244,63,94,0.22)] ring-1 ring-rose-500/25'
      case 'quente':
        return 'border-amber-500/40 bg-amber-500/15 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.18)] ring-1 ring-amber-500/25'
      case 'morno':
        return 'border-yellow-500/35 bg-yellow-500/10 text-yellow-300 ring-1 ring-yellow-500/20'
      case 'frio':
      default:
        return 'border-white/10 bg-white/[0.04] text-slate-400 ring-1 ring-white/5'
    }
  }

  // Estilização para Tags de Prioridade
  const getPriorityStyle = (prioridade = '') => {
    switch (prioridade.toLowerCase()) {
      case 'alta':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
      case 'media':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/20'
      case 'baixa':
      default:
        return 'text-slate-400 bg-white/[0.03] border-white/[0.06]'
    }
  }

  // Filtragem local rápida caso o usuário busque na tabela
  const leadsExibidos =
    !hideInternalSearch && buscaTabela.trim()
      ? leads.filter((l) => {
          const termo = buscaTabela.toLowerCase()
          return (
            String(l.id).includes(termo) ||
            l.categoria?.toLowerCase().includes(termo) ||
            l.necessidade?.toLowerCase().includes(termo) ||
            l.mensagem?.toLowerCase().includes(termo) ||
            l.classificacao_lead?.toLowerCase().includes(termo) ||
            l.prioridade?.toLowerCase().includes(termo)
          )
        })
      : leads

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#111622]/95 via-[#0e131d]/95 to-[#090c12] shadow-xl backdrop-blur-xl">
        {/* Table Top Header */}
        <div className="flex flex-col gap-3 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-white tracking-tight">
                {title}
              </h3>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-mono font-medium text-slate-300">
                {leads.length} registros
              </span>
            </div>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>

          {/* Quick Table Search */}
          {!hideInternalSearch && (
            <div className="relative flex items-center">
              <Search
                size={14}
                className="absolute left-3 text-slate-500 pointer-events-none"
              />
              <input
                type="text"
                value={buscaTabela}
                onChange={(e) => setBuscaTabela(e.target.value)}
                placeholder="Filtrar nesta lista..."
                className="h-8.5 w-full sm:w-56 rounded-xl border border-white/[0.08] bg-white/[0.02] pl-8.5 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/30 transition-all"
              />
              {buscaTabela && (
                <button
                  type="button"
                  onClick={() => setBuscaTabela('')}
                  className="absolute right-2.5 text-slate-400 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] bg-white/[0.02]">
              <tr className="font-semibold uppercase tracking-wider text-slate-400 text-[10px]">
                <th className="px-6 py-3.5">Lead / Contato</th>
                <th className="px-6 py-3.5">Categoria</th>
                <th className="px-6 py-3.5">Necessidade Identificada</th>
                <th className="px-6 py-3.5">Prioridade</th>
                <th className="px-6 py-3.5">Score Preditivo</th>
                <th className="px-6 py-3.5">Temperatura</th>
                <th className="px-6 py-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-14 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2.5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                      </span>
                      <span className="font-medium text-slate-300">
                        Sincronizando pipeline comercial...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : leadsExibidos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-14 text-center text-slate-400">
                    {buscaTabela
                      ? `Nenhum lead encontrado para "${buscaTabela}".`
                      : 'Nenhum lead registrado no momento.'}
                  </td>
                </tr>
              ) : (
                leadsExibidos.map((lead) => {
                  const isMuitoQuente =
                    lead.classificacao_lead?.toLowerCase() === 'muito quente'

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setLeadSelecionado(lead)}
                      className={`group cursor-pointer transition-all duration-150 hover:bg-white/[0.04] ${
                        isMuitoQuente ? 'bg-rose-500/[0.025]' : ''
                      }`}
                    >
                      {/* Coluna 1: Lead ID & Timestamp */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-mono text-xs font-bold text-slate-200 group-hover:border-rose-500/40 group-hover:bg-rose-500/10 group-hover:text-rose-300 transition-colors">
                            #{lead.id}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-100 group-hover:text-white transition-colors">
                              Lead #{lead.id}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                              <Clock size={10} />
                              <span>{formatarData(lead.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Coluna 2: Categoria */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-slate-300 font-medium">
                          {formatarCategoria(lead.categoria)}
                        </span>
                      </td>

                      {/* Coluna 3: Necessidade Resumida */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className="truncate text-xs text-slate-300 font-normal">
                          {lead.necessidade || lead.mensagem || (
                            <span className="text-slate-600 italic">Não informada</span>
                          )}
                        </p>
                      </td>

                      {/* Coluna 4: Prioridade & Requer Humano */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getPriorityStyle(
                              lead.prioridade
                            )}`}
                          >
                            {formatarPrioridade(lead.prioridade)}
                          </span>

                          {lead.precisa_de_humano && (
                            <p className="text-[10px] font-medium text-amber-400/95 flex items-center gap-1">
                              <AlertCircle size={10} className="shrink-0" />
                              Requer humano
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Coluna 5: Score Preditivo & Barra */}
                      <td className="px-6 py-4 font-semibold tabular-nums text-white">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 text-sm font-bold">
                            {lead.lead_score ?? '—'}
                          </span>
                          {typeof lead.lead_score === 'number' && (
                            <div className="w-16 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  lead.lead_score >= 70
                                    ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                                    : lead.lead_score >= 40
                                    ? 'bg-amber-400'
                                    : 'bg-slate-500'
                                }`}
                                style={{ width: `${Math.min(lead.lead_score, 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Coluna 6: Temperatura */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getBadgeStyle(
                            lead.classificacao_lead
                          )}`}
                        >
                          {isMuitoQuente && (
                            <Flame size={12} className="text-rose-400" />
                          )}
                          {formatarClassificacao(lead.classificacao_lead)}
                        </span>
                      </td>

                      {/* Coluna 7: Ação */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            setLeadSelecionado(lead)
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                        >
                          <Eye size={13} />
                          <span>Inspecionar</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Sheet de Detalhes do Lead (Glassmorphism Dark) */}
      {leadSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setLeadSelecionado(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/[0.1] bg-[#0E121B] shadow-2xl shadow-black ring-1 ring-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative flex items-start justify-between border-b border-white/[0.07] bg-gradient-to-r from-rose-500/[0.08] via-transparent to-transparent p-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-medium text-rose-300">
                    <Sparkles size={11} />
                    Análise Preditiva
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID #{leadSelecionado.id}
                  </span>
                </div>
                <h2
                  id="lead-detail-title"
                  className="mt-2 text-xl font-bold tracking-tight text-white"
                >
                  Diagnóstico de Inteligência Comercial
                </h2>
              </div>
              <button
                type="button"
                aria-label="Fechar detalhes"
                onClick={() => setLeadSelecionado(null)}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5 p-6">
              {/* Highlight Metrics */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-[11px] font-medium text-slate-400">
                    Score de Conversão
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white tabular-nums">
                    {leadSelecionado.lead_score ?? '—'}
                    <span className="text-xs font-normal text-slate-500">
                      {' '}
                      / 100
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-[11px] font-medium text-slate-400">
                    Prioridade
                  </p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {formatarPrioridade(leadSelecionado.prioridade)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-[11px] font-medium text-slate-400">
                    Temperatura
                  </p>
                  <p className="mt-1 text-base font-semibold text-rose-400">
                    {formatarClassificacao(leadSelecionado.classificacao_lead)}
                  </p>
                </div>
              </div>

              {/* Mensagem Original */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <MessageSquare size={15} className="text-rose-400" />
                  Mensagem Original Capturada
                </h3>
                <p className="whitespace-pre-wrap rounded-xl border border-white/[0.04] bg-[#07090E] p-3 text-xs leading-relaxed text-slate-300 font-mono">
                  {leadSelecionado.mensagem || 'Nenhuma mensagem registrada.'}
                </p>
              </div>

              {/* Necessidade Identificada */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <UserRound size={15} className="text-rose-400" />
                  Necessidade & Contexto do Lead
                </h3>
                <p className="rounded-xl border border-white/[0.04] bg-[#07090E] p-3 text-xs leading-relaxed text-slate-300">
                  {leadSelecionado.necessidade || 'Não informada.'}
                </p>
              </div>

              {/* Próximo Passo Recomendado pela IA */}
              <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-500/[0.08] to-transparent p-4">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold text-rose-300">
                  <ArrowRight size={15} className="text-rose-400" />
                  Próxima Ação Recomendada pela IA
                </h3>
                <p className="rounded-xl border border-rose-500/20 bg-[#07090E]/80 p-3 text-xs leading-relaxed text-slate-200">
                  {leadSelecionado.proximo_passo ||
                    'Nenhum próximo passo registrado.'}
                </p>
              </div>

              {/* Requisito de Atendimento Humano */}
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div>
                  <p className="text-xs font-semibold text-white">
                    Intervenção Humana
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Indica se a IA solicita escalação imediata para um consultor.
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                    leadSelecionado.precisa_de_humano
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {leadSelecionado.precisa_de_humano ? (
                    <>
                      <AlertCircle size={12} />
                      Ação Necessária
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={12} />
                      Totalmente Automatizado
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.01] p-5">
              <span className="text-[11px] text-slate-500">
                Categoria: {formatarCategoria(leadSelecionado.categoria)}
                {leadSelecionado.created_at && (
                  <>
                    {' '}
                    · {new Date(leadSelecionado.created_at).toLocaleString('pt-BR')}
                  </>
                )}
              </span>

              <button
                type="button"
                onClick={() => setLeadSelecionado(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition-all hover:border-white/20 hover:bg-white/10"
              >
                Concluir Visualização
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default LeadsTable
