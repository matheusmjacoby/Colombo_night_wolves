// ========================================
// Página de Partidas
// ========================================

let allPartidas = [];

(async () => {
    await loadSession();
    await carregarPartidas();
    bindEventos();
})();

async function carregarPartidas() {
    try {
        const { data, error } = await supabaseClient
            .from("games")
            .select("*")
            .order("data_jogo", { ascending: false });

        if (error) throw error;

        allPartidas = data || [];
        renderizarPartidas(allPartidas);
    } catch (e) {
        console.error("Erro ao carregar partidas:", e);
        document.getElementById("partidasList").innerHTML = "<p>Erro ao carregar partidas</p>";
    }
}

function renderizarPartidas(partidas) {
    const lista = document.getElementById("partidasList");
    lista.innerHTML = "";

    if (partidas.length === 0) {
        lista.innerHTML = "<p style='text-align:center;color:var(--text2)'>Nenhuma partida registrada</p>";
        return;
    }

    partidas.forEach(p => {
        const status = getStatusPartida(p);
        const data = new Date(p.data_jogo).toLocaleDateString("pt-BR");
        
        const card = document.createElement("div");
        card.className = "partida-card";
        card.innerHTML = `
            <div class="partida-header">
                <div class="partida-data">${data}</div>
                <div class="partida-status status-${status}">${status.toUpperCase()}</div>
            </div>
            
            <div class="partida-main">
                <div class="time-info">
                    <div class="time-nome">🐺 Colombo</div>
                    <div class="placar">${p.gols_colombo || 0}</div>
                </div>
                <div class="vs-text">VS</div>
                <div class="time-info">
                    <div class="time-nome">${p.adversario}</div>
                    <div class="placar">${p.gols_adversario || 0}</div>
                </div>
            </div>

            <div class="partida-detalhes">
                <div class="detalhe-item"><strong>📍 Local:</strong> ${p.local || "Não definido"}</div>
                <div class="detalhe-item"><strong>🕐 Hora:</strong> ${p.hora || "Não definida"}</div>
                <div class="detalhe-item"><strong>📊 Status:</strong> ${p.status}</div>
            </div>

            ${p.observacao ? `
                <div class="partida-observacao">
                    <strong>Observações:</strong> ${p.observacao}
                </div>
            ` : ""}

            <div class="partida-actions">
                <button class="btn-pequeno btn-stats" onclick="abrirEstatisticas('${p.id}')">Estatísticas</button>
                <button class="btn-pequeno btn-editar" onclick="editarPartida('${p.id}')">Editar</button>
                <button class="btn-pequeno btn-deletar" onclick="deletarPartida('${p.id}')">Deletar</button>
            </div>
        `;
        lista.appendChild(card);
    });
}

function getStatusPartida(partida) {
    if (!partida.gols_colombo || !partida.gols_adversario) return "pendente";
    if (partida.gols_colombo > partida.gols_adversario) return "vitoria";
    if (partida.gols_colombo < partida.gols_adversario) return "derrota";
    return "empate";
}

function bindEventos() {
    document.getElementById("novaPartida").onclick = () => {
        document.getElementById("modalPartida").classList.add("show");
        document.getElementById("formPartida").reset();
    };

    document.getElementById("formPartida").onsubmit = async (e) => {
        e.preventDefault();
        await salvarPartida();
    };

    document.getElementById("searchAdversario").oninput = filtrar;
    document.getElementById("filterAno").onchange = filtrar;
}

function filtrar() {
    const search = document.getElementById("searchAdversario").value.toLowerCase();
    const ano = document.getElementById("filterAno").value;

    let filtered = allPartidas;

    if (search) {
        filtered = filtered.filter(p => 
            p.adversario.toLowerCase().includes(search)
        );
    }

    if (ano) {
        filtered = filtered.filter(p => {
            const year = new Date(p.data_jogo).getFullYear().toString();
            return year === ano;
        });
    }

    renderizarPartidas(filtered);
}

async function salvarPartida() {
    const data_jogo = document.getElementById("inputDataJogo").value;
    const hora = document.getElementById("inputHora").value || null;
    const adversario = document.getElementById("inputAdversario").value;
    const local = document.getElementById("inputLocal").value || null;
    const gols_colombo = parseInt(document.getElementById("inputGolosCN").value) || 0;
    const gols_adversario = parseInt(document.getElementById("inputGolosAdv").value) || 0;
    const observacao = document.getElementById("inputObservacao").value || null;

    try {
        const { error } = await supabaseClient
            .from("games")
            .insert({
                data_jogo,
                hora,
                adversario,
                local,
                gols_colombo,
                gols_adversario,
                observacao,
                status: "Encerrado"
            });

        if (error) throw error;

        fecharModal();
        await carregarPartidas();
        alert("Partida registrada com sucesso!");
    } catch (e) {
        alert("Erro ao salvar partida: " + e.message);
    }
}

async function editarPartida(id) {
    const partida = allPartidas.find(p => p.id === id);
    if (!partida) return;

    document.getElementById("inputDataJogo").value = partida.data_jogo;
    document.getElementById("inputHora").value = partida.hora || "";
    document.getElementById("inputAdversario").value = partida.adversario;
    document.getElementById("inputLocal").value = partida.local || "";
    document.getElementById("inputGolosCN").value = partida.gols_colombo || 0;
    document.getElementById("inputGolosAdv").value = partida.gols_adversario || 0;
    document.getElementById("inputObservacao").value = partida.observacao || "";

    const form = document.getElementById("formPartida");
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        try {
            const { error } = await supabaseClient
                .from("games")
                .update({
                    data_jogo: document.getElementById("inputDataJogo").value,
                    hora: document.getElementById("inputHora").value || null,
                    adversario: document.getElementById("inputAdversario").value,
                    local: document.getElementById("inputLocal").value || null,
                    gols_colombo: parseInt(document.getElementById("inputGolosCN").value) || 0,
                    gols_adversario: parseInt(document.getElementById("inputGolosAdv").value) || 0,
                    observacao: document.getElementById("inputObservacao").value || null
                })
                .eq("id", id);

            if (error) throw error;

            fecharModal();
            await carregarPartidas();
            alert("Partida atualizada com sucesso!");
        } catch (e) {
            alert("Erro ao atualizar: " + e.message);
        }
    };

    document.getElementById("modalPartida").classList.add("show");
}

async function deletarPartida(id) {
    if (!confirm("Tem certeza que deseja remover esta partida?")) return;

    try {
        const { error } = await supabaseClient
            .from("games")
            .delete()
            .eq("id", id);

        if (error) throw error;

        await carregarPartidas();
        alert("Partida removida com sucesso!");
    } catch (e) {
        alert("Erro ao remover: " + e.message);
    }
}

async function abrirEstatisticas(gameId) {
    try {
        const { data, error } = await supabaseClient
            .from("attendance")
            .select(`
                *,
                profiles (
                    nome,
                    posicao
                )
            `)
            .eq("game_id", gameId);

        if (error) throw error;

        const html = data.map(a => `
            <div style="padding:10px;border-bottom:1px solid var(--border)">
                <div><strong>${a.profiles.nome}</strong> - ${a.profiles.posicao || 'Não definida'}</div>
                <div style="font-size:12px;color:var(--text2)">
                    ${a.confirmado ? '✓ Confirmado' : '✗ Não confirmou'}
                </div>
            </div>
        `).join("");

        document.getElementById("estatisticasContent").innerHTML = html || "<p>Nenhuma presença registrada</p>";
        document.getElementById("modalEstatisticas").classList.add("show");
    } catch (e) {
        alert("Erro ao carregar estatísticas: " + e.message);
    }
}

function fecharModal() {
    document.getElementById("modalPartida").classList.remove("show");
    document.getElementById("modalEstatisticas").classList.remove("show");
}

window.onclick = (event) => {
    const modalPartida = document.getElementById("modalPartida");
    const modalEstat = document.getElementById("modalEstatisticas");
    if (event.target === modalPartida) {
        modalPartida.classList.remove("show");
    }
    if (event.target === modalEstat) {
        modalEstat.classList.remove("show");
    }
};
