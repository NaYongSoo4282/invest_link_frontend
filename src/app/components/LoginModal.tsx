import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignup) {
      if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      // 회원가입 로직
      alert(`${name}님, 회원가입이 완료되었습니다!`);
      setIsSignup(false);
      setName('');
      setConfirmPassword('');
    } else {
      // 로그인 로직
      onLogin(email, password);
    }
    
    setEmail('');
    setPassword('');
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* 배경 데코레이션 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-100 to-transparent rounded-full -mr-32 -mt-32 opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-fuchsia-100 to-transparent rounded-full -ml-32 -mb-32 opacity-50" />
        
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 헤더 */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">K</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {isSignup ? '회원가입' : '로그인'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isSignup ? '코스피 200 대시보드에 가입하세요' : '코스피 200 대시보드에 오신 것을 환영합니다'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이름 (회원가입 시에만) */}
            {isSignup && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이름
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="홍길동"
                    required
                  />
                </div>
              </div>
            )}

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 (회원가입 시에만) */}
            {isSignup && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* 로그인 시 추가 옵션 */}
            {!isSignup && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500" />
                  <span className="text-gray-600">로그인 상태 유지</span>
                </label>
                <button type="button" className="text-violet-600 hover:underline font-medium">
                  비밀번호 찾기
                </button>
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3.5 rounded-xl hover:from-violet-700 hover:to-fuchsia-700 transition-all font-semibold shadow-lg shadow-violet-500/30"
            >
              {isSignup ? '가입하기' : '로그인'}
            </button>
          </form>

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* 모드 전환 */}
          <div className="text-center">
            <p className="text-gray-600">
              {isSignup ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
              <button
                onClick={switchMode}
                className="ml-2 text-violet-600 hover:underline font-semibold"
              >
                {isSignup ? '로그인' : '회원가입'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
