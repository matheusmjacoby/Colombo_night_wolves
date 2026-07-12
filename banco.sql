-- ============================================================
-- COLOMBO NIGHT WOLVES - Database Schema
-- PostgreSQL / Supabase
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS (Tipos)
-- ============================================================

CREATE TYPE player_position AS ENUM (
    'Goleiro',
    'Zagueiro',
    'Ala Esquerda',
    'Ala Direita',
    'Meio Campo',
    'Atacante'
);

CREATE TYPE player_plan AS ENUM (
    'Mensalista',
    'Avulso'
);

CREATE TYPE payment_status AS ENUM (
    'Pago',
    'Pendente'
);

-- ============================================================
-- TABELA: PROFILES (Usuários/Jogadores)
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    apelido TEXT,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT,
    idade INTEGER,
    posicao player_position,
    nota INTEGER DEFAULT 5,
    plano player_plan DEFAULT 'Mensalista',
    mensalidade payment_status DEFAULT 'Pendente',
    is_admin BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    foto TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: GAMES (Partidas)
-- ============================================================

CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_jogo DATE NOT NULL,
    hora TIME,
    adversario TEXT NOT NULL,
    local TEXT,
    gols_colombo INTEGER DEFAULT 0,
    gols_adversario INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Aberto',
    observacao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: ATTENDANCE (Presenças)
-- ============================================================

CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    confirmado BOOLEAN DEFAULT FALSE,
    time TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(game_id, player_id)
);

-- ============================================================
-- TABELA: STATISTICS (Estatísticas por Jogador/Partida)
-- ============================================================

CREATE TABLE IF NOT EXISTS statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jogador_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    partida_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    gols INTEGER DEFAULT 0,
    assistencias INTEGER DEFAULT 0,
    cartao_amarelo INTEGER DEFAULT 0,
    cartao_vermelho INTEGER DEFAULT 0,
    nota_jogo DECIMAL(3,1) DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(jogador_id, partida_id)
);

-- ============================================================
-- TABELA: PAYMENTS (Pagamentos de Mensalidades)
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    valor DECIMAL(10,2) NOT NULL,
    referencia DATE NOT NULL,
    forma_pagamento TEXT,
    observacao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: CAIXA (Transações Financeiras)
-- ============================================================

CREATE TABLE IF NOT EXISTS cash_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo TEXT NOT NULL,
    descricao TEXT,
    valor DECIMAL(10,2) NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABELA: SETTINGS (Configurações do Time)
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    nome_time TEXT DEFAULT 'Colombo Night Wolves',
    valor_mensalidade DECIMAL(10,2) DEFAULT 85.00,
    valor_avulso DECIMAL(10,2) DEFAULT 25.00,
    pix TEXT,
    logo TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VIEWS
-- ============================================================

CREATE OR REPLACE VIEW caixa AS
SELECT
    COALESCE(
        SUM(
            CASE
                WHEN tipo = 'Entrada'
                THEN valor
                ELSE -valor
            END
        ), 0
    ) AS saldo
FROM cash_transactions;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES (Segurança)
-- ============================================================

-- Profiles - Leitura pública
CREATE POLICY "Todos podem ver perfis"
ON profiles
FOR SELECT
USING (TRUE);

-- Profiles - Editar próprio perfil
CREATE POLICY "Usuário edita seu perfil"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Profiles - Admin tem acesso total
CREATE POLICY "Admins têm acesso total aos perfis"
ON profiles
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.is_admin = TRUE
    )
);

-- Games - Todos podem ler
CREATE POLICY "Todos podem ver partidas"
ON games
FOR SELECT
USING (TRUE);

-- Games - Admin cria/edita
CREATE POLICY "Admins gerenciam partidas"
ON games
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.is_admin = TRUE
    )
);

-- Attendance - Todos podem ler
CREATE POLICY "Todos podem ver presenças"
ON attendance
FOR SELECT
USING (TRUE);

-- Attendance - Usuário confirma própria presença
CREATE POLICY "Usuário confirma própria presença"
ON attendance
FOR INSERT
WITH CHECK (player_id = auth.uid());

-- Attendance - Usuário edita própria presença
CREATE POLICY "Usuário edita própria presença"
ON attendance
FOR UPDATE
USING (player_id = auth.uid())
WITH CHECK (player_id = auth.uid());

-- Statistics - Todos podem ler
CREATE POLICY "Todos podem ver estatísticas"
ON statistics
FOR SELECT
USING (TRUE);

-- Statistics - Admin gerencia
CREATE POLICY "Admins gerenciam estatísticas"
ON statistics
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.is_admin = TRUE
    )
);

-- Settings - Todos podem ler
CREATE POLICY "Todos podem ver configurações"
ON settings
FOR SELECT
USING (TRUE);

-- Settings - Admin edita
CREATE POLICY "Admins editam configurações"
ON settings
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.is_admin = TRUE
    )
);

-- ============================================================
-- DATA INICIAL
-- ============================================================

-- Inserir configurações padrão
INSERT INTO settings (id, nome_time, valor_mensalidade, valor_avulso)
VALUES (1, 'Colombo Night Wolves', 85.00, 25.00)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ÍNDICES (Performance)
-- ============================================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_ativo ON profiles(ativo);
CREATE INDEX idx_games_data ON games(data_jogo);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_attendance_game ON attendance(game_id);
CREATE INDEX idx_attendance_player ON attendance(player_id);
CREATE INDEX idx_statistics_jogador ON statistics(jogador_id);
CREATE INDEX idx_statistics_partida ON statistics(partida_id);
CREATE INDEX idx_payments_player ON payments(player_id);
CREATE INDEX idx_payments_data ON payments(referencia);

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
