import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Flame, PieChart as PieIcon, Sparkles } from 'lucide-react'

// Paleta sofisticada alinhada ao Dark Mode Graphite & Crimson Accent
const CATEGORY_COLORS = ['#f43f5e', '#38bdf8', '#818cf8', '#fbbf24', '#34d399', '#a78bfa']

// Custom Tooltip minimalista no estilo dark mode premium
function CustomBarTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0c1017]/95 px-3 py-2 text-xs shadow-2xl backdrop-blur-xl">
        <p className="font-semibold text-white">{label}</p>
        <p className="mt-1 text-rose-400">
          <span className="font-bold tabular-nums">{payload[0].value}</span> leads ({payload[0].payload.percentual ?? 0}%)
        </p>
      </div>
    )
  }
  return null
}

function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0c1017]/95 px-3 py-2 text-xs shadow-2xl backdrop-blur-xl">
        <p className="font-semibold text-white">{payload[0].name}</p>
        <p className="mt-1 text-slate-300">
          Volume: <span className="font-bold text-white tabular-nums">{payload[0].value}</span> leads ({payload[0].payload.percentual ?? 0}%)
        </p>
      </div>
    )
  }
  return null
}

function SalesCharts({ leads = [] }) {
  const totalLeads = leads.length

  // Agrupa os leads por classificação
  const classificacoesBase = [
    { name: 'Frio', chave: 'frio', fill: '#475569' },
    { name: 'Morno', chave: 'morno', fill: '#f59e0b' },
    { name: 'Quente', chave: 'quente', fill: '#fb923c' },
    { name: 'Muito quente', chave: 'muito quente', fill: '#f43f5e' },
  ]

  const classificacoes = classificacoesBase.map((item) => {
    const qtd = leads.filter(
      (l) => l.classificacao_lead?.toLowerCase() === item.chave
    ).length
    const perc = totalLeads > 0 ? Math.round((qtd / totalLeads) * 100) : 0
    return {
      name: item.name,
      quantidade: qtd,
      percentual: perc,
      fill: item.fill,
    }
  })

  // Agrupa os leads por categoria
  const categoriasMap = {}
  leads.forEach((lead) => {
    const rawCat = lead.categoria || 'Não informado'
    const catFormatada =
      rawCat.charAt(0).toUpperCase() + rawCat.slice(1).toLowerCase()
    categoriasMap[catFormatada] = (categoriasMap[catFormatada] || 0) + 1
  })

  const categorias = Object.entries(categoriasMap).map(([name, value]) => ({
    name,
    value,
    percentual: totalLeads > 0 ? Math.round((value / totalLeads) * 100) : 0,
  }))

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* Gráfico de Classificação / Temperatura */}
      <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#111622]/95 via-[#0e131d]/95 to-[#090c12] p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/[0.14] flex flex-col justify-between">
        {/* Top highlight bar */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/20" />

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-white">
                Distribuição por Temperatura
              </h3>
              <span className="rounded-full border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                Preditivo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Classificação comercial gerada via IA por intenção de compra.
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400">
            <Flame size={17} />
          </div>
        </div>

        {/* Chart View */}
        <div className="mt-6 h-72">
          {leads.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-slate-500 font-mono">
              <Sparkles size={20} className="text-slate-600" />
              <span>Aguardando dados de leads...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classificacoes} margin={{ top: 12, right: 10, left: -22, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={6}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  dx={-4}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.025)' }} />
                <Bar
                  dataKey="quantidade"
                  radius={[8, 8, 2, 2]}
                  maxBarSize={48}
                >
                  {classificacoes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend stats footer */}
        <div className="mt-4 pt-3 border-t border-white/[0.04] grid grid-cols-4 gap-2 text-center">
          {classificacoes.map((c) => (
            <div key={c.name} className="space-y-0.5">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.fill }} />
                <span className="truncate">{c.name}</span>
              </div>
              <p className="text-xs font-bold text-white tabular-nums">
                {c.quantidade} <span className="text-[10px] text-slate-500 font-normal">({c.percentual}%)</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de Categorias / Demandas */}
      <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#111622]/95 via-[#0e131d]/95 to-[#090c12] p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/[0.14] flex flex-col justify-between">
        {/* Top highlight bar */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/20" />

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-white">
                Segmentos & Demandas
              </h3>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                Distribuição
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Volume e percentual de interesse agrupado por solução comercial.
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400">
            <PieIcon size={17} />
          </div>
        </div>

        {/* Chart View */}
        <div className="mt-6 h-72">
          {leads.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-slate-500 font-mono">
              <Sparkles size={20} className="text-slate-600" />
              <span>Aguardando dados de leads...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorias}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  innerRadius={68}
                  outerRadius={96}
                  paddingAngle={4}
                  stroke="rgba(9, 12, 18, 0.9)"
                  strokeWidth={2}
                >
                  {categorias.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => (
                    <span className="text-xs font-medium text-slate-300">{value}</span>
                  )}
                  iconType="circle"
                  iconSize={7}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-400">
          <span>{categorias.length} categorias identificadas</span>
          <span className="text-[10px] text-slate-500">Normalizado pela IA</span>
        </div>
      </div>
    </div>
  )
}

export default SalesCharts
