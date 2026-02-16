
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlocLogo } from '../src/components/FlocLogo';

import { authService } from '../services/authService';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'google' | 'protocol' | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { debugLogin } = useUser();

  const performLogin = async (method: 'google' | 'protocol') => {
    setError(null);
    if (!isSupabaseConfigured) {
      setError("Application is missing API Keys. Please check your .env file and restart the server.");
      return;
    }

    setLoginMethod(method);
    setIsLoggingIn(true);

    try {
      let result;
      if (method === 'google') {
        result = await authService.signInWithGoogle();
      } else {
        // Fallback or explicit handling for protocol
        result = await authService.signInWithProtocol();
      }

      if (result.error) throw result.error;
      // Note: Google login will redirect the browser.
      // Protocol login will currently throw error as unimplemented.
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Authentication failed. Please try again.');
      setIsLoggingIn(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Application is missing API Keys. Please check your .env file and restart the server.");
      return;
    }

    setLoginMethod('email');
    setIsLoggingIn(true);

    try {
      const { error } = await authService.signInWithEmail(email);
      if (error) throw error;
      setMagicLinkSent(true);
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.message && err.message.includes('rate limit')) {
        setError('Email rate limit exceeded. Please wait a bit or use Development Login.');
      } else {
        setError(err.message || 'Failed to send magic link. Please check your Supabase config.');
      }
      setIsLoggingIn(false);
    }
  };

  const handleDevLogin = async () => {
    setLoginMethod('dev');
    setIsLoggingIn(true);

    try {
      // 1. Try Anonymous Login first (Preferred if enabled)
      const { error: anonError } = await authService.signInAnonymously();
      if (!anonError) {
        setTimeout(() => navigate('/dashboard'), 500);
        return;
      }

      console.warn('Anonymous login failed given project settings, using Master Dev Account:', anonError);

      // 2. Use Fixed Master Dev Account
      // We use a fixed email to reuse the SAME account instead of creating new ones.
      const email = 'dev-master-final@example.com';
      const password = 'dev-password-123';

      // ONLY Try signing in. DO NOT Auto-Sign Up (this causes Rate Limits).
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('Master Dev Account Login Failed:', signInError);

        if (signInError.message.includes('Invalid login credentials')) {
          // User needs to create the account ONCE manually
          const create = confirm("Master Dev Account does not exist yet. Create it now? (This should only be done once)");
          if (create) {
            const { error: signUpError } = await supabase.auth.signUp({ email, password });
            if (signUpError) {
              alert(`Failed to create account: ${signUpError.message}`);
              throw signUpError;
            }
            // If success, we are now logged in!
            alert("Account created! Logging in...");
          } else {
            setIsLoggingIn(false);
            return;
          }
        } else {
          throw signInError;
        }
      }

      // Add a small delay for state propagation
      setTimeout(() => navigate('/dashboard'), 500);

    } catch (err: any) {
      console.error('Dev login critical failure:', err);
      // Fallback to Mock ONLY if absolutely necessary and user agrees
      if (confirm("Login failed (likely Rate Limit). Switch to Offline Mock Mode?")) {
        debugLogin(); // Sets 'dev-user-id'
        navigate('/dashboard');
      } else {
        setIsLoggingIn(false);
        setError(err.message);
      }
    }
  };

  if (magicLinkSent) {
    return (
      <div className="relative h-screen w-full flex flex-col items-center justify-center bg-[#FCFBF5] px-8">
        <FlocLogo className="text-6xl text-primary mb-8 drop-shadow-lg" />
        <div className="bg-white border border-primary/10 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 animate-in fade-in zoom-in duration-500 shadow-xl">
          <div className="size-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/10">
            <span className="material-symbols-outlined text-3xl">mark_email_read</span>
          </div>
          <h2 className="text-2xl font-black text-primary italic">Check your inbox!</h2>
          <p className="text-primary/60 text-sm">We sent a magic link to <span className="text-primary font-bold">{email}</span>.</p>
          <button
            onClick={() => { setMagicLinkSent(false); setIsLoggingIn(false); }}
            className="text-accent text-xs font-black uppercase tracking-widest hover:underline mt-4 block"
          >
            Try different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex flex-col overflow-y-auto bg-[#FCFBF5]">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[#FCFBF5] pointer-events-none z-0">
        <div className="absolute w-full h-full opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>
      </div>

      {isLoggingIn && !magicLinkSent && (
        <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
          <div className="relative">
            <div className="size-24 rounded-[2.5rem] bg-gradient-to-br from-primary to-accent mb-8 shadow-2xl flex items-center justify-center animate-pulse">
              <span className="text-white font-heading font-black text-4xl italic">E.</span>
            </div>
            <div className="absolute -bottom-2 -right-2 size-8 bg-white rounded-xl flex items-center justify-center shadow-lg border border-primary/10">
              <span className="material-symbols-outlined text-primary text-xl font-black">security</span>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-primary font-black text-xl italic tracking-tighter mb-1 uppercase">Verifying Protocol</h3>
            <p className="text-accent text-[8px] font-black uppercase tracking-[0.3em]">Inspired Ventures Secure Node</p>
          </div>
        </div>
      )}

      <main className="relative z-10 flex-1 flex flex-col px-6 py-12 md:px-8 md:pt-24 md:pb-12 text-primary">
        <div className="flex flex-col items-center mb-8 md:mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <FlocLogo className="text-8xl drop-shadow-2xl text-primary" />
          <div className="flex flex-col items-center mt-4">
            <h1 className="text-primary font-black text-4xl tracking-tighter leading-none italic uppercase">EVA</h1>
            <p className="text-accent text-[10px] uppercase tracking-[0.4em] font-black mt-2">by Inspired</p>
          </div>
        </div>

        <div className="mt-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-primary text-3xl font-heading font-black tracking-tighter leading-none italic">
              Collective travel <br />for <span className="text-accent not-italic">conscious spirits.</span>
            </h2>
            <p className="text-primary/60 text-sm font-medium">Join the protocol. Find your tribe.</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your explorer email..."
                className="w-full h-16 bg-white border border-primary/10 rounded-2xl px-6 text-primary placeholder:text-primary/40 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-medium shadow-sm"
                required
                disabled={isLoggingIn}
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-16 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden hover:bg-primary/90"
            >
              {isLoggingIn && loginMethod === 'email' ? (
                <div className="size-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Magic Link Login</span>
                  <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">bolt</span>
                </>
              )}
            </button>
          </form>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => performLogin('google')}
              disabled={isLoggingIn}
              className="w-full h-14 bg-white border border-primary/10 rounded-2xl flex items-center justify-center gap-3 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/5 transition-all disabled:opacity-50 shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" className="size-4" alt="" />
              {isLoggingIn && loginMethod === 'google' ? 'Authenticating...' : 'Continue with Google'}
            </button>
            <button
              onClick={() => performLogin('protocol')}
              disabled={isLoggingIn}
              className="w-full h-14 bg-white border border-primary/10 rounded-2xl flex items-center justify-center gap-3 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/5 transition-all disabled:opacity-50 shadow-sm"
            >
              <span className="material-symbols-outlined text-primary">security</span>
              {isLoggingIn && loginMethod === 'protocol' ? 'Connecting Node...' : 'Inspired Protocol (SSO)'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <p className="text-red-500 text-xs font-bold">{error}</p>
            </div>
          )}

          <div className="pt-4 border-t border-primary/5">
            <button
              onClick={handleDevLogin}
              disabled={isLoggingIn}
              className="w-full py-3 bg-primary/5 border border-primary/10 rounded-xl text-primary font-heading tracking-wider hover:bg-primary/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoggingIn && loginMethod === 'dev' ? (
                <span className="size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              ) : null}
              DEVELOPMENT LOGIN (TRY MASTER)
            </button>

            <button
              onClick={() => {
                // Force Offline Mode
                debugLogin();
                alert("Entered Offline Mode. Data will persist locally only.");
                navigate('/dashboard');
              }}
              className="w-full mt-2 py-2 text-xs text-primary/40 hover:text-primary transition-colors"
            >
              Use Offline Mode (Force Persistence)
            </button>
          </div>
        </div>

        <p className="mt-8 text-primary/30 text-sm text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </main>
    </div>
  );
};

export default Login;
