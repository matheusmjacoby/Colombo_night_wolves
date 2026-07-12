// ========================================
// Página de Estatísticas
// ========================================

let allJogadores = [];
let currentJogador = null;

(async () => {
    await loadSession();
    await carregarJogadores();
})();

async function carregarJogadores() {
    try {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("ativo", true)
            .order("nome");

        if (error) throw error;

        allJogadores = data || [];
        preencherSelectJogadores();
    } catch (e) {
        console.error("Erro ao carregar jogadores:", e);
    }
}

function preencherSelectJogadores() {
    const select = document.getElementById("filterJogadorEst");
    
    allJogadores.forEach(j => {
        const option = document.createElement("option");
        option.value = j.id;
        option.textContent = j.nome;
        select.appendChild(option);
    });

    select.onchange = async () => {
        const jogadorId = select.value;
        if (jogadorId) {
            currentJogador = allJogadores.find(j => j.id === jogadorId);
            await carregarEstatisticas(jogadorId);
        }
    };
}

async function carregarEstatisticas(jogadorId) {
    try {
        const { data: stats, error: erroStats } = await supabaseClient
            .from("statistics")
            .select("*")
            .eq("jogador_id", jogadorId);

        if (erroStats) throw erroStats;

        // Calcular estatísticas
        const totalGols = stats.reduce((acc, s) => acc + (s.gols || 0), 0);
        const totalAssist = stats.reduce((acc, s) => acc + (s.assistencias || 0), 0);
        const totalCartaoVerm = stats.reduce((acc, s) => acc + (s.cartao_vermelho || 0), 0);
        const totalCartaoAmar = stats.reduce((acc, s) => acc + (s.cartao_amarelo || 0), 0);
        
        const partidas = stats.length;
        const mediaNota = partidas > 0 
            ? (stats.reduce((acc, s) => acc + (s.nota_jogo || 0), 0) / partidas).toFixed(2)
            : 0;

        const taxaAcerto = partidas > 0 
            ? ((totalGols / partidas) * 100).toFixed(1)
            : 0;

        // Atualizar cards
        document.getElementById("partJogadas").textContent = partidas;
        document.getElementById("totalGols").textContent = totalGols;
        document.getElementById("totalAssist").textContent = totalAssist;
        document.getElementById("mediaNota").textContent = mediaNota;
        document.getElementById("cartaoVerm").textContent = totalCartaoVerm;
        document.getElementById("cartaoAmar").textContent = totalCartaoAmar;
        document.getElementById("taxaAcerto").textContent = taxaAcerto + "%";
        document.getElementById("posicaoJog").textContent = currentJogador.posicao || "-";

        // Carregar histórico
        renderizarHistorico(stats);

    } catch (e) {
        console.error("Erro ao carregar estatísticas:", e);
    }
}

async function renderizarHistorico(stats) {
    try {
        // Carregar dados das partidas
        const gameIds = stats.map(s => s.partida_id);
        
        const { data: games, error: erroGames } = await supabaseClient
            .from("games")
            .select("*")
            .in("id", gameIds);

        if (erroGames) throw erroGames;

        const tbody = document.getElementById("tabelaHistorico");
        tbody.innerHTML = "";

        stats.forEach((s, idx) => {
            const game = games.find(g => g.id === s.partida_id);
            if (!game) return;

            const data = new Date(game.data_jogo).toLocaleDateString("pt-BR");
            const cartoes = `${s.cartao_amarelo || 0}🟡 ${s.cartao_vermelho || 0}🔴`;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${data}</td>
                <td>${game.adversario}</td>
                <td class="stat-destaque">${s.gols || 0}</td>
                <td>${s.assistencias || 0}</td>
                <td class="stat-nota">${s.nota_jogo || 0}/10</td>
                <td>${cartoes}</td>
            `;
            tbody.appendChild(row);
        });

        if (stats.length === 0) {
            tbody.innerHTML = "<tr><td colspan='6' style='text-align:center;color:var(--text2)'>Nenhuma estatística registrada</td></tr>";
        }

    } catch (e) {
        console.error("Erro ao renderizar histórico:", e);
    }
}
