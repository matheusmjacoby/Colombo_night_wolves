// ========================================
// Página de Ranking
// ========================================

(async () => {
    await loadSession();
    await carregarRankings();
})();

async function carregarRankings() {
    try {
        // Carregar all players e estatísticas
        const { data: jogadores, error: erroJog } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("ativo", true)
            .order("nome");

        if (erroJog) throw erroJog;

        const { data: stats, error: erroStats } = await supabaseClient
            .from("statistics")
            .select("*");

        if (erroStats) throw erroStats;

        // Calcular estatísticas por jogador
        const jogadoresStats = jogadores.map(j => {
            const jogadorStats = stats.filter(s => s.jogador_id === j.id);
            
            const totalGols = jogadorStats.reduce((acc, s) => acc + (s.gols || 0), 0);
            const totalAssist = jogadorStats.reduce((acc, s) => acc + (s.assistencias || 0), 0);
            const totalCartoes = jogadorStats.reduce((acc, s) => acc + (s.cartoes || 0), 0);
            const mediaNota = jogadorStats.length > 0 
                ? (jogadorStats.reduce((acc, s) => acc + (s.nota_jogo || 0), 0) / jogadorStats.length).toFixed(2)
                : 0;

            return {
                id: j.id,
                nome: j.nome,
                gols: totalGols,
                assist: totalAssist,
                cartoes: totalCartoes,
                nota: mediaNota,
                partidas: jogadorStats.length
            };
        });

        // Renderizar rankings
        renderizarRankingGols(jogadoresStats);
        renderizarRankingAssist(jogadoresStats);
        renderizarRankingNota(jogadoresStats);
        renderizarRankingCartoes(jogadoresStats);

    } catch (e) {
        console.error("Erro ao carregar rankings:", e);
    }
}

function renderizarRankingGols(jogadores) {
    const sorted = [...jogadores].sort((a, b) => b.gols - a.gols);
    const tbody = document.getElementById("rankingGols");
    tbody.innerHTML = "";

    sorted.slice(0, 10).forEach((j, idx) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="ranking-posicao">${idx + 1}</td>
            <td class="ranking-nome">${j.nome}</td>
            <td class="ranking-numero">${j.gols}</td>
            <td class="ranking-partidas">${j.partidas} partidas</td>
        `;
        tbody.appendChild(row);
    });
}

function renderizarRankingAssist(jogadores) {
    const sorted = [...jogadores].sort((a, b) => b.assist - a.assist);
    const tbody = document.getElementById("rankingAssist");
    tbody.innerHTML = "";

    sorted.slice(0, 10).forEach((j, idx) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="ranking-posicao">${idx + 1}</td>
            <td class="ranking-nome">${j.nome}</td>
            <td class="ranking-numero">${j.assist}</td>
            <td class="ranking-partidas">${j.partidas} partidas</td>
        `;
        tbody.appendChild(row);
    });
}

function renderizarRankingNota(jogadores) {
    const comPartidas = jogadores.filter(j => j.partidas > 0);
    const sorted = [...comPartidas].sort((a, b) => b.nota - a.nota);
    const tbody = document.getElementById("rankingNota");
    tbody.innerHTML = "";

    sorted.slice(0, 10).forEach((j, idx) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="ranking-posicao">${idx + 1}</td>
            <td class="ranking-nome">${j.nome}</td>
            <td class="ranking-numero">${j.nota}/10</td>
            <td class="ranking-partidas">${j.partidas} partidas</td>
        `;
        tbody.appendChild(row);
    });
}

function renderizarRankingCartoes(jogadores) {
    const sorted = [...jogadores].sort((a, b) => b.cartoes - a.cartoes);
    const tbody = document.getElementById("rankingCartoes");
    tbody.innerHTML = "";

    sorted.slice(0, 10).forEach((j, idx) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="ranking-posicao">${idx + 1}</td>
            <td class="ranking-nome">${j.nome}</td>
            <td class="ranking-numero">${j.cartoes}</td>
            <td class="ranking-partidas">${j.partidas} partidas</td>
        `;
        tbody.appendChild(row);
    });
}
