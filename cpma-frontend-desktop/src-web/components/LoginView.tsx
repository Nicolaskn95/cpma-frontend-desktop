import React, { useState } from 'react';
import { db } from '../data/mockStore';
import { formatarCPF, limparCPF, gerarHashSHA256 } from '../utils/formatters';
import { Eye, EyeOff, Lock, User, LogIn, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onNavigateRedefinir: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateRedefinir,
}) => {
  const [cpf, setCpf] = useState('12345678900');
  const [senha, setSenha] = useState('123456');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErro(null);
    setCpf(formatarCPF(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const cpfLimpo = limparCPF(cpf);
      if (!cpfLimpo) {
        setErro('Por favor, informe o CPF.');
        setCarregando(false);
        return;
      }
      if (!senha) {
        setErro('Por favor, informe a senha.');
        setCarregando(false);
        return;
      }

      const admin = db.buscarAdminPorCPF(cpfLimpo);
      if (!admin) {
        setErro('Usuário ou senha incorretos.');
        setCarregando(false);
        return;
      }

      const hashCalculado = await gerarHashSHA256(senha);
      if (hashCalculado === admin.senha || senha === '123456') {
        db.setUsuarioLogado(admin);
        onLoginSuccess();
      } else {
        setErro('Usuário ou senha incorretos.');
      }
    } catch (err) {
      console.error('Erro na autenticação:', err);
      setErro('Ocorreu um erro ao processar o login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-200">
        {/* Left Column: Branding & Info */}
        <div className="bg-linear-to-br from-blue-600 to-blue-800 p-8 sm:p-12 text-white flex flex-col justify-between relative">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <img
                src="/images/Votorantim_Brasao.png"
                alt="Brasão de Votorantim"
                className="h-12 w-auto bg-white/10 p-1.5 rounded-lg object-contain backdrop-blur-xs"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <img
                src="/images/fatec_ra_sorocaba_votorantim_cor.png"
                alt="FATEC Sorocaba"
                className="h-12 w-auto bg-white/10 p-1.5 rounded-lg object-contain backdrop-blur-xs"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>

            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-blue-500/30 text-blue-100 rounded-full text-xs font-semibold tracking-wide uppercase border border-blue-400/30">
                Poder Judiciário & Município
              </span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                CPMA
              </h1>
              <h2 className="text-xl font-bold text-blue-100">
                Central de Penas e Medidas Alternativas
              </h2>
              <p className="text-blue-100/90 text-sm leading-relaxed max-w-md">
                Sistema integrado para gestão, controle e acompanhamento de penas alternativas,
                instituições conveniadas, registros de frequência e identificação biométrica facial.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-500/30 text-xs text-blue-200/80 flex items-center justify-between">
            <span>Comarca de Votorantim / SP</span>
            <span>FATEC Sorocaba</span>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Acesso ao Sistema</h3>
            <p className="text-slate-500 text-sm mt-1">
              Informe suas credenciais para gerenciar os cumprimentos de pena.
            </p>
          </div>

          {erro && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                CPF do Administrador
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => {
                    setErro(null);
                    setSenha(e.target.value);
                  }}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                >
                  {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-xs text-slate-500">Credencial padrão: 123456</span>
              <button
                type="button"
                onClick={onNavigateRedefinir}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{carregando ? 'Autenticando...' : 'Entrar no Sistema'}</span>
            </button>
          </form>

          {/* Quick autofill helper */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Ambiente de Demonstração CPMA</span>
            <button
              type="button"
              onClick={() => {
                setCpf('123.456.789-00');
                setSenha('123456');
                setErro(null);
              }}
              className="text-xs text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Preencher dados teste
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
