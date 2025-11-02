# AI HR Agent - Interface Visual Demo

Este é um projeto de demonstração da interface visual para um sistema de **Agente de IA para Gestão Proativa de RH** com dados mockados.

## 🚀 Funcionalidades

### Dashboard Principal
- **Métricas em Tempo Real**: Visualização de KPIs principais de RH
- **Funcionários em Risco**: Identificação automática de colaboradores que precisam de atenção
- **Recomendações IA**: Sugestões automatizadas baseadas em análise de dados
- **Gráfico de Performance**: Tendência de performance com diferentes períodos (6 meses, ano, trimestre)

### Gestão de Funcionários
- **Lista Completa**: Visualização de todos os funcionários
- **Filtros Avançados**: Por departamento, status, performance
- **Cards Detalhados**: Métricas individuais de performance, satisfação e produtividade
- **Busca Inteligente**: Localização rápida de funcionários

### Sistema de Recomendações
- **Priorização Automática**: Classificação por alta, média e baixa prioridade
- **Ações Sugeridas**: Recomendações específicas para cada situação
- **Filtros por Tipo**: Performance, satisfação, produtividade
- **Interface Intuitiva**: Visualização clara das recomendações
- **Detalhamento Completo**: Modal com análise detalhada, razões e resultados esperados
- **Interatividade**: Cards clicáveis para ver informações completas

### Analytics Avançado
- **Métricas Detalhadas**: Taxa de rotatividade, engajamento, produtividade
- **Gráfico de Performance por Departamento**: Comparação entre áreas da empresa
- **Evolução de Satisfação vs Performance**: Correlação temporal entre métricas
- **Distribuição de Status**: Visualização da situação dos funcionários
- **Controles Interativos**: Filtros de período e visualizações dinâmicas

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Gráficos**: Chart.js para visualizações interativas
- **Estilo**: CSS Grid, Flexbox, Design Responsivo
- **Ícones**: Font Awesome
- **Dados**: JSON mockados para demonstração

## 📊 Dados Mockados

O sistema inclui dados de exemplo para:
- 4 funcionários com diferentes perfis e métricas
- 3 recomendações de IA com diferentes prioridades
- Métricas gerais da empresa (150 funcionários simulados)
- KPIs de performance, satisfação e produtividade
- Avatares personalizados em SVG para cada usuário

## 🎨 Design e UX

- **Interface Moderna**: Design clean e profissional
- **Responsivo**: Adaptado para desktop e mobile
- **Navegação Intuitiva**: Menu lateral com ícones claros
- **Cores Estratégicas**: Sistema de cores para indicar status e prioridades
- **Feedback Visual**: Hover effects e transições suaves

## 📱 Estrutura da Interface

### Sidebar
- Dashboard
- Funcionários
- Recomendações
- Analytics
- Configurações
- Sobre (informações acadêmicas do projeto)

### Header
- Barra de busca
- Notificações
- Perfil do usuário

### Área Principal
- Cards de métricas
- Grids responsivos
- Painéis informativos
- Filtros e controles

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor:**
   ```bash
   npm start
   ```

3. **Acessar a aplicação:**
   - Abrir navegador em `http://localhost:3000`

4. **Para desenvolvimento:**
   ```bash
   npm run dev
   ```

## 📁 Estrutura do Projeto

```
├── public/
│   ├── index.html      # Página principal
│   ├── styles.css      # Estilos CSS
│   ├── script.js       # JavaScript frontend
│   └── images/         # Imagens e avatares
├── server.js           # Servidor Express
├── package.json        # Dependências
└── README.md          # Documentação
```

## 🔮 Funcionalidades Futuras

- **Integração com banco de dados real**
- **Sistema de autenticação**
- **Gráficos interativos (Chart.js/D3.js)**
- **Notificações em tempo real**
- **Exportação de relatórios**
- **API REST completa**
- **Integração com sistemas de RH existentes**

## 📋 Endpoints da API

- `GET /api/dashboard` - Dados do dashboard
- `GET /api/employees` - Lista de funcionários
- `GET /api/employees/:id` - Funcionário específico
- `GET /api/recommendations` - Recomendações IA
- `GET /api/recommendations/:id` - Detalhes completos de uma recomendação
- `GET /api/metrics` - Métricas gerais
- `GET /api/charts/performance` - Dados de performance para gráficos
- `GET /api/charts/departments` - Dados por departamento

## 🎯 Objetivo

Este protótipo demonstra como seria a interface visual de um sistema de **Agente de IA para Gestão Proativa de RH**, mostrando:

- **Usabilidade**: Interface intuitiva e profissional
- **Funcionalidades**: Principais recursos de um sistema de RH com IA
- **Visualização**: Como os dados seriam apresentados
- **Interatividade**: Navegação e filtros funcionais
- **Responsividade**: Adaptação para diferentes dispositivos

---

**Desenvolvido para demonstração do projeto de interface visual de sistema de RH com IA**