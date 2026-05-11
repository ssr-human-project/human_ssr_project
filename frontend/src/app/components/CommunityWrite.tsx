import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, X, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type Category = 'free' | 'petsitter' | 'review';

const categories = [
  { value: 'free' as Category, label: '자유게시판' },
  { value: 'petsitter' as Category, label: '펫시터 모집' },
  { value: 'review' as Category, label: '리뷰' },
];

const locations = [
  '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
  '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
  '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구',
];

export function CommunityWrite() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>('free');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Mock image upload - in real app, upload to server
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!category) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    // Mock submit
    console.log({
      category,
      title,
      content,
      location,
      images,
    });

    alert('게시글이 작성되었습니다!');
    navigate('/community');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/community')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">글쓰기</h1>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/community')}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#ff6b33] hover:bg-[#ff5722] text-white"
            >
              등록
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>카테고리 *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Selection */}
          <div className="space-y-2">
            <Label>지역</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="지역을 선택하세요 (선택사항)" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {loc}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label>제목 *</Label>
            <Input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12"
              maxLength={100}
            />
            <div className="text-sm text-gray-500 text-right">
              {title.length} / 100
            </div>
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <Label>내용 *</Label>
            <Textarea
              placeholder="내용을 입력하세요&#10;&#10;• 커뮤니티 가이드라인을 준수해주세요&#10;• 서로 존중하는 문화를 만들어가요&#10;• 개인정보가 포함되지 않도록 주의해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] resize-none"
              maxLength={2000}
            />
            <div className="text-sm text-gray-500 text-right">
              {content.length} / 2000
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>사진 (최대 5장)</Label>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {images.length < 5 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    사진 추가 ({images.length}/5)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* Tips */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-700">게시글 작성 팁</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 제목은 간결하고 명확하게 작성해주세요</li>
              <li>• 구체적인 정보를 포함하면 더 많은 도움을 받을 수 있어요</li>
              <li>• 사진을 추가하면 내용 전달이 쉬워져요</li>
              {category === 'petsitter' && (
                <li>• 펫시터 모집글은 기간, 견종, 크기 등을 명시해주세요</li>
              )}
              {category === 'review' && (
                <li>• 리뷰는 장소명과 방문 날짜를 포함해주세요</li>
              )}
            </ul>
          </div>
        </div>

        {/* Mobile Submit Button */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button
            onClick={handleSubmit}
            className="w-full h-12 bg-[#ff6b33] hover:bg-[#ff5722] text-white font-semibold"
          >
            등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}
