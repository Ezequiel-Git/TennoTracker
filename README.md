# 🪐 TennoTracker — Warframe Mastery & Inventory Companion

[![Vite](https://img.shields.io/badge/Vite-B736FF?style=for-the-badge&logo=vite&logoColor=FFD62C)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

**TennoTracker** é um aplicativo web companion premium, rápido e totalmente responsivo desenvolvido para jogadores de **Warframe**. Com ele, você pode planejar seu avanço de Maestria (Mastery Rank), gerenciar seu inventário de armas e mods, acompanhar ciclos do mundo em tempo real e visualizar seu progresso no Mapa Estelar por meio de um painel interativo em 3D.

---

## 🌟 Recursos Principais

### 1. 📊 Perfil do Tenno & Simulador de Maestria
* Acompanhe seu **Mastery Rank** atual e veja a quantidade exata de XP restante para o próximo teste.
* **Simulador de MR:** Calcule a quantidade de armas e Warframes pendentes que você precisa dominar para atingir o rank desejado.
* Exibição de estatísticas gerais de coleção divididas por categorias (Primárias, Secundárias, Corpo a Corpo, Nêmesis, etc.).

### 2. 🌌 Mapa Estelar Interativo (Star Chart)
* Visualização solar em 3D com texturas celestes de alta fidelidade para todos os 19 planetas e locais do jogo.
* **Mecânica de Zoom-in:** Clique em qualquer planeta para entrar em uma visualização ampliada, mostrando a constelação de nós de missões interligados por linhas brilhantes de progresso.
* **Integração Subterrânea:** Alternância suave por abas dentro do zoom de Deimos para gerenciar de forma independente os nós da superfície e os laboratórios subterrâneos do **Sanctum Anatomica**.
* Modo Normal e **Steel Path (Caminho de Aço)** com a respectiva contabilidade de XP de Maestria (até 55.038 XP).

### 🌁 3. Ciclos do Mundo em Tempo Real
* Acompanhe o tempo restante dos ciclos de **Cetus** (Dia/Noite), **Orb Vallis** (Quente/Frio), **Deriva de Cambion** (Fass/Vome) e a vinda/saída de **Baro Ki'Teer** (Void Trader) com localização dinâmica.
* Atualização automática periódica integrada à API de status do Warframe.

### ⚔️ 4. Arsenal & Lista de Verificação (Checklist)
* Checklist de todas as armas e Warframes disponíveis no jogo com informações de requisitos de Mastery Rank, status de obtenção e maestria concluída.
* Detalhes de fabricação, atributos de combate de armas, habilidades completas de Warframes e links diretos para a Wiki oficial do Warframe.
* Identificação automática de itens guardados no cofre (**Vaulted**).

### 🃏 5. Rastreador de Mods
* Gerenciamento completo da sua coleção de Mods com paginação incremental inteligente e filtragem por raridade, tipo, polaridade e status de obtenção.
* Veja os atributos de cada mod divididos por Rank (Dreno, Polaridade) e tabelas com as fontes de drop (inimigos/missões) oficiais.

### 🎭 6. Outros Módulos Integrados
* **Terminais de Junção:** Checklist dos 13 terminais que concedem 1.000 XP cada, com visualização dourada exclusiva e checkboxes personalizados.
* **Sindicatos:** Gerencie sua reputação com facções primárias e mundos abertos com cálculo automático de aliados (+50%), opostos (-50%) e inimigos (-100%).
* **Liches & Irmãs (Nemesis):** Acompanhe suas armas Kuva, Tenet e Infestados (Coda), controlando progenitores, elementos, bônus de porcentagem e fusão de valência.
* **Planejador de Maestria:** Recomendações inteligentes sobre quais itens fáceis fabricar e dominar a seguir (Dojo, Mercado, Chefes).
* **Importar & Exportar:** Faça backups em arquivos `.json` ou migre seus dados de forma rápida e segura.

---

## 🛠️ Tecnologias Utilizadas

* **React 18 & Vite** - Estrutura e compilação rápida para o front-end.
* **Vanilla CSS3** - Folhas de estilo customizadas com design futurista baseado em *Glassmorphism*, efeitos de brilho neon (neon glow), animações em frames e total responsividade móvel.
* **Lucide React** - Conjunto moderno de ícones de alta resolução.
* **WarframeStat API** - Dados dinâmicos e ciclos globais do jogo.

---

## 🚀 Como Executar o Projeto Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado no seu computador.

1. Clone este repositório:
```bash
git clone https://github.com/Ezequiel-Git/TennoTracker.git
```

2. Acesse a pasta do projeto:
```bash
cd TennoTracker
```

3. Instale as dependências:
```bash
npm install
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```
O console exibirá o endereço local (geralmente `http://localhost:5173`). Abra-o em seu navegador!

5. Para gerar a build de produção otimizada:
```bash
npm run build
```

---

## 📜 Licença & Isenção de Responsabilidade

Este é um projeto feito por fã e para fãs. **TennoTracker** não é afiliado à Digital Extremes. *Warframe* e todas as suas respectivas artes e propriedades são marcas comerciais registradas da Digital Extremes.
Todos os dados dinâmicos são alimentados pela API pública do [Warframe Status](https://warframestat.us/).
