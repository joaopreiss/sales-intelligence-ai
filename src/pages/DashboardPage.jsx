import { useState, useMemo, useRef, useEffect } from 'react'

import {
  Users,
  Flame,
  Headset,
  Target,
  Filter,
  Calendar,
  ChevronDown,
  Check,
  X,
} from 'lucide-react'

import StatCard from '../components/StatCard'
import LeadsTable from '../components/LeadsTable'
import SalesCharts from '../components/SalesCharts'

// Períodos disponíveis
const periodosDisponiveis = [
  { id: '7d', label: 'Últimos 7 dias', dias: 7 },
  { id: '30d', label: 'Últimos 30 dias', dias: 30 },
  { id: '90d', label: 'Últimos 90 dias', dias: 90 },
  { id: 'all', label: 'Todo o período', dias: null },
]

// Normalização de texto
const normalizarTexto = (valor) => {
  return String(valor ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// Conversão segura de score
const converterScore = (valor) => {
  if (valor === null || valor === undefined || valor === '') {
    return null
  }

  const score = Number(valor)

  return Number.isFinite(score) ? score : null
}

function DashboardPage({ leads = [], loading = false }) {
  // Estados dos filtros
  const [periodo, setPeriodo] = useState('30d')
  const [showPeriodoMenu, setShowPeriodoMenu] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [categoriaFilter, setCategoriaFilter] = useState('todas')
  const [apenasQuentes, setApenasQuentes] = useState(false)
  const [apenasHumano, setApenasHumano] = useState(false)

  const periodoRef = useRef(null)
  const filterRef = useRef(null)

  // Fecha menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        periodoRef.current &&
        !periodoRef.current.contains(event.target)
      ) {
        setShowPeriodoMenu(false)
      }

      if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setShowFilterMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Label do período atual
  const periodoAtualLabel =
    periodosDisponiveis.find((p) => p.id === periodo)?.label ||
    'Últimos 30 dias'

  // Categorias únicas normalizadas
  const categoriasDisponiveis = useMemo(() => {
    const categorias = new Set()

    leads.forEach((lead) => {
      if (lead.categoria) {
        categorias.add(normalizarTexto(lead.categoria))
      }
    })

    return Array.from(categorias).sort()
  }, [leads])

  // Filtragem combinada
  const leadsFiltrados = useMemo(() => {
    let result = [...leads]

    // 1. Filtro de período
    const configPeriodo = periodosDisponiveis.find(
      (p) => p.id === periodo
    )

    if (configPeriodo && configPeriodo.dias !== null) {
      const dataLimite = new Date()

      dataLimite.setDate(
        dataLimite.getDate() - configPeriodo.dias
      )

      result = result.filter((lead) => {
        if (!lead.created_at) return false

        const dataLead = new Date(lead.created_at)

        if (Number.isNaN(dataLead.getTime())) {
          return false
        }

        return dataLead >= dataLimite
      })
    }

    // 2. Filtro de categoria
    if (categoriaFilter !== 'todas') {
      result = result.filter(
        (lead) =>
          normalizarTexto(lead.categoria) === categoriaFilter
      )
    }

    // 3. Filtro de leads quentes
    if (apenasQuentes) {
      result = result.filter((lead) => {
        const classificacao = normalizarTexto(
          lead.classificacao_lead
        )

        return ['quente', 'muito quente'].includes(
          classificacao
        )
      })
    }

    // 4. Filtro de intervenção humana
    if (apenasHumano) {
      result = result.filter(
        (lead) => lead.precisa_de_humano === true
      )
    }

    return result
  }, [
    leads,
    periodo,
    categoriaFilter,
    apenasQuentes,
    apenasHumano,
  ])

  // Métricas principais
  const totalLeads = leadsFiltrados.length

  // Scores válidos
  const leadsComScore = leadsFiltrados
    .map((lead) => converterScore(lead.lead_score))
    .filter((score) => score !== null)

  // Score médio
  const scoreMedio =
    leadsComScore.length > 0
      ? Math.round(
          leadsComScore.reduce(
            (total, score) => total + score,
            0
          ) / leadsComScore.length
        )
      : 0

  // Leads muito quentes
  const leadsMuitoQuentes = leadsFiltrados.filter(
    (lead) =>
      normalizarTexto(lead.classificacao_lead) ===
      'muito quente'
  ).length

  const percentualQuentes =
    totalLeads > 0
      ? Math.round(
          (leadsMuitoQuentes / totalLeads) * 100
        )
      : 0

  // Atendimentos humanos
  const atendimentosHumanos = leadsFiltrados.filter(
    (lead) => lead.precisa_de_humano === true
  ).length

  const percentualHumano =
    totalLeads > 0
      ? Math.round(
          (atendimentosHumanos / totalLeads) * 100
        )
      : 0

  // Verificação de filtros ativos
  const temFiltroAtivo =
    categoriaFilter !== 'todas' ||
    apenasQuentes ||
    apenasHumano

  // Limpar filtros táticos
  const limparFiltros = () => {
    setCategoriaFilter('todas')
    setApenasQuentes(false)
    setApenasHumano(false)
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-7">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.05] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Command Center
            </h1>

            <div className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>

              <span>Live Engine</span>
            </div>
          </div>

          <p className="mt-1.5 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Painel consolidado de inteligência comercial,
            conversão e qualificação preditiva com IA.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Seletor de período */}
          <div className="relative" ref={periodoRef}>
            <button
              type="button"
              onClick={() => {
                setShowPeriodoMenu(!showPeriodoMenu)
                setShowFilterMenu(false)
              }}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs font-medium text-slate-200 transition-all hover:border-white/20 hover:bg-white/[0.05] shadow-sm"
            >
              <Calendar
                size={14}
                className="text-rose-400"
              />

              <span>{periodoAtualLabel}</span>

              <ChevronDown
                size={13}
                className="text-slate-400"
              />
            </button>

            {showPeriodoMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/[0.08] bg-[#0E121B] shadow-2xl shadow-black ring-1 ring-white/10 p-1.5 z-40 animate-in fade-in duration-150">
                <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Período de Análise
                </p>

                <div className="space-y-0.5">
                  {periodosDisponiveis.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPeriodo(p.id)
                        setShowPeriodoMenu(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-colors ${
                        periodo === p.id
                          ? 'bg-rose-500/10 font-semibold text-rose-300'
                          : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <span>{p.label}</span>

                      {periodo === p.id && (
                        <Check
                          size={13}
                          className="text-rose-400"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botão e menu de filtros */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => {
                setShowFilterMenu(!showFilterMenu)
                setShowPeriodoMenu(false)
              }}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all shadow-sm ${
                temFiltroAtivo
                  ? 'border-rose-500/50 bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/30'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-200 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Filter
                size={14}
                className={
                  temFiltroAtivo
                    ? 'text-rose-400'
                    : 'text-slate-400'
                }
              />

              <span>Filtrar</span>

              {temFiltroAtivo && (
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)]" />
              )}
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/[0.08] bg-[#0E121B] shadow-2xl shadow-black ring-1 ring-white/10 p-4 z-40 animate-in fade-in duration-150 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <span className="text-xs font-bold text-white">
                    Filtros Táticos
                  </span>

                  {temFiltroAtivo && (
                    <button
                      type="button"
                      onClick={limparFiltros}
                      className="text-[11px] text-rose-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <X size={11} /> Limpar
                    </button>
                  )}
                </div>

                {/* Filtro de categoria */}
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1.5">
                    Filtrar por Categoria
                  </label>

                  <select
                    value={categoriaFilter}
                    onChange={(e) =>
                      setCategoriaFilter(e.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#07090E] px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="todas">
                      Todas as categorias
                    </option>

                    {categoriasDisponiveis.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() +
                          cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Toggles rápidos */}
                <div className="space-y-2 pt-1 border-t border-white/[0.04]">
                  <label className="flex items-center justify-between cursor-pointer rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5 hover:border-white/10 transition-colors">
                    <span className="text-xs text-slate-300">
                      Apenas Leads Quentes
                    </span>

                    <input
                      type="checkbox"
                      checked={apenasQuentes}
                      onChange={(e) =>
                        setApenasQuentes(e.target.checked)
                      }
                      className="h-3.5 w-3.5 accent-rose-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5 hover:border-white/10 transition-colors">
                    <span className="text-xs text-slate-300">
                      Requerem Atendimento Humano
                    </span>

                    <input
                      type="checkbox"
                      checked={apenasHumano}
                      onChange={(e) =>
                        setApenasHumano(e.target.checked)
                      }
                      className="h-3.5 w-3.5 accent-rose-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Indicador de filtros ativos */}
      {temFiltroAtivo && (
        <div className="flex items-center gap-2 text-xs text-slate-300 bg-rose-500/[0.04] border border-rose-500/20 rounded-xl px-3.5 py-2">
          <span className="font-semibold text-rose-300">
            Filtros Ativos ({leadsFiltrados.length} leads):
          </span>

          {categoriaFilter !== 'todas' && (
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-slate-200 text-[11px] font-medium">
              {categoriaFilter}
            </span>
          )}

          {apenasQuentes && (
            <span className="rounded-md bg-rose-500/15 text-rose-300 px-2 py-0.5 text-[11px] font-medium">
              Quentes / Muito Quentes
            </span>
          )}

          {apenasHumano && (
            <span className="rounded-md bg-amber-500/15 text-amber-300 px-2 py-0.5 text-[11px] font-medium">
              Requer Humano
            </span>
          )}

          <button
            type="button"
            onClick={limparFiltros}
            className="text-slate-400 hover:text-white ml-auto transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Volume de Leads"
          value={loading ? '...' : totalLeads}
          description="Pipeline total captado no período"
          icon={Users}
          trendPositive={true}
          comparisonLabel="Base ativa"
        />

        <StatCard
          title="Score Médio Preditivo"
          value={loading ? '...' : scoreMedio}
          description="Qualificação ponderada por IA"
          icon={Target}
          trendPositive={true}
          aiTag="Análise Inteligente"
          comparisonLabel="Meta ≥ 65 pts"
        />

        <StatCard
          title="Leads Muito Quentes"
          value={loading ? '...' : leadsMuitoQuentes}
          description={`${percentualQuentes}% do volume com alta propensão`}
          icon={Flame}
          trend="Prioridade"
          trendPositive={true}
          aiTag="Conversão Alta"
          highlight={true}
          comparisonLabel="Ação imediata"
        />

        <StatCard
          title="Intervenção Humana"
          value={loading ? '...' : atendimentosHumanos}
          description={`${percentualHumano}% demandam consultoria humana`}
          icon={Headset}
          trend={
            atendimentosHumanos > 0
              ? 'Ação requerida'
              : 'Zero pendências'
          }
          trendPositive={atendimentosHumanos === 0}
          comparisonLabel={
            atendimentosHumanos > 0
              ? 'Fila ativa'
              : 'Fluxo 100% IA'
          }
        />
      </div>

      {/* Tabela de leads filtrados */}
      <LeadsTable
        leads={leadsFiltrados}
        loading={loading}
      />

      {/* Gráficos de vendas e desempenho */}
      <SalesCharts leads={leadsFiltrados} />
    </div>
  )
}

export default DashboardPage