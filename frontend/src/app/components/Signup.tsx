import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

export function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    console.log('Signup:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`${provider} signup clicked`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">🐾</span>
            <span className="font-bold text-3xl text-[#ff6b33]">꼬리살랑</span>
          </a>
          <p className="text-gray-600 mt-2">반려견과 함께하는 특별한 시간</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">회원가입</h2>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="사용할 닉네임을 입력하세요"
                value={formData.nickname}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="닉네임을 입력하세요"
                value={formData.nickname}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="8자 이상 입력하세요"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" required className="mt-1 rounded" />
              <label className="text-gray-600">
                <a href="#" className="text-[#ff6b33] hover:underline">
                  이용약관
                </a>
                {' '}및{' '}
                <a href="#" className="text-[#ff6b33] hover:underline">
                  개인정보처리방침
                </a>
                에 동의합니다.
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#ff6b33] hover:bg-[#ff5722] text-white font-semibold text-base"
            >
              회원가입
            </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
              또는
            </span>
          </div>

          {/* Social Signup */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => handleSocialSignup('Kakao')}
              className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] text-gray-900 font-semibold"
            >
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 208 191'%3E%3Cpath fill='%23000000' d='M104 0C46.562 0 0 36.093 0 80.548c0 28.167 18.293 52.944 45.983 67.437-1.876 6.895-12.098 44.444-12.438 47.527-.42 3.82 1.4 3.77 2.948 2.74 1.235-.823 19.796-13.276 29.536-19.93 12.132 2.262 24.73 3.458 37.971 3.458 57.438 0 104-36.093 104-80.548S161.438 0 104 0'/%3E%3C/svg%3E"
                alt="Kakao"
                className="w-5 h-5 mr-2"
              />
              카카오로 시작하기
            </Button>

            <Button
              type="button"
              onClick={() => handleSocialSignup('Naver')}
              className="w-full h-12 bg-[#03C75A] hover:bg-[#02B350] text-white font-semibold"
            >
              <span className="mr-2 text-lg font-bold">N</span>
              네이버로 시작하기
            </Button>

            <Button
              type="button"
              onClick={() => handleSocialSignup('Google')}
              variant="outline"
              className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 font-semibold"
            >
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/%3E%3Cpath fill='%234285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/%3E%3Cpath fill='%23FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/%3E%3Cpath fill='%2334A853' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/%3E%3C/svg%3E"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              구글로 시작하기
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            이미 회원이신가요?{' '}
            <a href="/login" className="text-[#ff6b33] font-semibold hover:underline">
              로그인
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
