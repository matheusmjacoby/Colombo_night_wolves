// =========================================
// API - Consultas ao Supabase
// =========================================

const API = {

    async getProfile(userId) {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) throw error;

        return data;
    },

    async updateProfile(userId, values) {
        const { error } = await supabaseClient
            .from("profiles")
            .update(values)
            .eq("id", userId);

        if (error) throw error;
    },

    async getCurrentGame() {
        const { data, error } = await supabaseClient
            .from("games")
            .select("*")
            .eq("status", "Aberto")
            .order("data_jogo", { ascending: true })
            .limit(1)
            .single();

        if (error) return null;

        return data;
    },

    async getAttendance(gameId) {
        const { data, error } = await supabaseClient
            .from("attendance")
            .select(`
                *,
                profiles (
                    nome,
                    apelido,
                    posicao
                )
            `)
            .eq("game_id", gameId);

        if (error) throw error;

        return data;
    },

    async confirmAttendance(gameId, confirmed) {
        const { data: { user } } = await supabaseClient.auth.getUser();

        const { error } = await supabaseClient
            .from("attendance")
            .upsert(
                {
                    game_id: gameId,
                    player_id: user.id,
                    confirmado: confirmed
                },
                {
                    onConflict: ["game_id", "player_id"]
                }
            );

        if (error) throw error;
    },

    async getSettings() {
        const { data, error } = await supabaseClient
            .from("settings")
            .select("*")
            .eq("id", 1)
            .single();

        if (error) throw error;

        return data;
    },

    async getCashBalance() {
        const { data, error } = await supabaseClient
            .from("caixa")
            .select("*")
            .single();

        if (error) return { saldo: 0 };

        return data;
    },

    async getAllPlayers() {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("ativo", true)
            .order("nome");

        if (error) throw error;

        return data;
    },

    async getAllGames() {
        const { data, error } = await supabaseClient
            .from("games")
            .select("*")
            .order("data_jogo", { ascending: false });

        if (error) throw error;

        return data;
    },

    async getStatistics(jogadorId) {
        const { data, error } = await supabaseClient
            .from("statistics")
            .select("*")
            .eq("jogador_id", jogadorId);

        if (error) throw error;

        return data;
    },

    async addStatistics(stats) {
        const { error } = await supabaseClient
            .from("statistics")
            .insert(stats);

        if (error) throw error;
    },

    async getGameStats(gameId) {
        const { data, error } = await supabaseClient
            .from("statistics")
            .select(`
                *,
                profiles (nome, posicao)
            `)
            .eq("partida_id", gameId);

        if (error) throw error;

        return data;
    }

};
