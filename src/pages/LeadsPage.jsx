import { useState, useMemo } from 'react'
import {
  Users,
  Flame,
  Headset,
  Target,
  Search,
  X,
  AlertCircle,
  Check,
} from 'lucide-react'
import LeadsTable from '../components/LeadsTable'
import StatCard from '../components/StatCard'

// Função auxiliar para normalizar strings (remove acentos, espaços extras e põe em minúsculas)
function normalizarTexto(texto) {
  if (!texto) return ''
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

// Normaliza e mapeia o valor da prioridade do lead
function extrairPrioridadePadronizada(prioridadeBruta) {
  const norm = normalizarTexto(prioridadeBruta)
  if (!norm) return 'nao_informada'
  if (norm.includes('alta') || norm.includes('high') || norm === 'urgente') return 'alta'
  if (norm.includes('med') || norm.includes('media') || norm.includes('normal')) return 'media'
  if (norm.includes('baix') || norm.includes('low')) return 'baixa'
  return norm
}

// Normaliza a temperatura/classificação do lead
function extrairTemperaturaPadronizada(tempBruta) {
  const norm = normalizarTexto(tempBruta)
  if (!norm) return 'nao_informada'
  if (norm.includes('muito quente')) return 'muito quente'
  if (norm.includes('quente')) return 'quente'
  if (norm.includes('morno')) return 'morno'
  if (norm.includes('frio')) return 'frio'
  return norm
}

function LeadsPage({ leads = [], loading = false }) {
  // Filtros avançados na página de leads
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [temperatura, setTemperatura] = useState('todas')
  const [prioridade, setPrioridade] = useState('todas')
  const [apenasHumano, setApenasHumano] = useState(false)
  const [ordenacao, setOrdenacao] = useState('recentes') // 'recentes', 'score_desc', 'score_asc'

  // Métricas de topo específicas da base de leads
  const totalLeads = leads.length

  const leadsQuentes = useMemo(() => {
    return leads.filter((l) => {
      const temp = extrairTemperaturaPadronizada(l.classificacao_lead)
      return temp === 'quente' || temp === 'muito quente'
    }).length
  }, [leads])

  const scoreMedio = useMemo(() => {
    const comScore = leads.filter((l) => typeof l.lead_score === 'number')
    return comScore.length > 0
      ? Math.round(
          comScore.reduce((acc, l) => acc + l.lead_score, 0) / comScore.length
        )
      : 0
  }, [leads])

  const precisamHumano = useMemo(() => {
    return leads.filter((l) => l.precisa_de_humano === true).length
  }, [leads])

  // Categorias únicas existentes na base real
  const categoriasDisponiveis = useMemo(() => {
    const catsMap = new Map()
    leads.forEach((l) => {
      if (l.categoria) {
        const norm = normalizarTexto(l.categoria)
        if (!catsMap.has(norm)) {
          catsMap.set(norm, l.categoria)
        }
      }
    })
    return Array.from(catsMap.entries()).map(([chave, original]) => ({
      chave,
      label: original.charAt(0).toUpperCase() + original.slice(1),
    }))
  }, [leads])

  // Contagem dinâmica de leads por prioridade para mostrar nas opções do select
  const contagemPrioridades = useMemo(() => {
    const counts = { alta: 0, media: 0, baixa: 0 }
    leads.forEach((l) => {
      const p = extrairPrioridadePadronizada(l.prioridade)
      if (counts[p] !== undefined) {
        counts[p]++
      }
    })
    return counts
  }, [leads])

  // Filtragem e ordenação resiliente dos leads
  const leadsFiltrados = useMemo(() => {
    let result = [...leads]

    // 1. Busca textual abrangente (ID, categoria, necessidade, mensagem, prioridade, classificação)
    if (busca.trim()) {
      const termo = normalizarTexto(busca)
      result = result.filter((l) => {
        const idStr = String(l.id || '')
        const cat = normalizarTexto(l.categoria)
        const nec = normalizarTexto(l.necessidade)
        const msg = normalizarTexto(l.mensagem)
        const prox = normalizarTexto(l.proximo_passo)
        const prio = normalizarTexto(l.prioridade)
        const temp = normalizarTexto(l.classificacao_lead)

        return (
          idStr.includes(termo) ||
          cat.includes(termo) ||
          nec.includes(termo) ||
          msg.includes(termo) ||
          prox.includes(termo) ||
          prio.includes(termo) ||
          temp.includes(termo)
        )
      })
    }

    // 2. Filtro de Categoria
    if (categoria !== 'todas') {
      result = result.filter(
        (l) => normalizarTexto(l.categoria) === categoria
      )
    }

    // 3. Filtro de Temperatura
    if (temperatura !== 'todas') {
      result = result.filter(
        (l) => extrairTemperaturaPadronizada(l.classificacao_lead) === temperatura
      )
    }

    // 4. Filtro de Prioridade (Robusto contra acentos, maiúsculas/minúsculas e variações)
    if (prioridade !== 'todas') {
      result = result.filter((l) => {
        const prioridadeLead = extrairPrioridadePadronizada(l.prioridade)
        return prioridadeLead === prioridade
      })
    }

    // 5. Intervenção humana
    if (apenasHumano) {
      result = result.filter((l) => l.precisa_de_humano === true)
    }

    // 6. Ordenação
    if (ordenacao === 'score_desc') {
      result.sort((a, b) => (b.lead_score || 0) - (a.lead_score || 0))
    } else if (ordenacao === 'score_asc') {
      result.sort((a, b) => (a.lead_score || 0) - (b.lead_score || 0))
    } else {
      // Recentes por padrão
      result.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      )
    }

    return result
  }, [leads, busca, categoria, temperatura, prioridade, apenasHumano, ordenacao])

  const temFiltroAtivo =
    busca.trim() !== '' ||
    categoria !== 'todas' ||
    temperatura !== 'todas' ||
    prioridade !== 'todas' ||
    apenasHumano

  const limparFiltros = () => {
    setBusca('')
    setCategoria('todas')
    setTemperatura('todas')
    setPrioridade('todas')
    setApenasHumano(false)
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-7">
      {/* Header Principal da Página */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.05] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Gestão de Leads
            </h1>
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono font-medium text-slate-300">
              {loading ? '...' : `${totalLeads} contatos`}
            </div>
          </div>
          <p className="mt-1.5 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Painel operacional para monitoramento, triagem e inspeção detalhada de cada oportunidade capturada.
          </p>
        </div>

        {/* Status de Sincronização */}
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs text-slate-300 self-start sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-medium text-slate-200">Sincronização em Tempo Real</span>
        </div>
      </div>

      {/* KPI Cards Estratégicos da Base de Leads */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Registrados"
          value={loading ? '...' : totalLeads}
          description="Total de leads captados"
          icon={Users}
          comparisonLabel="Base Ativa"
        />

        <StatCard
          title="Score Médio Preditivo"
          value={loading ? '...' : scoreMedio}
          description="Pontuação ponderada pela IA"
          icon={Target}
          trend="+4.2 pts"
          trendPositive={true}
          aiTag="Análise Inteligente"
          comparisonLabel="Escala 0-100"
        />

        <StatCard
          title="Alta Propensão"
          value={loading ? '...' : leadsQuentes}
          description={`${totalLeads > 0 ? Math.round((leadsQuentes / totalLeads) * 100) : 0}% da base com intenção alta`}
          icon={Flame}
          trend="Prioritários"
          trendPositive={true}
          highlight={true}
          comparisonLabel="Prontos para contato"
        />

        <StatCard
          title="Intervenção Humana Requerida"
          value={loading ? '...' : precisamHumano}
          description="Demandam suporte consultor"
          icon={Headset}
          trend={precisamHumano > 0 ? 'Fila Pendente' : 'Sem fila'}
          trendPositive={precisamHumano === 0}
          comparisonLabel={precisamHumano > 0 ? 'Escalação manual' : '100% autônomo'}
        />
      </div>

      {/* Barra de Filtros Operacionais & Ordenação */}
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#111622]/90 via-[#0e131d]/95 to-[#090c12] p-4 shadow-xl backdrop-blur-xl space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Campo de Busca Rápida */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por #ID, dor do lead, necessidade, categoria ou prioridade..."
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pl-10 pr-9 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/30 transition-all"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filtros em Linha */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Categoria */}
            <div className="relative">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="h-10 rounded-xl border border-white/[0.08] bg-[#0c1017] px-3.5 text-xs font-medium text-slate-300 focus:outline-none focus:border-rose-500/40 cursor-pointer hover:border-white/20 transition-all"
              >
                <option value="todas">Todas as categorias</option>
                {categoriasDisponiveis.map((cat) => (
                  <option key={cat.chave} value={cat.chave}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Temperatura */}
            <div className="relative">
              <select
                value={temperatura}
                onChange={(e) => setTemperatura(e.target.value)}
                className="h-10 rounded-xl border border-white/[0.08] bg-[#0c1017] px-3.5 text-xs font-medium text-slate-300 focus:outline-none focus:border-rose-500/40 cursor-pointer hover:border-white/20 transition-all"
              >
                <option value="todas">Todas as temperaturas</option>
                <option value="muito quente">Muito quente</option>
                <option value="quente">Quente</option>
                <option value="morno">Morno</option>
                <option value="frio">Frio</option>
              </select>
            </div>

            {/* Prioridade */}
            <div className="relative">
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className="h-10 rounded-xl border border-white/[0.08] bg-[#0c1017] px-3.5 text-xs font-medium text-slate-300 focus:outline-none focus:border-rose-500/40 cursor-pointer hover:border-white/20 transition-all"
              >
                <option value="todas">Todas as prioridades</option>
                <option value="alta">
                  Alta prioridade {contagemPrioridades.alta > 0 ? `(${contagemPrioridades.alta})` : ''}
                </option>
                <option value="media">
                  Média prioridade {contagemPrioridades.media > 0 ? `(${contagemPrioridades.media})` : ''}
                </option>
                <option value="baixa">
                  Baixa prioridade {contagemPrioridades.baixa > 0 ? `(${contagemPrioridades.baixa})` : ''}
                </option>
              </select>
            </div>

            {/* Toggle de Humano */}
            <button
              type="button"
              onClick={() => setApenasHumano(!apenasHumano)}
              className={`h-10 flex items-center gap-2 rounded-xl border px-3.5 text-xs font-medium transition-all ${
                apenasHumano
                  ? 'border-amber-500/50 bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-300 hover:border-white/20 hover:text-white'
              }`}
            >
              <AlertCircle
                size={14}
                className={apenasHumano ? 'text-amber-400' : 'text-slate-400'}
              />
              <span>Requer Humano</span>
              {apenasHumano && (
                <Check size={12} className="text-amber-400 ml-0.5" />
              )}
            </button>

            {/* Ordenação */}
            <div className="relative">
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                className="h-10 rounded-xl border border-white/[0.08] bg-[#0c1017] px-3.5 text-xs font-medium text-slate-300 focus:outline-none focus:border-rose-500/40 cursor-pointer hover:border-white/20 transition-all"
              >
                <option value="recentes">Mais recentes primeiro</option>
                <option value="score_desc">Maior score preditivo</option>
                <option value="score_asc">Menor score preditivo</option>
              </select>
            </div>

            {/* Botão de Limpar */}
            {temFiltroAtivo && (
              <button
                type="button"
                onClick={limparFiltros}
                className="h-10 flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-all"
              >
                <X size={13} />
                <span>Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* Resumo de Resultados Filtrados */}
        {temFiltroAtivo && (
          <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
            <span>
              Exibindo <strong className="text-white font-semibold">{leadsFiltrados.length}</strong> de{' '}
              <strong className="text-white font-semibold">{totalLeads}</strong> leads cadastrados.
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Filtro ativo:{' '}
              {prioridade !== 'todas' && `Prioridade ${prioridade}`}
              {categoria !== 'todas' && ` · ${categoria}`}
              {temperatura !== 'todas' && ` · ${temperatura}`}
              {apenasHumano && ' · Requer Humano'}
            </span>
          </div>
        )}
      </div>

      {/* Tabela de Leads Enriquecida */}
      <LeadsTable
        leads={leadsFiltrados}
        loading={loading}
        title="Base de Leads"
        subtitle="Listagem consolidada com ordenação e filtros operacionais aplicados."
      />
    </div>
  )
}

export default LeadsPage
