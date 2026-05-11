import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

const Login = () => {
  const { login } = useAuth();
  const [ambiente, setAmbiente] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(ambiente, usuario, senha);
    if (!success) {
      setError('Credenciais inválidas. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-2xl mb-4 shadow-lg shadow-primary-500/20">
              <ShieldCheck className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">EPI Control</h1>
            <p className="text-slate-400 text-sm mt-2">Gestão Inteligente de Segurança do Trabalho</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Ambiente</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={ambiente}
                  onChange={(e) => setAmbiente(e.target.value)}
                  placeholder="EX: MOBCODE" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-2xl text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Usuário</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Seu usuário" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-2xl text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-2xl text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold text-sm hover:bg-primary-600 active:scale-[0.98] transition-all shadow-lg shadow-primary-500/20 mt-4"
            >
              Acessar Sistema 
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-xs">
              Esqueceu sua senha? <button className="text-primary-400 hover:underline font-bold">Recuperar acesso</button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold">
            © 2026 MOBCODE - Todos os direitos reservados
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
