// src/components/auth/SignupForm.tsx
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Ruler, Weight, Palette, Shirt, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

interface ValidationState {
  email: {
    isValid: boolean;
    message: string;
    isChecking: boolean;
  };
  password: {
    isValid: boolean;
    message: string;
  };
  confirmPassword: {
    isValid: boolean;
    message: string;
  };
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male' as 'male' | 'female' | 'other',
    height: '',
    weight: '',
    preferredColors: [] as string[],
    preferredStyles: [] as string[]
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 유효성 검사 상태
  const [validation, setValidation] = useState<ValidationState>({
    email: { isValid: false, message: '', isChecking: false },
    password: { isValid: false, message: '' },
    confirmPassword: { isValid: false, message: '' }
  });

  const { signup } = useAuth();

  const colorOptions = [
    '빨강', '파랑', '초록', '노랑', '보라', '주황', '분홍', '검정', '흰색', '회색', '베이지', '네이비'
  ];

  const styleOptions = [
    '캐주얼', '포멀', '스포츠', '빈티지', '모던', '클래식', '스트릿', '미니멀', '로맨틱', '보헤미안'
  ];

  // 이메일 형식 검증
  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 중복 확인
  const checkEmailDuplicate = async (email: string): Promise<boolean> => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty; // true면 중복, false면 사용 가능
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error);
      return false;
    }
  };

  // 비밀번호 강도 검증
  const validatePasswordStrength = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (password.length < 6) {
      return { isValid: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' };
    } else if (score < 3) {
      return { isValid: false, message: '비밀번호는 대문자, 소문자, 숫자, 특수문자 중 3가지 이상 포함해야 합니다.' };
    } else if (score === 3) {
      return { isValid: true, message: '보통 강도의 비밀번호입니다.' };
    } else if (score === 4) {
      return { isValid: true, message: '강한 비밀번호입니다.' };
    } else {
      return { isValid: true, message: '매우 강한 비밀번호입니다.' };
    }
  };

  // 이메일 변경 핸들러
  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));

    if (!email) {
      setValidation(prev => ({
        ...prev,
        email: { isValid: false, message: '', isChecking: false }
      }));
      return;
    }

    if (!validateEmailFormat(email)) {
      setValidation(prev => ({
        ...prev,
        email: { isValid: false, message: '올바른 이메일 형식이 아닙니다.', isChecking: false }
      }));
      return;
    }

    // 이메일 중복 확인
    setValidation(prev => ({
      ...prev,
      email: { isValid: false, message: '이메일 확인 중...', isChecking: true }
    }));

    const isDuplicate = await checkEmailDuplicate(email);
    
    setValidation(prev => ({
      ...prev,
      email: {
        isValid: !isDuplicate,
        message: isDuplicate ? '이미 사용 중인 이메일입니다.' : '사용 가능한 이메일입니다.',
        isChecking: false
      }
    }));
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData(prev => ({ ...prev, password }));

    if (!password) {
      setValidation(prev => ({
        ...prev,
        password: { isValid: false, message: '' }
      }));
      return;
    }

    const passwordValidation = validatePasswordStrength(password);
    setValidation(prev => ({
      ...prev,
      password: passwordValidation
    }));

    // 비밀번호 확인도 다시 검증
    if (formData.confirmPassword) {
      validateConfirmPassword(formData.confirmPassword, password);
    }
  };

  // 비밀번호 확인 검증
  const validateConfirmPassword = (confirmPassword: string, password: string = formData.password) => {
    if (!confirmPassword) {
      setValidation(prev => ({
        ...prev,
        confirmPassword: { isValid: false, message: '' }
      }));
      return;
    }

    const isValid = confirmPassword === password;
    setValidation(prev => ({
      ...prev,
      confirmPassword: {
        isValid,
        message: isValid ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'
      }
    }));
  };

  // 비밀번호 확인 변경 핸들러
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setFormData(prev => ({ ...prev, confirmPassword }));
    validateConfirmPassword(confirmPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({
      ...prev,
      preferredColors: prev.preferredColors.includes(color)
        ? prev.preferredColors.filter(c => c !== color)
        : [...prev.preferredColors, color]
    }));
  };

  const handleStyleChange = (style: string) => {
    setFormData(prev => ({
      ...prev,
      preferredStyles: prev.preferredStyles.includes(style)
        ? prev.preferredStyles.filter(s => s !== style)
        : [...prev.preferredStyles, style]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 모든 유효성 검사 확인
    if (!validation.email.isValid) {
      setError('유효한 이메일을 입력해주세요.');
      return;
    }

    if (!validation.password.isValid) {
      setError('유효한 비밀번호를 입력해주세요.');
      return;
    }

    if (!validation.confirmPassword.isValid) {
      setError('비밀번호 확인을 정확히 입력해주세요.');
      return;
    }

    if (!formData.height || !formData.weight) {
      setError('키와 몸무게를 입력해주세요.');
      return;
    }

    if (formData.preferredColors.length === 0) {
      setError('선호하는 색상을 최소 1개 이상 선택해주세요.');
      return;
    }

    if (formData.preferredStyles.length === 0) {
      setError('선호하는 스타일을 최소 1개 이상 선택해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 회원가입 전 데이터 로깅
      console.log('회원가입 시도:', {
        email: formData.email,
        profileData: {
          gender: formData.gender,
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
          preferredColors: formData.preferredColors,
          preferredStyles: formData.preferredStyles
        }
      });

      await signup(formData.email, formData.password, {
        gender: formData.gender,
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        preferredColors: formData.preferredColors,
        preferredStyles: formData.preferredStyles
      });

      console.log('회원가입 성공!');
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.');
      } else if (error.code === 'auth/invalid-email') {
        setError('유효하지 않은 이메일 형식입니다.');
      } else if (error.code === 'auth/weak-password') {
        setError('비밀번호가 너무 약합니다.');
      } else {
        setError(`회원가입 중 오류가 발생했습니다: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 유효성 검사 아이콘 컴포넌트
  const ValidationIcon = ({ isValid, isChecking }: { isValid: boolean; isChecking?: boolean }) => {
    if (isChecking) {
      return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    }
    return isValid ? 
      <Check className="w-5 h-5 text-green-500" /> : 
      <X className="w-5 h-5 text-red-500" />;
  };

  // 폼 유효성 확인
  const isFormValid = validation.email.isValid && 
                     validation.password.isValid && 
                     validation.confirmPassword.isValid &&
                     formData.height && 
                     formData.weight &&
                     formData.preferredColors.length > 0 &&
                     formData.preferredStyles.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h2>
        <p className="text-gray-600">개인 맞춤 패션 추천을 위한 정보를 입력해주세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                  formData.email && !validation.email.isChecking
                    ? validation.email.isValid 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="이메일을 입력하세요"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {formData.email && (
                  <ValidationIcon 
                    isValid={validation.email.isValid} 
                    isChecking={validation.email.isChecking} 
                  />
                )}
              </div>
            </div>
            {formData.email && validation.email.message && (
              <p className={`text-sm mt-1 ${validation.email.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {validation.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
              성별
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors appearance-none bg-white"
                required
              >
                <option value="male">남성</option>
                <option value="female">여성</option>
                <option value="other">기타</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handlePasswordChange}
                className={`w-full pl-10 pr-20 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                  formData.password
                    ? validation.password.isValid 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="비밀번호를 입력하세요"
                required
              />
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                {formData.password && (
                  <ValidationIcon isValid={validation.password.isValid} />
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password && validation.password.message && (
              <p className={`text-sm mt-1 ${validation.password.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {validation.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full pl-10 pr-20 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                  formData.confirmPassword
                    ? validation.confirmPassword.isValid 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                {formData.confirmPassword && (
                  <ValidationIcon isValid={validation.confirmPassword.isValid} />
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.confirmPassword && validation.confirmPassword.message && (
              <p className={`text-sm mt-1 ${validation.confirmPassword.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {validation.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* 신체 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
              키 (cm)
            </label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                placeholder="예: 170"
                min="100"
                max="250"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              몸무게 (kg)
            </label>
            <div className="relative">
              <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                placeholder="예: 65"
                min="30"
                max="200"
                required
              />
            </div>
          </div>
        </div>

        {/* 선호 색상 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Palette className="inline w-5 h-5 mr-2" />
            선호하는 색상 (복수 선택 가능)
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {colorOptions.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorChange(color)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  formData.preferredColors.includes(color)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            선택된 색상: {formData.preferredColors.length}개
          </p>
        </div>

        {/* 선호 스타일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Shirt className="inline w-5 h-5 mr-2" />
            선호하는 스타일 (복수 선택 가능)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {styleOptions.map(style => (
              <button
                key={style}
                type="button"
                onClick={() => handleStyleChange(style)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  formData.preferredStyles.includes(style)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            선택된 스타일: {formData.preferredStyles.length}개
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isFormValid && !loading
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? '회원가입 중...' : '회원가입'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          이미 계정이 있으신가요?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            로그인
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;