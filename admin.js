// =========================================
// Admin Controller
// =========================================

(async() => {

await loadSession();

if(!currentProfile.is_admin) {

window.location = "dashboard.html";
return;

}

loadPlayers();
bindTabs();

})();

function bindTabs() {

document.querySelectorAll(".menu-btn").forEach(btn => {

btn.onclick = () => {

document.querySelectorAll(".menu-btn").forEach(b => b.classList.remove("active"));

document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));

btn.classList.add("active");

document.getElementById(btn.dataset.tab).classList.add("active");

};

});

}

async function loadPlayers() {

const { data, error } = await supabaseClient
.from("profiles")
.select("*")
.order("nome");

if(error) {

console.log(error);
return;

}

const tbody = document.getElementById("playersTable");
tbody.innerHTML = "";

data.forEach(player => {

tbody.innerHTML += `

<tr>

<td>${player.nome}</td>

<td>${player.posicao || 'N/A'}</td>

<td>${player.plano}</td>

<td>

${player.ativo?

'<span class="badge badge-success">Ativo</span>':

'<span class="badge badge-danger">Inativo</span>'}

</td>

<td>

<button class="action edit" onclick="editPlayer('${player.id}')">Editar</button>

<button class="action delete" onclick="deletePlayer('${player.id}')">Excluir</button>

</td>

</tr>

`;

});

}

async function editPlayer(id) {

alert("Tela de edição será criada na próxima etapa.");

}

async function deletePlayer(id) {

if(!confirm("Excluir jogador?")) return;

const { error } = await supabaseClient
.from("profiles")
.update({ ativo: false })
.eq("id", id);

if(error) {

alert(error.message);
return;

}

loadPlayers();

}

document.getElementById("btnLogout")?.onclick = logout;
