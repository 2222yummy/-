import type { Category } from '../types';

// 카테고리별 키워드 정의
const categoryKeywords: Record<Category, string[]> = {
  업무: [
    '회의', '미팅', '보고서', '프레젠테이션', '발표', '업무', '일', '프로젝트',
    '회사', '사무실', '이메일', '메일', '전화', '문서', '기획', '계약', '출장'
  ],
  학습: [
    '공부', '학습', '강의', '수업', '과제', '시험', '독서', '책', '영어',
    '스터디', '공부하기', '배우기', '코딩', '프로그래밍', '강좌', '교육'
  ],
  건강: [
    '운동', '헬스', '요가', '필라테스', '조깅', '러닝', '수영', '걷기',
    '병원', '진료', '약', '건강검진', '다이어트', '명상', '스트레칭'
  ],
  가사: [
    '청소', '빨래', '설거지', '요리', '집안일', '정리', '정돈', '청소하기',
    '쓰레기', '분리수거', '식사준비', '집', '가사', '정리정돈'
  ],
  쇼핑: [
    '장보기', '쇼핑', '구매', '사기', '주문', '배송', '마트', '시장',
    '온라인쇼핑', '장', '물건', '구입', '구매하기'
  ],
  취미: [
    '영화', '드라마', '게임', '음악', '그림', '여행', '사진', '캠핑',
    '등산', '낚시', '취미', '놀이', '관람', '공연', '전시회', '콘서트'
  ],
  기타: []
};

/**
 * 할일 텍스트를 분석하여 자동으로 카테고리를 분류합니다
 */
export function categorizeTask(text: string): Category {
  const lowerText = text.toLowerCase();

  // 각 카테고리의 키워드와 매칭되는지 확인
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === '기타') continue;

    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return category as Category;
      }
    }
  }

  // 매칭되는 키워드가 없으면 '기타'로 분류
  return '기타';
}
