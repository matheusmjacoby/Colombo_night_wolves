// ========================================
// Página de Jogadores
// ========================================

let allJogadores = [];

(async () => {
    await loadSession();
    await carregarJogadores();
    bindEventos();
})();

async function carregarJogadores() {
    try {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("*")
            .order("nome");

        if (error) throw error;

        allJogadores = data || [];
        renderizarJogadores(allJogadores);
    } catch (e) {
        console.error("Erro ao carregar jogadores:", e);
        document.getElementById("jogadoresGrid").innerHTML = "<p>Erro ao carregar jogadores</p>";
    }
}

function renderizarJogadores(jogadores) {
    const grid = document.getElementById("jogadoresGrid");
    grid.innerHTML = "";

    if (jogadores.length === 0) {
        grid.innerHTML = "<p style='grid-column:1/-1;text-align:center;color:var(--text2)'>Nenhum jogador encontrado</p>";
        return;
    }

    jogadores.forEach(j => {
        const card = document.createElement("div");
        card.className = "jogador-card";
        card.innerHTML = `
            <div class="jogador-foto">👤</div>
            <div class="jogador-info">
                <div class="jogador-nome">${j.nome}</div>
                ${j.apelido ? `<div class="jogador-apelido">"${j.apelido}"</div>` : ""}
                <div class="jogador-detalhes">
                    <div><strong>Posição:</strong> ${j.posicao || "Não definida"}</div>
                    <div><strong>Plano:</strong> ${j.plano}</div>
                    ${j.nota ? `<div><strong>Nota:</strong> ${j.nota}/10</div>` : ""}
                </div>
                <div class="jogador-status ${j.ativo ? 'status-ativo' : 'status-inativo'}">
                    ${j.ativo ? '✓ Ativo' : '✗ Inativo'}
                </div>
                <div class="jogador-actions">
                    <button class="btn-editar" onclick="editarJogador('${j.id}')">Editar</button>
                    <button class="btn-deletar" onclick="deletarJogador('${j.id}')">Remover</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function bindEventos() {
    document.getElementById("novoJogador").onclick = () => {
        document.getElementById("modalJogador").classList.add("show");
        document.getElementById("formJogador").reset();
    };

    document.getElementById("formJogador").onsubmit = async (e) => {
        e.preventDefault();
        await salvarJogador();
    };

    document.getElementById("searchJogador").oninput = filtrar;
    document.getElementById("filterPosicao").onchange = filtrar;
    document.getElementById("filterStatus").onchange = filtrar;
}

function filtrar() {
    const search = document.getElementById("searchJogador").value.toLowerCase();
    const posicao = document.getElementById("filterPosicao").value;
    const status = document.getElementById("filterStatus").value;

    let filtered = allJogadores;

    if (search) {
        filtered = filtered.filter(j => 
            j.nome.toLowerCase().includes(search) || 
            (j.apelido && j.apelido.toLowerCase().includes(search))
        );
    }

    if (posicao) {
        filtered = filtered.filter(j => j.posicao === posicao);
    }

    if (status !== "") {
        const statusBool = status === "true";
        filtered = filtered.filter(j => j.ativo === statusBool);
    }

    renderizarJogadores(filtered);
}

async function salvarJogador() {
    const nome = document.getElementById("inputNome").value;
    const apelido = document.getElementById("inputApelido").value;
    const posicao = document.getElementById("inputPosicao").value;
    const numero = document.getElementById("inputNumero").value;
    const email = document.getElementById("inputEmail").value;
    const telefone = document.getElementById("inputTelefone").value;
    const plano = document.getElementById("inputPlano").value;

    try {
        // Gerar um ID simples para o novo jogador
        const userId = `jogador_${Date.now()}`;

        const { error } = await supabaseClient
            .from("profiles")
            .insert({
                id: userId,
                nome,
                apelido,
                posicao,
                email,
                telefone,
                plano,
                ativo: true,
                nota: 5
            });

        if (error) throw error;

        fecharModal();
        await carregarJogadores();
        alert("Jogador adicionado com sucesso!");
    } catch (e) {
        alert("Erro ao salvar jogador: " + e.message);
    }
}

async function editarJogador(id) {
    const jogador = allJogadores.find(j => j.id === id);
    if (!jogador) return;

    document.getElementById("inputNome").value = jogador.nome;
    document.getElementById("inputApelido").value = jogador.apelido || "";
    document.getElementById("inputPosicao").value = jogador.posicao || "";
    document.getElementById("inputEmail").value = jogador.email || "";
    document.getElementById("inputTelefone").value = jogador.telefone || "";
    document.getElementById("inputPlano").value = jogador.plano;

    const form = document.getElementById("formJogador");
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        try {
            const { error } = await supabaseClient
                .from("profiles")
                .update({
                    nome: document.getElementById("inputNome").value,
                    apelido: document.getElementById("inputApelido").value,
                    posicao: document.getElementById("inputPosicao").value,
                    email: document.getElementById("inputEmail").value,
                    telefone: document.getElementById("inputTelefone").value,
                    plano: document.getElementById("inputPlano").value
                })
                .eq("id", id);

            if (error) throw error;

            fecharModal();
            await carregarJogadores();
            alert("Jogador atualizado com sucesso!");
        } catch (e) {
            alert("Erro ao atualizar: " + e.message);
        }
    };

    document.getElementById("modalJogador").classList.add("show");
}

async function deletarJogador(id) {
    if (!confirm("Tem certeza que deseja remover este jogador?")) return;

    try {
        const { error } = await supabaseClient
            .from("profiles")
            .update({ ativo: false })
            .eq("id", id);

        if (error) throw error;

        await carregarJogadores();
        alert("Jogador removido com sucesso!");
    } catch (e) {
        alert("Erro ao remover: " + e.message);
    }
}

function fecharModal() {
    document.getElementById("modalJogador").classList.remove("show");
}

// Fechar modal ao clicar fora
window.onclick = (event) => {
    const modal = document.getElementById("modalJogador");
    if (event.target === modal) {
        modal.classList.remove("show");
    }
};
