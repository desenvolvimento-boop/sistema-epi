import React, { useState } from 'react';
import { Mail, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { AppLogo } from '../../components/ui/AppLogo';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import './styles.css';

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch {
      setError('Não foi possível enviar o e-mail. Tente novamente.');
    } finally {
      setLoading(false);
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
            <AppLogo variant="auth" />
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="recuperar-success"
            >
              <div className="recuperar-success-icon-wrapper">
                <CheckCircle className="recuperar-success-icon" />
              </div>
              <h2 className="recuperar-success-title">E-mail enviado!</h2>
              <p className="recuperar-success-text">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
              <button
                type="button"
                className="login-submit-btn"
                onClick={() => navigate('/login')}
              >
                Voltar para o Login
              </button>
            </motion.div>
          ) : (
            <>
              <div className="recuperar-info">
                <h2 className="recuperar-title">Recuperar Senha</h2>
                <p className="recuperar-description">
                  Informe o seu e-mail e enviaremos instruções para redefinir sua senha.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="login-field-group">
                  <div className="login-input-wrapper">
                    <Mail className="login-input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-mail"
                      className="login-input"
                      required
                      disabled={loading}
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
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="login-btn-spinner" />
                  ) : (
                    'Enviar'
                  )}
                </button>
              </form>

              <div className="login-forgot-wrapper">
                <button
                  type="button"
                  className="recuperar-voltar-link"
                  onClick={() => navigate('/login')}
                >
                  Voltar para o Login
                </button>
              </div>
            </>
          )}
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

export default RecuperarSenha;
