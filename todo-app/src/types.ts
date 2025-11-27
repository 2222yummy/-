export type Category = '업무' | '학습' | '건강' | '가사' | '쇼핑' | '취미' | '기타';

export interface Todo {
  id: string;
  text: string;
  category: Category;
  completed: boolean;
  createdAt: number;
}
