
import { useMemo } from 'react'
import StatCard from '../components/StatCard'
import LeadsTable from '../components/LeadsTable'

import {
  Target,
  Flame,
  Headset,
} from 'lucide-react'

function OpportunitiesPage({ leads = [], loading = false }) {
  // Filtra e ordena as oportunidades pelo score preditivo
  const oportunidades = useMemo(() => {
    return leads
      .filter((lead) => {
        const classificacao = lead.classificacao_lead?.toLowerCase()

        return (
          classificacao === 'quente' ||
          classificacao === 'muito quente'
        )
      })
      .sort((a, b) => (b.lead_score || 0) - (a.lead_score || 0))
  }, [leads])

  // Leads que precisam de intervenção humana
  const precisamDeAtendimento = oportunidades.filter(
    (lead) => lead.precisa_de_humano === true
  )

  // Maior score preditivo encontrado
  const maiorScore =
    oportunidades.length > 0
      ? oportunidades[0].lead_score ?? 0
      : 0

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-7">

      {/* Page Title & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.05] pb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Oportunidades
            </h1>

            <div className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300">
              <Target size={12} />
              <span>Pipeline Comercial</span>
            </div>
          </div>

          <p className="mt-1.5 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Identificação e priorização de leads com maior potencial de
            conversão, orientando as próximas ações comerciais.
          </p>
        </div>

        <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs font-medium text-slate-300 shrink-0">
          {oportunidades.length} oportunidades
        </span>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Oportunidades Ativas"
          value={loading ? '...' : oportunidades.length}
          description="Leads classificados como quentes"
          icon={Target}
          comparisonLabel="Base ativa"
        />

        <StatCard
          title="Maior Score Preditivo"
          value={loading ? '...' : maiorScore}
          description="Lead com maior propensão de conversão"
          icon={Flame}
          trend="Alta intenção"
          trendPositive={true}
          highlight={true}
          comparisonLabel="/100"
        />

        <StatCard
          title="Intervenção Humana"
          value={loading ? '...' : precisamDeAtendimento.length}
          description="Leads que requerem contato da equipe"
          icon={Headset}
          comparisonLabel="Ação necessária"
        />

      </div>

      {/* Pipeline Prioritário de Vendas - Reutiliza LeadsTable */}
      <LeadsTable
        leads={oportunidades}
        loading={loading}
        title="Pipeline Prioritário de Vendas"
        subtitle="Oportunidades comerciais de maior potencial, ordenadas pelo score preditivo de IA."
        hideInternalSearch={true}
      />

    </div>
  )
}

export default OpportunitiesPage
