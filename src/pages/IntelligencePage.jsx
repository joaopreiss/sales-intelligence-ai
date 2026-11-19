import { useState, useMemo } from 'react'
import {
  BrainCircuit,
  TrendingUp,
  Target,
  Flame,
  Lightbulb,
  LoaderCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Zap,
  BarChart2,
  X,
  Compass,
} from 'lucide-react'
import StatCard from '../components/StatCard'

function IntelligencePage({
  leads = [],
  loading = false,
  insights = [],
  loadingInsights = false,
}) {
  const [busca, setBusca] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [apenasOportunidades, setApenasOportunidades] = useState(false)

  const totalLeads = leads.length

  // Categorias agregadas
  const categorias = useMemo(() => {
    return leads.reduce((acc, lead) => {
      const categoria = lead.categoria || 'Não informado'
      acc[categoria] = (acc[categoria] || 0) + 1
      return acc
    }, {})
  }, [leads])

// Normaliza as prioridades para evitar duplicidade por capitalização
const normalizarPrioridade = (valor) => {
  const prioridade = String(valor || 'não informada')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const prioridadesPadronizadas = {
    alta: 'alta',
    media: 'media',
    baixa: 'baixa',
    'nao informada': 'nao informada',
  }

  return prioridadesPadronizadas[prioridade] || prioridade
}

// Prioridades agregadas
const prioridades = useMemo(() => {
  return leads.reduce((acc, lead) => {
    const prioridade = normalizarPrioridade(lead.prioridade)

    acc[prioridade] = (acc[prioridade] || 0) + 1

    return acc
  }, {})
}, [leads])

  const leadsQuentes = useMemo(() => {
    return leads.filter((lead) =>
      ['quente', 'muito quente'].includes(
        lead.classificacao_lead?.toLowerCase()
      )
    ).length
  }, [leads])

  const percentualQuentes =
    totalLeads > 0 ? Math.round((leadsQuentes / totalLeads) * 100) : 0

  const categoriaPrincipal = useMemo(() => {
    const sorted = Object.entries(categorias).sort((a, b) => b[1] - a[1])
    return sorted.length > 0 ? sorted[0] : null
  }, [categorias])

  // Relaciona os insights aos respectivos leads e extrai metadados enriquecidos
  const insightsComLead = useMemo(() => {
    return insights.map((insight) => {
      const leadAssociado = leads.find(
        (lead) => String(lead.id) === String(insight.lead_id)
      )
      return {
        ...insight,
        lead: leadAssociado,
      }
    })
  }, [insights, leads])

  // Filtros aplicados no feed de inteligência
  const insightsFiltrados = useMemo(() => {
    let result = [...insightsComLead]

    if (busca.trim()) {
      const termo = busca.toLowerCase()
      result = result.filter((item) => {
        const idLead = String(item.lead_id || '')
        const ins = (item.insight || '').toLowerCase()
        const op = (item.oportunidade || '').toLowerCase()
        const ac = (item.acao_recomendada || '').toLowerCase()
        const cat = (item.lead?.categoria || '').toLowerCase()
        return (
          idLead.includes(termo) ||
          ins.includes(termo) ||
          op.includes(termo) ||
          ac.includes(termo) ||
          cat.includes(termo)
        )
      })
    }

    if (filtroCategoria !== 'todas') {
      result = result.filter(
        (item) => item.lead?.categoria?.toLowerCase() === filtroCategoria
      )
    }

    if (apenasOportunidades) {
      result = result.filter((item) => Boolean(item.oportunidade))
    }

    return result
  }, [insightsComLead, busca, filtroCategoria, apenasOportunidades])

  const formatarCategoria = (categoria) => {
    const nomes = {
      automacao: 'Automação',
      software: 'Software',
      consultoria: 'Consultoria',
      outro: 'Outro',
    }
    return nomes[categoria?.toLowerCase()] || categoria || 'Geral'
  }

const formatarPrioridade = (prioridade) => {
  const nomes = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa',
    'nao informada': 'Não informada',
  }

  const prioridadeNormalizada = normalizarPrioridade(prioridade)

  return nomes[prioridadeNormalizada] || prioridade
}

  const formatarData = (data) => {
    if (!data) return 'Data não disponível'
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const temFiltroAtivo =
    busca.trim() !== '' || filtroCategoria !== 'todas' || apenasOportunidades

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-7">
      {/* Header Principal da Página */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.05] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Inteligência Comercial
            </h1>
            <div className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300">
              <Sparkles size={11} className="text-rose-400" />
              <span>IA Cognitive Core</span>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Diagnósticos semânticos, mapeamento de dores e planos de ação táticos gerados por IA para impulsionar a conversão de vendas.
          </p>
        </div>

        {/* Status Cognitivo */}
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs text-slate-300 self-start sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
          </span>
          <span className="font-medium text-slate-200">
            {insights.length} análises processadas
          </span>
        </div>
      </div>

      {/* Indicadores Estratégicos com StatCard Refinado */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Base Analisada pela IA"
          value={loading ? '...' : totalLeads}
          description="Total de contatos avaliados semanticamente"
          icon={Target}
          comparisonLabel="Cobertura 100%"
        />

        <StatCard
          title="Leads com Alta Urgência"
          value={loading ? '...' : `${percentualQuentes}%`}
          description={`${leadsQuentes} contatos em estágio avançado de compra`}
          icon={Flame}
          trend="Prioritários"
          trendPositive={true}
          highlight={true}
          comparisonLabel="Ação Imediata"
        />

        <StatCard
          title="Demanda Predominante"
          value={
            loading
              ? '...'
              : categoriaPrincipal
              ? formatarCategoria(categoriaPrincipal[0])
              : 'Geral'
          }
          description={
            categoriaPrincipal
              ? `${categoriaPrincipal[1]} leads demandando esta solução`
              : 'Sem volume registrado'
          }
          icon={TrendingUp}
          trend="Maior Volume"
          trendPositive={true}
          comparisonLabel="Foco da Carteira"
        />
      </div>

      {/* Painel Estratégico: Distribuição por Demanda & Prioridade */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Distribuição por Categoria com Barra Visual Refinada */}
        <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#111622]/95 via-[#0e131d]/95 to-[#090c12] p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Demandas Comerciais Identificadas
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Segmentação dos leads pelas soluções procuradas.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                Ponderado
              </span>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-6">Carregando dados de demandas...</p>
            ) : Object.keys(categorias).length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Ainda não existem categorias mapeadas.
              </p>
            ) : (
              <div className="space-y-4 pt-1">
                {Object.entries(categorias).map(([cat, qtd]) => {
                  const perc = totalLeads > 0 ? (qtd / totalLeads) * 100 : 0
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">
                          {formatarCategoria(cat)}
                        </span>
                        <span className="text-white font-bold tabular-nums">
                          {qtd}{' '}
                          <span className="text-slate-500 font-normal">
                            ({Math.round(perc)}%)
                          </span>
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-500"
                          style={{ width: `${perc}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.04] text-[11px] text-slate-500 flex justify-between">
            <span>Classificação semântica em tempo real</span>
            <span className="text-slate-400 font-medium">
              {Object.keys(categorias).length} verticais
            </span>
          </div>
        </section>

        {/* Nível de Prioridade da Operação */}
        <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#111622]/95 via-[#0e131d]/95 to-[#090c12] p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Matriz de Prioridade do Funil
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Classificação da urgência e velocidade de resposta necessária.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                SLA
              </span>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-6">Carregando prioridades...</p>
            ) : Object.keys(prioridades).length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Ainda não existem prioridades computadas.
              </p>
            ) : (
              <div className="space-y-3 pt-1">
                {Object.entries(prioridades).map(([prio, qtd]) => {
                  const isAlta = prio.toLowerCase().includes('alta')
                  const isMedia = prio.toLowerCase().includes('med')
                  return (
                    <div
                      key={prio}
                      className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                        isAlta
                          ? 'border-rose-500/30 bg-rose-500/[0.04]'
                          : isMedia
                          ? 'border-amber-500/25 bg-amber-500/[0.03]'
                          : 'border-white/[0.06] bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isAlta
                              ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                              : isMedia
                              ? 'bg-amber-400'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className="text-xs font-semibold text-slate-200">
                          {formatarPrioridade(prio)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tabular-nums">
                          {qtd}
                        </span>
                        <span className="text-[11px] text-slate-500">leads</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.04] text-[11px] text-slate-500 flex justify-between">
            <span>Roteamento prioritário automático</span>
            <span className="text-slate-400 font-medium">Tempo real</span>
          </div>
        </section>
      </div>

      {/* Feed Principal de Diagnósticos da IA (Redesenhado) */}
      <section className="space-y-4">
        {/* Barra de Filtro do Feed */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Diagnósticos & Planos de Ação Comerciais</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-mono font-medium text-slate-300">
                {insightsFiltrados.length} disponíveis
              </span>
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Cada card detalha o problema identificado, a oportunidade aberta e a ação que o consultor deve tomar.
            </p>
          </div>

          {/* Mini Busca e Filtro de Insights */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar no feed de IA..."
                className="h-8.5 w-48 sm:w-60 rounded-xl border border-white/[0.08] bg-white/[0.02] pl-8.5 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/40"
              />
              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {temFiltroAtivo && (
              <button
                type="button"
                onClick={() => {
                  setBusca('')
                  setFiltroCategoria('todas')
                  setApenasOportunidades(false)
                }}
                className="h-8.5 flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20"
              >
                <X size={12} />
                <span>Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* Lista de Insights com Design Estruturado de 3 Pilares */}
        {loadingInsights ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0E121B] p-12 text-slate-400 text-xs">
            <LoaderCircle size={20} className="animate-spin text-rose-500" />
            <span>Processando diagnósticos do pipeline cognitivo...</span>
          </div>
        ) : insightsFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0E121B] p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-500">
              <BrainCircuit size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Nenhum diagnóstico correspondente</p>
              <p className="mt-1 text-xs text-slate-400 max-w-md leading-relaxed">
                {temFiltroAtivo
                  ? 'Tente ajustar ou limpar o termo de busca para visualizar os outros diagnósticos da IA.'
                  : 'Assim que novos leads forem processados no fluxo do n8n com o Gemini, as avaliações estruturadas aparecerão aqui.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {insightsFiltrados.map((item) => {
              const lead = item.lead
              const isMuitoQuente =
                lead?.classificacao_lead?.toLowerCase() === 'muito quente'

              return (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#111622]/95 via-[#0e131d]/95 to-[#090c12] p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/[0.16] hover:shadow-2xl space-y-5"
                >
                  {/* Top subtle highlight gradient */}
                  <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-rose-500/40 transition-colors" />

                  {/* Header do Card com Metadados do Lead */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.05] pb-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 font-mono text-xs font-bold text-white">
                        <span>Lead #{item.lead_id}</span>
                      </div>

                      {lead && (
                        <>
                          <span className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-xs text-slate-300 font-medium">
                            {formatarCategoria(lead.categoria)}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                              isMuitoQuente
                                ? 'border-rose-500/40 bg-rose-500/15 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                            }`}
                          >
                            {isMuitoQuente && <Flame size={12} />}
                            {lead.classificacao_lead || 'Qualificado'}
                          </span>

                          {lead.precisa_de_humano && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                              <AlertCircle size={10} />
                              Intervenção Requerida
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                      {lead && typeof lead.lead_score === 'number' && (
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span className="text-[11px] text-slate-500">Score:</span>
                          <strong className="text-white text-sm font-bold tabular-nums">
                            {lead.lead_score}/100
                          </strong>
                        </div>
                      )}
                      <span className="hidden sm:inline text-slate-700">•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatarData(item.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Corpo Estruturado do Diagnóstico: 3 Pilares Visuais */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Pilar 1: O que a IA identificou / Diagnóstico */}
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400">
                            <BrainCircuit size={13} />
                          </div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            Diagnóstico Semântico
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-300">
                          {item.insight || 'Nenhum detalhe informado pelo modelo.'}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500 pt-2 border-t border-white/[0.04]">
                        Análise de dor & contexto
                      </span>
                    </div>

                    {/* Pilar 2: Oportunidade Comercial */}
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.025] p-4 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
                            <Lightbulb size={13} />
                          </div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                            Oportunidade Comercial
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-200 font-medium">
                          {item.oportunidade || 'Nenhuma oportunidade mapeada.'}
                        </p>
                      </div>
                      <span className="text-[10px] text-amber-400/70 pt-2 border-t border-amber-500/10">
                        Potencial de fechamento
                      </span>
                    </div>

                    {/* Pilar 3: Ação Tática Recomendada (Call to Action para o Vendedor) */}
                    <div className="rounded-xl border border-rose-500/30 bg-gradient-to-br from-rose-500/[0.08] to-transparent p-4 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/20 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]">
                            <Target size={13} />
                          </div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                            Ação Tática Recomendada
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-white font-medium">
                          {item.acao_recomendada || 'Nenhuma ação específica registrada.'}
                        </p>
                      </div>
                      <span className="text-[10px] text-rose-300/80 pt-2 border-t border-rose-500/15 flex items-center gap-1 font-semibold">
                        <ArrowRight size={10} />
                        Diretiva comercial imediata
                      </span>
                    </div>
                  </div>

                  {/* Contexto Original do Lead (Mensagem capturada) */}
                  {lead?.mensagem && (
                    <div className="rounded-xl border border-white/[0.04] bg-[#07090E] p-3 text-xs">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
                        <Compass size={12} className="text-slate-500" />
                        <span>Mensagem Original do Contato:</span>
                      </div>
                      <p className="text-slate-300 text-xs italic font-mono leading-relaxed line-clamp-2">
                        &quot;{lead.mensagem}&quot;
                      </p>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default IntelligencePage
