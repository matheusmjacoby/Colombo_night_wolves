// =========================================
// Controle de Sessão
// =========================================

async function loadSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location.href = "index.html";
        return;
    }

    const profile = await API.getProfile(session.user.id);

    window.currentUser = session.user;
    window.currentProfile = profile;
}

async function logout() {
    await Auth.logout();
}

supabaseClient.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
        window.location.href = "index.html";
    }
});
