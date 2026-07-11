// ===========================================
// Autenticação
// ===========================================

const Auth = {

    async login(email, password) {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email,
                password

            });

        if (error)
            throw error;

        return data.user;

    },

    async register(user) {

        const { data, error } =
            await supabaseClient.auth.signUp({

                email: user.email,

                password: user.password

            });

        if (error)
            throw error;

        const { error: profileError } =
            await supabaseClient

                .from("profiles")

                .insert({

                    id: data.user.id,

                    nome: user.nome,

                    apelido: user.apelido,

                    email: user.email,

                    telefone: user.telefone,

                    idade: user.idade,

                    posicao: user.posicao,

                    plano: user.plano

                });

        if (profileError)
            throw profileError;

        return data.user;

    },

    async logout() {

        await supabaseClient.auth.signOut();

        window.location = "index.html";

    },

    async recoverPassword(email) {

        const { error } =
            await supabaseClient.auth.resetPasswordForEmail(email);

        if (error)
            throw error;

    },

    async getUser() {

        const {

            data: { user }

        } = await supabaseClient.auth.getUser();

        return user;

    },

    async isLogged() {

        const {

            data: { session }

        } = await supabaseClient.auth.getSession();

        return session !== null;

    },

    async requireLogin() {

        const ok = await this.isLogged();

        if (!ok) {

            window.location = "index.html";

            return;

        }

    }

};