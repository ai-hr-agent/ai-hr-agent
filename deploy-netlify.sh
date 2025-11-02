#!/bin/bash

# Script para preparar e fazer deploy no Netlify
# Uso: ./deploy-netlify.sh

echo "🚀 Preparando deploy para Netlify..."

# Verificar se a pasta public existe
if [ ! -d "public" ]; then
    echo "❌ Pasta 'public' não encontrada!"
    exit 1
fi

# Verificar arquivos essenciais
required_files=(
    "public/index.html"
    "public/styles.css"
    "public/script-static.js"
    "public/data/employees.json"
    "public/data/recommendations.json"
    "public/data/charts.json"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Arquivo obrigatório não encontrado: $file"
        exit 1
    fi
done

echo "✅ Todos os arquivos necessários estão presentes"

# Verificar se netlify CLI está instalado
if ! command -v netlify &> /dev/null; then
    echo "⚠️  Netlify CLI não está instalado."
    echo "Instalar? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        npm install -g netlify-cli
    else
        echo "📖 Para instalar manualmente: npm install -g netlify-cli"
        echo "📖 Ou use o deploy manual: https://netlify.com"
        exit 1
    fi
fi

# Login no Netlify se necessário
echo "🔐 Verificando login no Netlify..."
if ! netlify status &> /dev/null; then
    echo "Fazendo login no Netlify..."
    netlify login
fi

# Fazer deploy
echo "📤 Fazendo deploy..."
netlify deploy --dir=public --prod

echo ""
echo "🎉 Deploy concluído!"
echo "📱 Acesse seu site na URL fornecida acima"
echo ""
echo "💡 Dicas:"
echo "   - Configure um nome personalizado nas configurações do Netlify"
echo "   - Conecte com GitHub para deploys automáticos"
echo "   - Adicione um domínio personalizado se desejar"