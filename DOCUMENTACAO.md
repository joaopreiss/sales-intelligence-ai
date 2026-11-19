# Sales Intelligence AI — Documentação Oficial do Sistema

> Inteligência Comercial e Scoring Preditivo de Leads com IA.

---

## 1. Visão Geral do Produto

O **Sales Intelligence AI** é um dashboard analítico voltado para operações comerciais de alto desempenho. O sistema atua como um **Command Center** que ingere leads capturados, processa suas necessidades e mensagens por meio de fluxos automatizados (n8n + Google Gemini Pro), calcula pontuações preditivas (*lead score*) e entrega recomendações acionáveis em tempo real para times de vendas e SDRs.

### Principais Capacidades
- **Scoring Preditivo**: Qualificação automática de leads de 0 a 100 baseada no fit comercial e urgência.
- **Roteamento Inteligente**: Sinalização imediata de leads que necessitam de intervenção humana vs. fluxo automatizado.
- **Diagnóstico Comercial com IA**: Geração de diagnósticos semânticos, oportunidades mapeadas e ações recomendadas para cada contato.
- **Monitoramento em Tempo Real**: Atualização instantânea da interface via Supabase Realtime conforme novos contatos chegam à base.

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Framework Frontend** | React 19 + Vite 8 | Interface reativa, componentizada e build ultrarrápido |
| **Roteamento** | React Router DOM v7 | Navegação client-side SPA sem recarregamento |
| **Estilização & Design** | Tailwind CSS v4 + Design Tokens Customizados | Dark mode premium (estética Linear/Stripe/Vercel) |
| **Data Viz / Gráficos** | Recharts v3 | Gráficos analíticos customizados com tooltips escuros |
| **Ícones** | Lucide React | Biblioteca consistente de ícones vetoriais |
| **Backend & Realtime** | Supabase (PostgreSQL + Realtime Channel) | Banco de dados, persistência e websocket de sincronização |
| **Automação & IA** | n8n + Google Gemini AI (integração externa) | Orquestração do webhook e motor cognitivo de qualificação |

---

## 3. Arquitetura de Pastas e Arquivos

```
sales-intelligence-ai/
├── src/
│   ├── assets/
│   │   └── logo.png              # Asset gráfico complementar
│   ├── components/
│   │   ├── BrandLogo.jsx         # Logo vetorial minimalista SVG oficial
│   │   ├── CommandPalette.jsx    # Paleta de busca global flutuante (Ctrl+K)
│   │   ├── Header.jsx            # Barra superior (busca, notificações realtime, perfil)
│   │   ├── LeadsTable.jsx        # Tabela rica com barra de score e modal de diagnóstico
│   │   ├── SalesCharts.jsx       # Gráficos de temperatura e segmentos/categorias
│   │   ├── SettingsModal.jsx     # Modal de governança de alertas e status de conexões
│   │   ├── Sidebar.jsx           # Navegação principal, logo e status do websocket
│   │   └── StatCard.jsx          # Cards de KPIs com tipografia tabular e tendências
│   ├── lib/
│   │   └── supabase.js           # Inicialização do client Supabase
│   ├── pages/
│   │   ├── DashboardPage.jsx     # Visão Geral (Command Center com filtros de tempo e táticos)
│   │   ├── IntelligencePage.jsx  # Diagnósticos profundos de IA e leitura semântica
│   │   ├── LeadsPage.jsx         # Gestão completa da base de leads
│   │   ├── OpportunitiesPage.jsx # Hot Pipeline (leads com alta propensão de conversão)
│   │   └── PerformancePage.jsx   # Curvas de entrada (últimos 7 dias) e qualificação
│   ├── App.css                   # Reset complementar
│   ├── App.jsx                   # Componente raiz, orquestração de estado e realtime
│   ├── index.css                 # Tokens do design system, glassmorphism e scrollbar
│   └── main.jsx                  # Ponto de entrada React montado no DOM
├── .env.example / .env           # Credenciais Supabase
├── DOCUMENTACAO.md               # Esta documentação
├── package.json                  # Dependências e scripts npm
└── vite.config.js                # Configuração do Vite + Tailwind plugin
```

---

## 4. Design System & Identidade Visual

A interface foi projetada sob uma estética **Dark Mode Premium** voltada para produtos B2B analíticos:

* **Paleta de Cores**:
  * **Fundo de Tela (Canvas)**: `#080A0F` (Grafite espacial profundo).
  * **Superfícies & Cards**: `#0E121B` com gradiente sutil até `#0B0E15` e efeito de vidro escuro (`glass-panel`).
  * **Bordas**: `rgba(255, 255, 255, 0.06)` com iluminação superior de 1px.
  * **Cor de Destaque (Accent)**: Carmesim sofisticado (`#F43F5E` / Tailwind Rose-500) com brilhos sutis (`glows` de 10% a 20% de opacidade).
* **Tipografia**:
  * Família `Inter` com classes `tabular-nums` para todos os valores numéricos e percentuais, eliminando jitter em atualizações.
* **Componentes de Destaque**:
  * **BrandLogo**: Ícone geométrico proprietário com arco orbital e vetor ascendente de inteligência.
  * **Command Palette**: Pesquisa global indexando IDs, categorias, necessidades e termos em tempo real.
  * **Status Realtime**: Indicador visual pulsante na Sidebar confirmando sincronização com Supabase.

---

## 5. Estrutura de Dados (Supabase)

### Tabela `leads`
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid / int` | Identificador único do lead |
| `categoria` | `text` | Segmento mapeado (*automacao*, *software*, *consultoria*, etc.) |
| `prioridade` | `text` | Nível de atendimento (*alta*, *media*, *baixa*) |
| `lead_score` | `numeric` | Pontuação preditiva gerada pela IA (0 a 100) |
| `classificacao_lead` | `text` | Temperatura comercial (*frio*, *morno*, *quente*, *muito quente*) |
| `mensagem` | `text` | Transcrição ou mensagem original captada |
| `necessidade` | `text` | Dor ou demanda principal sintetizada pela IA |
| `proximo_passo` | `text` | Ação comercial sugerida para o vendedor |
| `precisa_de_humano` | `boolean` | Flag de intervenção humana obrigatória |
| `created_at` | `timestamp` | Data e hora de entrada do contato |

### Tabela `insights_leads`
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid / int` | Identificador único do diagnóstico |
| `lead_id` | `foreign key` | Associação com a tabela `leads` |
| `insight` | `text` | Diagnóstico semântico detalhado elaborado pelo Gemini |
| `oportunidade` | `text` | Oportunidade comercial estratégica mapeada |
| `acao_recomendada` | `text` | Próximo passo tático recomendado |
| `created_at` | `timestamp` | Momento da geração do insight |

---

## 6. Módulos e Páginas do Sistema

### 1. Visão Geral (`DashboardPage.jsx`)
- **Seletor Temporal Funcional**: Alternância dinâmica entre *Últimos 7 dias*, *Últimos 30 dias*, *Últimos 90 dias* ou *Todo o período*.
- **Painel de Filtros Táticos**: Filtragem combinada por categoria, apenas leads quentes e leads que necessitam de intervenção humana.
- **KPIs em Tempo Real**: Total de leads, Score médio ponderado, Leads muito quentes e volume de intervenções humanas.
- **Grid de Gráficos e Tabela**: Visualização imediata das métricas do período filtrado.

### 2. Gestão de Leads (`LeadsPage.jsx`)
- Listagem completa dos contatos com barras visuais de progresso de score, tags de temperatura com glow e botão de inspeção que abre o modal de diagnóstico preditivo.

### 3. Inteligência Comercial (`IntelligencePage.jsx`)
- Central cognitiva que expõe a distribuição de demandas, percentuais de intenção e o feed completo de análises táticas do Gemini.

### 4. Desempenho (`PerformancePage.jsx`)
- Curva contínua de entrada com gráfico de área nos últimos 7 dias e distribuição por estágios de qualificação (Frio, Morno, Quente e Muito Quente).

### 5. Oportunidades (`OpportunitiesPage.jsx`)
- Fila de atendimento prioritário focada exclusivamente em leads com propensão de fechamento imediata (*Quente* e *Muito Quente*), ordenados pelo maior lead score.

---

## 7. Como Executar o Projeto

### Pré-requisitos
- Node.js versão 18+ (testado no Node.js v24)
- Chaves de acesso ao projeto Supabase (`URL` e `Publishable Anon Key`)

### Instalação e Execução
```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (.env)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-aqui

# 3. Rodar em ambiente de desenvolvimento
npm run dev

# 4. Compilar para produção
npm run build

# 5. Pré-visualizar a build de produção
npm run preview
```

