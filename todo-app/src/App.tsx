import { useState, useEffect } from 'react';
import type { Todo, Category } from './types';
import { categorizeTask } from './utils/categorize';
import './App.css';

const STORAGE_KEY = 'auto-category-todos';

// 카테고리별 이모지
const categoryEmojis: Record<Category, string> = {
  업무: '💼',
  학습: '📚',
  건강: '💪',
  가사: '🏠',
  쇼핑: '🛒',
  취미: '🎨',
  기타: '📌'
};

// 카테고리별 색상
const categoryColors: Record<Category, string> = {
  업무: '#3b82f6',
  학습: '#8b5cf6',
  건강: '#10b981',
  가사: '#f59e0b',
  쇼핑: '#ec4899',
  취미: '#06b6d4',
  기타: '#6b7280'
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<Category | 'all'>('all');

  // 로컬 스토리지에서 할일 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTodos(parsed);
      } catch (e) {
        console.error('Failed to parse stored todos:', e);
      }
    }
  }, []);

  // 할일 변경시 로컬 스토리지에 저장
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos]);

  // 할일 추가
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const category = categorizeTask(inputText);
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      category,
      completed: false,
      createdAt: Date.now()
    };

    setTodos([newTodo, ...todos]);
    setInputText('');
  };

  // 할일 완료/미완료 토글
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 할일 삭제
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 필터링된 할일 목록
  const filteredTodos = filter === 'all'
    ? todos
    : todos.filter(todo => todo.category === filter);

  // 카테고리별 할일 개수
  const categoryCounts = todos.reduce((acc, todo) => {
    acc[todo.category] = (acc[todo.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  const categories: Category[] = ['업무', '학습', '건강', '가사', '쇼핑', '취미', '기타'];

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>✨ 스마트 할일 관리</h1>
          <p>할일을 입력하면 자동으로 카테고리를 분류해드립니다</p>
        </header>

        {/* 할일 입력 폼 */}
        <form onSubmit={addTodo} className="input-form">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="할일을 입력하세요... (예: 회의 준비하기, 영어 공부, 운동하기)"
            className="input-field"
          />
          <button type="submit" className="add-button">
            추가
          </button>
        </form>

        {/* 카테고리 필터 */}
        <div className="category-filters">
          <button
            onClick={() => setFilter('all')}
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            전체 ({todos.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`filter-button ${filter === category ? 'active' : ''}`}
              style={{
                borderColor: filter === category ? categoryColors[category] : undefined,
                color: filter === category ? categoryColors[category] : undefined
              }}
            >
              {categoryEmojis[category]} {category} ({categoryCounts[category] || 0})
            </button>
          ))}
        </div>

        {/* 할일 목록 */}
        <div className="todos-container">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <p>😊 {filter === 'all' ? '할일이 없습니다' : `${filter} 카테고리에 할일이 없습니다`}</p>
            </div>
          ) : (
            <div className="todos-list">
              {filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className={`todo-item ${todo.completed ? 'completed' : ''}`}
                  style={{ borderLeftColor: categoryColors[todo.category] }}
                >
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    <div className="todo-text-container">
                      <span className="todo-text">{todo.text}</span>
                      <span
                        className="todo-category"
                        style={{ backgroundColor: `${categoryColors[todo.category]}20`, color: categoryColors[todo.category] }}
                      >
                        {categoryEmojis[todo.category]} {todo.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-button"
                    aria-label="삭제"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 통계 */}
        {todos.length > 0 && (
          <div className="stats">
            <p>
              전체 {todos.length}개 | 완료 {todos.filter(t => t.completed).length}개 |
              미완료 {todos.filter(t => !t.completed).length}개
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
