import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react'

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendPositive = true,
  aiTag,
  highlight = false,
  comparisonLabel = 'vs período anterior',
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        highlight
          ? 'border-rose-500/35 bg-gradient-to-b from-[#19121c]/90 via-[#11131c]/95 to-[#0b0d13] shadow-[0_8px_30px_rgb(244,63,94,0.08)] ring-1 ring-rose-500/20'
          : 'border-white/[0.08] bg-gradient-to-b from-[#111622]/90 via-[#0e131d]/95 to-[#090c12] hover:border-white/[0.16] hover:from-[#151c2c]/90 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
      } p-5 backdrop-blur-xl flex flex-col justify-between`}
    >
      {/* Top subtle highlight gradient line */}
      <div
        className={`absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r ${
          highlight
            ? 'from-transparent via-rose-500/60 to-transparent'
            : 'from-transparent via-white/15 to-transparent group-hover:via-white/25'
        }`}
      />

      {/* Header row */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </p>
            {aiTag && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
                </span>
                {aiTag}
              </span>
            )}
          </div>

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${
              highlight
                ? 'border-rose-500/30 bg-rose-500/15 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                : 'border-white/[0.08] bg-white/[0.03] text-slate-400 group-hover:border-white/15 group-hover:bg-white/[0.06] group-hover:text-white'
            }`}
          >
            <Icon size={18} strokeWidth={2} />
          </div>
        </div>

        {/* Metric Value & Trend */}
        <div className="mt-4 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold tracking-tight text-white tabular-nums sm:text-4xl">
              {value}
            </h3>
          </div>

          {trend && (
            <div
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums border ${
                trendPositive
                  ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
                  : 'border-rose-500/25 bg-rose-500/10 text-rose-400'
              }`}
            >
              {trendPositive ? (
                <ArrowUpRight size={13} strokeWidth={2.5} />
              ) : (
                <ArrowDownRight size={13} strokeWidth={2.5} />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Context & Comparison */}
      <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate">{description}</span>
        {comparisonLabel && (
          <span className="text-[10px] text-slate-500 shrink-0 font-medium ml-2">
            {comparisonLabel}
          </span>
        )}
      </div>
    </div>
  )
}

export default StatCard
