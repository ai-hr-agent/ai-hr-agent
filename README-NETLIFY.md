# AI HR Agent - Netlify Deployment

Este projeto foi preparado para deploy no Netlify como um site estático.

## 📁 Estrutura para Netlify

```
public/                 # Diretório principal para Netlify
├── index.html         # Página principal
├── styles.css         # Estilos CSS
├── script-static.js   # JavaScript para versão estática
├── data/              # Dados em JSON
│   ├── employees.json
│   ├── recommendations.json
│   └── charts.json
└── images/            # Avatares SVG
    ├── admin-avatar.svg
    ├── avatar1.svg
    ├── avatar2.svg
    ├── avatar3.svg
    ├── avatar4.svg
    ├── avatar5.svg
    └── avatar6.svg
```

## 🚀 Como fazer deploy no Netlify

### Opção 1: Deploy via GitHub (Recomendado)

1. **Criar repositório no GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - AI HR Agent demo"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/ai-hr-agent-demo.git
   git push -u origin main
   ```

2. **Deploy no Netlify:**
   - Acesse [netlify.com](https://netlify.com)
   - Clique em "New site from Git"
   - Conecte com GitHub
   - Selecione seu repositório
   - Configure:
     - **Build command:** `echo 'Static site - no build required'`
     - **Publish directory:** `public`
   - Clique em "Deploy site"

### Opção 2: Deploy via Drag & Drop

1. **Acesse [netlify.com](https://netlify.com)**
2. **Arraste a pasta `public/` para a área de deploy**
3. **Aguarde o upload e deploy automático**

### Opção 3: Deploy via Netlify CLI

1. **Instalar Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Fazer login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --dir=public --prod
   ```

## ⚙️ Configurações importantes

- **Publish directory:** `public`
- **Build command:** Não necessário (site estático)
- **Redirects:** Configurados no `netlify.toml`

## 🔄 Diferenças da versão estática

- Dados carregados de arquivos JSON em vez de servidor Express
- Remoção de dependências Node.js
- Mantém todas as funcionalidades visuais
- Charts, modais e navegação funcionais

## 📊 Dados incluídos

- **6 funcionários** com dados completos
- **3 recomendações** com análises detalhadas
- **Gráficos** com dados históricos simulados
- **Avatares SVG** personalizados

## 🌐 URL do site

Após o deploy, você receberá uma URL como:
`https://seu-site-name.netlify.app`

## 💡 Dicas para Netlify

1. **Nome personalizado:** Configure um nome mais amigável nas configurações do site
2. **Domínio próprio:** Adicione seu próprio domínio se desejar
3. **HTTPS:** Habilitado automaticamente
4. **Deploy contínuo:** Conecte com GitHub para deploys automáticos
5. **Preview deploys:** Netlify cria previews para pull requests

## 🔧 Troubleshooting

Se encontrar problemas:

1. **Verifique os logs** na aba "Deploys" do Netlify
2. **Confirme a estrutura** da pasta `public/`
3. **Teste localmente** abrindo `public/index.html` no navegador
4. **Verifique o arquivo** `netlify.toml` na raiz do projeto

## 📱 Responsividade

O site é totalmente responsivo e funciona em:
- Desktop
- Tablet  
- Mobile

Todas as funcionalidades são mantidas em dispositivos móveis.