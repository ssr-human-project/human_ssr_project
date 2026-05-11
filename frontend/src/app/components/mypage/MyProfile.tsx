import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function MyProfile() {
  const [userInfo, setUserInfo] = useState({
    password: '',
    confirmPassword: '',
    phone: '010-1234-5678',
    nickname: '꼬리살랑러버',
  });

  const [dogInfo, setDogInfo] = useState({
    name: '뭉치',
    breed: '포메라니안',
    size: 'small',
    description: '활발하고 사람을 좋아하는 3살 남아입니다.',
  });

  const handleUserChange = (field: string, value: string) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const handleDogChange = (field: string, value: string) => {
    setDogInfo({ ...dogInfo, [field]: value });
  };

  const handleSave = () => {
    if (userInfo.password && userInfo.password !== userInfo.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    console.log('Saving:', { userInfo, dogInfo });
    alert('정보가 저장되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">집사 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              value={userInfo.nickname}
              onChange={(e) => handleUserChange('nickname', e.target.value)}
              placeholder="닉네임을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              type="tel"
              value={userInfo.phone}
              onChange={(e) => handleUserChange('phone', e.target.value)}
              placeholder="010-0000-0000"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">새 비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={userInfo.password}
                onChange={(e) => handleUserChange('password', e.target.value)}
                placeholder="변경할 비밀번호"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={userInfo.confirmPassword}
                onChange={(e) => handleUserChange('confirmPassword', e.target.value)}
                placeholder="비밀번호 재입력"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dog Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">강아지 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dogName">이름</Label>
            <Input
              id="dogName"
              value={dogInfo.name}
              onChange={(e) => handleDogChange('name', e.target.value)}
              placeholder="강아지 이름"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breed">견종</Label>
              <Input
                id="breed"
                value={dogInfo.breed}
                onChange={(e) => handleDogChange('breed', e.target.value)}
                placeholder="예: 포메라니안, 말티즈"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">크기</Label>
              <Select value={dogInfo.size} onValueChange={(value) => handleDogChange('size', value)}>
                <SelectTrigger id="size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">소형견 (7kg 이하)</SelectItem>
                  <SelectItem value="medium">중형견 (7kg~15kg)</SelectItem>
                  <SelectItem value="large">대형견 (15kg 이상)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">강아지 소개</Label>
            <Textarea
              id="description"
              value={dogInfo.description}
              onChange={(e) => handleDogChange('description', e.target.value)}
              placeholder="강아지의 성격, 특징 등을 자유롭게 작성해주세요"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          size="lg"
          className="bg-[#ff6b33] hover:bg-[#ff5722] text-white font-semibold px-12"
        >
          저장하기
        </Button>
      </div>
    </div>
  );
}
