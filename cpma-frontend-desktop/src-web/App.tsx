import React, { useState, useEffect } from 'react';
import { Administrador, Usuario } from './types';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { RedefinirSenhaView } from './components/RedefinirSenhaView';
import { DashboardView } from './components/DashboardView';
import { DetalheApenadoView } from './components/DetalheApenadoView';
import { CadastroUsuarioView } from './components/CadastroUsuarioView';
import { CadastroInstituicaoView } from './components/CadastroInstituicaoView';
import { CadastroPenaView } from './components/CadastroPenaView';
import { CadastroRegistroDeTrabalhoView } from './components/CadastroRegistroDeTrabalhoView';
import { IdentificacaoFacialView } from './components/IdentificacaoFacialView';
import { TotemKioskView } from './components/TotemKioskView';
import { AuditoriaView } from './components/AuditoriaView';

export const App: React.FC = () => {
  const [adminLogado, setAdminLogado] = useState<Administrador | null>(null);
  const [telaLogin, setTelaLogin] = useState<'login' | 'redefinir'>('login');
  const [viewAtual, setViewAtual] = useState<string>('dashboard');
  const [apenadoSelecionado, setApenadoSelecionado] = useState<Usuario | null>(null);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | null>(null);
  const [idUsuarioPreSelecionado, setIdUsuarioPreSelecionado] = useState<number | undefined>();

  // Initialize session or default demo admin
  useEffect(() => {
    const saved = localStorage.getItem('cpma_admin_session');
    if (saved) {
      try {
        setAdminLogado(JSON.parse(saved));
      } catch (e) {
        console.warn('Session parse error:', e);
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    const admin: Administrador = {
      id_admin: 1,
      nome: 'Administrador Geral',
      cpf: '12345678900',
      senha: '',
      nivel_permissao: 1,
      criado_em: new Date().toISOString(),
    };
    setAdminLogado(admin);
    localStorage.setItem('cpma_admin_session', JSON.stringify(admin));
    setViewAtual('dashboard');
  };

  const handleLogout = () => {
    setAdminLogado(null);
    localStorage.removeItem('cpma_admin_session');
    setViewAtual('dashboard');
  };

  const handleNavigate = (view: string, idParam?: number) => {
    if (view === 'usuarios' && idParam === -1) {
      setUsuarioParaEditar(null);
    }
    setViewAtual(view);
  };

  const handleSelecionarApenado = (u: Usuario) => {
    setApenadoSelecionado(u);
    setViewAtual('detalhe');
  };

  const handleEditarApenado = (u: Usuario) => {
    setUsuarioParaEditar(u);
    setViewAtual('usuarios');
  };

  const handleNovoPonto = (idUsuario: number) => {
    setIdUsuarioPreSelecionado(idUsuario);
    setViewAtual('pontos');
  };

  const handleNovaPena = (idUsuario: number) => {
    setIdUsuarioPreSelecionado(idUsuario);
    setViewAtual('penas');
  };

  // If Totem Kiosk is active, render full-screen kiosk interface without standard navbar
  if (viewAtual === 'totem') {
    return <TotemKioskView onSairKiosk={() => setViewAtual('dashboard')} />;
  }

  // If not logged in, render login or password reset
  if (!adminLogado) {
    if (telaLogin === 'redefinir') {
      return <RedefinirSenhaView onVoltar={() => setTelaLogin('login')} />;
    }
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        onNavigateRedefinir={() => setTelaLogin('redefinir')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        admin={adminLogado}
        currentView={viewAtual}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="flex-1 pb-16">
        {viewAtual === 'dashboard' && (
          <DashboardView
            onNavigate={handleNavigate}
            onSelecionarApenado={handleSelecionarApenado}
          />
        )}

        {viewAtual === 'detalhe' && apenadoSelecionado && (
          <DetalheApenadoView
            usuario={apenadoSelecionado}
            onVoltar={() => setViewAtual('dashboard')}
            onEditarUsuario={handleEditarApenado}
            onNovoPonto={handleNovoPonto}
            onNovaPena={handleNovaPena}
          />
        )}

        {viewAtual === 'usuarios' && (
          <CadastroUsuarioView
            usuarioParaEditar={usuarioParaEditar}
            onVoltar={() => setViewAtual('dashboard')}
            onSalvo={() => {
              setUsuarioParaEditar(null);
            }}
          />
        )}

        {viewAtual === 'instituicoes' && (
          <CadastroInstituicaoView onVoltar={() => setViewAtual('dashboard')} />
        )}

        {viewAtual === 'penas' && (
          <CadastroPenaView
            idUsuarioPreSelecionado={idUsuarioPreSelecionado}
            onVoltar={() => setViewAtual('dashboard')}
          />
        )}

        {viewAtual === 'pontos' && (
          <CadastroRegistroDeTrabalhoView
            idUsuarioPreSelecionado={idUsuarioPreSelecionado}
            onVoltar={() => setViewAtual('dashboard')}
          />
        )}

        {viewAtual === 'facial' && (
          <IdentificacaoFacialView
            onVoltar={() => setViewAtual('dashboard')}
            onAbrirDetalhe={handleSelecionarApenado}
          />
        )}

        {viewAtual === 'auditoria' && (
          <AuditoriaView onVoltar={() => setViewAtual('dashboard')} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CPMA — Centro de Penas e Medidas Alternativas • Município de Votorantim / SP</span>
          <span>Desenvolvido em parceria com a FATEC Sorocaba</span>
        </div>
      </footer>
    </div>
  );
};
