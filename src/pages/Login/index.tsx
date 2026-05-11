import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import './styles.css';

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
    <div className="login-page">
      <div className="login-bg-effects">
        <div className="login-bg-glow-primary"></div>
        <div className="login-bg-glow-blue"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card-wrapper"
      >
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon-wrapper">
              <ShieldCheck className="login-icon" strokeWidth={2.5} />
            </div>
            <h1 className="login-title">EPI Control</h1>
            <p className="login-subtitle">Gestão Inteligente de Segurança do Trabalho</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field-group">
              <label className="login-label">Ambiente</label>
              <div className="login-input-wrapper">
                <Building2 className="login-input-icon" />
                <input 
                  type="text" 
                  value={ambiente}
                  onChange={(e) => setAmbiente(e.target.value)}
                  placeholder="EX: MOBCODE" 
                  className="login-input"
                  required
                />
              </div>
            </div>

            <div className="login-field-group">
              <label className="login-label">Usuário</label>
              <div className="login-input-wrapper">
                <User className="login-input-icon" />
                <input 
                  type="text" 
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Seu usuário" 
                  className="login-input"
                  required
                />
              </div>
            </div>

            <div className="login-field-group">
              <label className="login-label">Senha</label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" />
                <input 
                  type="password" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••" 
                  className="login-input"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="login-error"
              >
                <AlertCircle className="login-error-icon" />
                <span>{error}</span>
              </motion.div>
            )}

            <button 
              type="submit"
              className="login-submit-btn"
            >
              Acessar Sistema 
            </button>
          </form>

          <div className="login-forgot-wrapper">
            <p className="login-forgot-text">
              Esqueceu sua senha? <button className="login-forgot-link">Recuperar acesso</button>
            </p>
          </div>
        </div>

        <div className="login-copyright-wrapper">
          <p className="login-copyright-text">
            © 2026 MOBCODE - Todos os direitos reservados
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
