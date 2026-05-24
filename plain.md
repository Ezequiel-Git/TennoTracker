# Warframe Inventory Tracker

## Objetivo
Criar um site/API focado em:
* Progresso do jogador e Inventário
* Maestria (Mastery)
* Armas obtidas e faltando
* Checklist completionista

---

## Histórico de Desenvolvimento (Changelog)

### Fase Inicial (Concluída)
* **Design & UI:** Construção do layout principal Dark Mode "Orokin Prime" usando CSS nativo e paletas ricas.
* **Dashboard Principal:** Painel de maestria do jogador calculando XP para o próximo nível e exibindo o total de armas possuídas.
* **Armas (Arsenal & Checklist):** Grid dinâmico que puxa os dados ao vivo da API do WarframeStats (`/weapons`, `/warframes`). Suporta filtros por MR, status do Vault, maestria (Obtido/Dominado) e busca textual.
* **Sindicatos:** Sistema de rastreamento com propagação automática (Ganhar em um sindicato afeta automaticamente o aliado e os inimigos de acordo com as regras do jogo).
* **Planejador de Maestria:** Um motor de recomendação inteligente que sugere "o que construir a seguir", categorizando entre armas fáceis do mercado, missões, relíquias e Nêmesis.
* **Sincronização:** Ferramenta de Importar/Exportar arquivo `.json` permitindo backup local sem precisar de backend conectado.

### Expansão: Sistema Nêmesis (Concluída)
* **Aba "Liches & Irmãs":** Aba dedicada exclusiva para gerenciar armas Nêmesis (Kuva, Tenet, Coda).
* **Valence Fusion Tracker:** Calculadora integrada em cada arma de Lich que estima a porcentagem que você atingirá na próxima fusão de valência (baseado na fórmula do jogo: `max(A, B) * 1.1`).
* **Cheat Sheet de Progenitores:** Referência rápida para ver qual elemento é garantido por cada Warframe ao gerar o Lich.
* **Ajustes na Lógica de Maestria:** Armas Nêmesis agora dão **4.000 XP** (chegando ao nível 40), calculado automaticamente pelo Dashboard. O Modal de detalhes bloqueia a exibição inútil de *Blueprints* para essas armas.

### Empacotamento Desktop e Web (Concluído)
* Criação de script com `electron-builder` (Portable) para compilar a versão `.exe` autônoma.
* Adaptação do `vite.config.js` (`base: './'`) para compilação estática correta no GitHub Pages.

---

### Expansão: Detalhamento da Obtenção de Armas (Onde Obter) - Concluída
* **Classificação Detalhada de Fontes:** Mapeamento inteligente de armas baseado em seus caminhos de `uniqueName` exclusivos e banco de dados estático (`src/weaponSourceMap.js`) de 292 armas para identificar com precisão a sua origem exata (Laboratórios específicos do Dojo, diagramas ou créditos do Mercado, invasores/chefes planetários, jornadas, sindicatos, etc.).
* **Tradução Dinâmica de Fontes e Drops:** Implementação e atualização das funções `getLocalizedSource` e `getLocalizedDropText` cobrindo 21 categorias refinadas de fontes e suas respectivas localizações de obtenção nas 4 línguas suportadas (`pt`, `en`, `es`, `ja`).
* **Melhorias de Busca e Interface:** Otimização do filtro de pesquisa do Arsenal para permitir encontrar armas buscando pelo nome da fonte traduzida (ex: pesquisar "Tenno" ou "Laboratório" no Arsenal em português irá filtrar corretamente as armas pesquisadas no Laboratório Tenno).

## Fases em Andamento
* Nenhuma. Todas as metas solicitadas foram concluídas com sucesso.

## Internacionalização (i18n) - Concluída
* **Interface Multilíngue (pt, en, es, ja):** Tradução completa de toda a interface do usuário, incluindo títulos, descrições, tabelas, modais, abas, sindicatos e planejador.
* **API Traduzida:** Modificação das requisições para a API do WarframeStat.us, injetando o parâmetro de linguagem correto `?language=${lang}` dinamicamente na inicialização e ao alternar o idioma.
* **Preservação de Progresso (Retrocompatibilidade):** Migração das chaves de inventário para utilizar o identificador único estável da API (`item.uniqueName`/`w.id`), eliminando perdas de progresso ao alternar o idioma. Foi implementada uma lógica de fallback duplo (`inventory[w.id] || inventory[w.name]`) para assegurar que checkpoints antigos continuem carregando perfeitamente.
* **Componentes Atualizados:** Planner, Rastreamento de Sindicatos, Grid Nêmesis, Listas de Armas e Modal de Detalhes atualizados para realizar lookups e salvar chaves de progresso baseadas no ID único.

