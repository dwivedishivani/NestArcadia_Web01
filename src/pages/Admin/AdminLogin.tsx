import { useState } from 'react';

interface Props {
  onLogin: (password: string) => void;
  error: string;
  loading: boolean;
}

export default function AdminLogin({ onLogin, error, loading }: Props) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#F2EDE4' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl text-[#1A1714] tracking-wide">NestArcadia</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#6B5E4E] mt-2">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="border border-[#D4CBBB] p-8 lg:p-10" style={{ background: '#EAE4DA' }}>
          <h2 className="font-display text-xl text-[#1A1714] mb-6">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#6B5E4E] mb-2 block">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-transparent border border-[#D4CBBB] px-4 py-3 text-[15px] text-[#1A1714] placeholder:text-[#6B5E4E]/50 outline-none focus:border-[#2D8C7E] transition-colors pr-12"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5E4E] hover:text-[#1A1714] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#1C3A5A] text-white text-[14px] py-3.5 hover:bg-[#2D8C7E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-[#6B5E4E] mt-8">
          Protected area. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
