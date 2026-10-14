import React, { useState, useEffect } from 'react';
import { Usuario } from '../types';
import { formatarCPF } from '../utils/formatters';
import {
  Search,
  Users,
  Building2,
  Scale,
  Clock,
  Camera,
  Smartphone,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string, idParam?: number) => void;
  onSelecionarApenado: (u: Usuario) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelecionarApenado,
}) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [resultados, setResultados] = useState<Usuario[]>([]);
  const [stats, setStats] = useState({
    totalApenados: 0,
    totalPenas: 0,
    totalInstituicoes: 0,
    totalPontos: 0,
  });

  const carregarDados = async () => {
    try {
      const resUsers = await fetch('/api/v1/usuarios');
      if (resUsers.ok) {
        const data = await resUsers.json();
        setUsuarios(data);
        setStats(prev => ({ ...prev, totalApenados: data.length }));
      }
      const resInst = await fetch('/api/v1/instituicoes');
      if (resInst.ok) {
        const insts = await resInst.json();
        setStats(prev => ({ ...prev, totalInstituicoes: insts.length }));
      }
      const resPenas = await fetch('/api/v1/penas');
      if (resPenas.ok) {
        const penas = await resPenas.json();
        setStats(prev => ({ ...prev, totalPenas: penas.length }));
      }
    } catch (e) {
      console.warn('Erro ao carregar dados:', e);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    const termo = termoBusca.trim().toLowerCase();
    const termoNum = termo.replace(/\D/g, '');

    if (!termo) {
      setResultados([]);
      return;
    }

    const filtrados = usuarios.filter(u => {
      const cpfLimpo = u.cpf.replace(/\D/g, '');
      if (termoNum && cpfLimpo.includes(termoNum)) return true;
      if (u.nome.toLowerCase().includes(termo)) return true;
      if (u.codigo && u.codigo.toLowerCase().includes(termo)) return true;
      return false;
    });

    setResultados(filtrados);
    if (filtrados.length === 1) {
      onSelecionarApenado(filtrados[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Banner Header mirroring buscaCadastroView.fxml */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">CPMA</h1>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
          Central de Penas e Medidas Alternativas - Votorantim
        </p>
        <h2 className="text-2xl font-bold text-slate-800">Busca e Cadastro</h2>
      </div>

      {/* Quick Search Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-2xl mx-auto">
        <form onSubmit={handleBuscar} className="space-y-4">
          <label className="block text-sm font-bold text-slate-700 text-center">
            Buscar Apenado por Nome ou CPF
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={termoBusca}
                onChange={(e) => {
                  setTermoBusca(e.target.value);
                  if (!e.target.value) setResultados([]);
                }}
                placeholder="Digite o nome, código ou CPF para buscar..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-2xs font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </button>
          </div>
        </form>

        {/* Results dropdown list if multiple */}
        {resultados.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Resultados Encontrados ({resultados.length}):
            </p>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {resultados.map((u) => (
                <div
                  key={u.id_usuario}
                  onClick={() => onSelecionarApenado(u)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 cursor-pointer border border-transparent hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0">
                      {u.foto ? (
                        <img src={u.foto} alt={u.nome} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                          {u.nome.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{u.nome}</p>
                      <p className="text-xs text-slate-500">CPF: {formatarCPF(u.cpf)} • Cód: {u.codigo}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gerenciar Dados Grid mirroring original JavaFX Management Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 text-center">Gerenciar Dados</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card Apenados */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Apenados</h4>
              <p className="text-xs text-slate-500 mt-0.5">Cadastro e dados cadastrais</p>
            </div>
            <div className="flex space-x-2 w-full pt-1">
              <button
                onClick={() => onNavigate('usuarios', -1)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                ➕ Novo
              </button>
              <button
                onClick={() => onNavigate('usuarios')}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-300"
              >
                ✏️ Editar
              </button>
            </div>
          </div>

          {/* Card Instituições */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Instituições</h4>
              <p className="text-xs text-slate-500 mt-0.5">Parceiras e disponibilidades</p>
            </div>
            <div className="flex space-x-2 w-full pt-1">
              <button
                onClick={() => onNavigate('instituicoes', -1)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                ➕ Nova
              </button>
              <button
                onClick={() => onNavigate('instituicoes')}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-300"
              >
                ✏️ Editar
              </button>
            </div>
          </div>

          {/* Card Penas */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Penas</h4>
              <p className="text-xs text-slate-500 mt-0.5">Controle de horas e prazos</p>
            </div>
            <div className="flex space-x-2 w-full pt-1">
              <button
                onClick={() => onNavigate('penas', -1)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                ➕ Nova
              </button>
              <button
                onClick={() => onNavigate('penas')}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-300"
              >
                ✏️ Editar
              </button>
            </div>
          </div>

          {/* Card Pontos */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Pontos</h4>
              <p className="text-xs text-slate-500 mt-0.5">Registros de trabalho cumpridos</p>
            </div>
            <div className="flex space-x-2 w-full pt-1">
              <button
                onClick={() => onNavigate('pontos', -1)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                ➕ Novo
              </button>
              <button
                onClick={() => onNavigate('pontos')}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-300"
              >
                ✏️ Editar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Special Feature Banners: Totem Kiosk & Facial Recognition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Totem Kiosk Terminal Banner */}
        <div
          onClick={() => onNavigate('totem')}
          className="bg-linear-to-r from-slate-900 to-blue-950 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all group flex items-center justify-between"
        >
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-2xs font-bold rounded-full uppercase">
              Autoatendimento
            </span>
            <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
              Totem Kiosk do Apenado
            </h4>
            <p className="text-xs text-slate-300 max-w-xs">
              Simule o terminal com teclado PIN de 6 dígitos e reconhecimento facial para registro de presença.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 flex items-center justify-center shrink-0 ml-4 group-hover:scale-110 transition-transform">
            <Smartphone className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        {/* Biometria Facial Direct */}
        <div
          onClick={() => onNavigate('facial')}
          className="bg-linear-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all group flex items-center justify-between"
        >
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 bg-white/20 text-blue-100 border border-white/20 text-2xs font-bold rounded-full uppercase">
              Biometria IA
            </span>
            <h4 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
              Identificação Facial
            </h4>
            <p className="text-xs text-blue-100/90 max-w-xs">
              Detecção em tempo real via webcam ou upload com matching biométrico dos apenados.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 ml-4 group-hover:scale-110 transition-transform">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Auditoria & Estatísticas */}
        <div
          onClick={() => onNavigate('auditoria')}
          className="bg-linear-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all group flex items-center justify-between"
        >
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 bg-white/20 text-emerald-200 border border-white/20 text-2xs font-bold rounded-full uppercase">
              Conformidade
            </span>
            <h4 className="text-lg font-bold text-white group-hover:text-emerald-200 transition-colors">
              Auditoria de Acessos
            </h4>
            <p className="text-xs text-emerald-100/90 max-w-xs">
              Logs detalhados de tentativas no Totem Kiosk com taxas de sucesso e horários.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 ml-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
          </div>
        </div>
      </div>
    </div>
  );
};
