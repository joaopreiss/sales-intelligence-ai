import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts'

import {
  TrendingUp,
  Users,
  Target,
  Award,
  Calendar,
} from 'lucide-react'

import StatCard from '../components/StatCard'

function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0c1017]/95 px-3 py-2 text-xs shadow-2xl backdrop-blur-xl">
        <p className="font-semibold text-white">{label}</p>

        <p className="mt-1 text-rose-400">
          Quantidade:{' '}
          <span className="font-bold tabular-nums">
            {payload[0].value}
          </span>{' '}
          leads
        </p>
      </div>
    )
  }

  return null
}

function PerformancePage({ leads = [], loading = false }) {
  // Agrupa os leads por dia nos últimos 7 dias
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const dadosDiarios = Array.from({ length: 7 }, (_, index) => {
    const data = new Date(hoje)
    data.setDate(hoje.getDate() - (6 - index))

    const quantidade = leads.filter((lead) => {
      if (!lead.created_at) return false

      const dataLead = new Date(lead.created_at)

      return (
        !Number.isNaN(dataLead.getTime()) &&
        dataLead.toDateString() === data.toDateString()
      )
    }).length

    return {
      dia: data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
      leads: quantidade,
    }
  })

  // Indicadores
  const totalLeads = leads.length

  const leadsComScore = leads.filter(
    (lead) => typeof lead.lead_score === 'number'
  )

  const scoreMedio =
    leadsComScore.length > 0
      ? Math.round(
          leadsComScore.reduce(
            (total, lead) => total + lead.lead_score,
            0
          ) / leadsComScore.length
        )
      : 0

  const leadsQuentes = leads.filter((lead) =>
    ['quente', 'muito quente'].includes(
      lead.classificacao_lead?.toLowerCase()
    )
  ).length

  const percentualQuentes =
    totalLeads > 0
      ? Math.round((leadsQuentes / totalLeads) * 100)
      : 0

  // Distribuição por temperatura
  const classificacoes = [
    { nome: 'Frio', chave: 'frio', fill: '#475569' },
    { nome: 'Morno', chave: 'morno', fill: '#f59e0b' },
    { nome: 'Quente', chave: 'quente', fill: '#fb923c' },
    { nome: 'Muito quente', chave: 'muito quente', fill: '#f43f5e' },
  ]

  const dadosClassificacao = classificacoes.map((item) => ({
    classificacao: item.nome,
    quantidade: leads.filter(
      (lead) =>
        lead.classificacao_lead?.toLowerCase() === item.chave
    ).length,
    fill: item.fill,
  }))

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-white/[0.05] pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Desempenho
            </h1>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold text-rose-400">
              <TrendingUp size={12} />
              Analytics
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Analise métricas e tendências da operação.
          </p>
        </div>

        <div className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0d1016] px-4 text-sm text-slate-300">
          <Calendar size={15} className="text-rose-400" />
          <span>Últimos 7 dias</span>
        </div>
      </div>

      {/* KPI Cards - Componente compartilhado */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Volume de Leads"
          value={loading ? '...' : totalLeads}
          description="Total de leads captados"
          icon={Users}
          comparisonLabel={null}
        />

        <StatCard
          title="Score Médio Preditivo"
          value={loading ? '...' : scoreMedio}
          description="Qualificação ponderada por IA"
          icon={Target}
          aiTag="Análise Inteligente"
          comparisonLabel={null}
        />

        <StatCard
          title="Leads com Alta Urgência"
          value={loading ? '...' : `${percentualQuentes}%`}
          description={`${leadsQuentes} leads no topo do funil`}
          icon={TrendingUp}
          highlight={true}
          comparisonLabel={null}
        />

        <StatCard
          title="Scores Preditivos"
          value={loading ? '...' : leadsComScore.length}
          description="Leads com análise completa de IA"
          icon={Award}
          comparisonLabel={null}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Fluxo Contínuo de Entrada */}
        <section className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#10141e]/90 to-[#0A0D14]/90 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-white">
                Fluxo Contínuo de Entrada
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Volume de novos contatos registrados nos últimos 7 dias.
              </p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dadosDiarios}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="roseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#f43f5e"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor="#f43f5e"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.05)"
                  vertical={false}
                />

                <XAxis
                  dataKey="dia"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip content={<CustomChartTooltip />} />

                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#f43f5e"
                  fill="url(#roseGradient)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Estágios de Qualificação */}
        <section className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#10141e]/90 to-[#0A0D14]/90 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-white">
                Estágios de Qualificação
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Segmentação pelo algoritmo de pontuação.
              </p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosClassificacao}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.05)"
                  vertical={false}
                />

                <XAxis
                  dataKey="classificacao"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  content={<CustomChartTooltip />}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                />

                <Bar dataKey="quantidade" radius={[8, 8, 2, 2]}>
                  {dadosClassificacao.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PerformancePage