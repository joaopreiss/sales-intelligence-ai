import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CommandPalette from './components/CommandPalette'
import SettingsModal from './components/SettingsModal'

import DashboardPage from './pages/DashboardPage'
import LeadsPage from './pages/LeadsPage'
import IntelligencePage from './pages/IntelligencePage'
import PerformancePage from './pages/PerformancePage'
import OpportunitiesPage from './pages/OpportunitiesPage'

import { supabase } from './lib/supabase'

function App() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  const [insights, setInsights] = useState([])
  const [loadingInsights, setLoadingInsights] = useState(true)

  // Estados dos Modais
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Atalho de teclado global para o Command Palette (Ctrl+K ou Cmd+K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    // Busca os leads
    async function buscarLeads() {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar leads:', error)
      } else {
        setLeads(data || [])
      }

      setLoading(false)
    }

    // Busca os insights
    async function buscarInsights() {
      const { data, error } = await supabase
        .from('insights_leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar insights:', error)
      } else {
        setInsights(data || [])
      }

      setLoadingInsights(false)
    }

    // Busca inicial
    buscarLeads()
    buscarInsights()

    // Atualizações em tempo real
    const canal = supabase
      .channel('sales-intelligence-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
        },
        () => {
          buscarLeads()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'insights_leads',
        },
        () => {
          buscarInsights()
        }
      )
      .subscribe()

    // Limpeza da conexão
    return () => {
      supabase.removeChannel(canal)
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-[#080A0F] text-slate-100 selection:bg-rose-500/30 selection:text-white">
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="min-w-0 flex-1">
        <Header leads={leads} onOpenSearch={() => setIsSearchOpen(true)} />

        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                leads={leads}
                loading={loading}
              />
            }
          />

          <Route
            path="/leads"
            element={
              <LeadsPage
                leads={leads}
                loading={loading}
              />
            }
          />

          <Route
            path="/inteligencia"
            element={
              <IntelligencePage
                leads={leads}
                loading={loading}
                insights={insights}
                loadingInsights={loadingInsights}
              />
            }
          />

          <Route
            path="/desempenho"
            element={
              <PerformancePage
                leads={leads}
                loading={loading}
              />
            }
          />

          <Route
            path="/oportunidades"
            element={
              <OpportunitiesPage
                leads={leads}
                loading={loading}
              />
            }
          />

          <Route
            path="*"
            element={
              <div className="p-8 text-white">
                Página não encontrada.
              </div>
            }
          />
        </Routes>
      </main>

      {/* Global Command Palette & Settings Modals */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        leads={leads}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}

export default App
