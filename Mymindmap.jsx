import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Trash2, FileDown, Lightbulb, Save, Undo, Layout, Home } from 'lucide-react';

// 마인드맵 노드 구성요소
const MindMapNode = ({ node, onUpdate, onAddChild, onDelete, level = 0 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(node.text);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);

  // 노드 텍스트 변경 관리
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // 노드 저장
  const saveNode = () => {
    onUpdate(node.id, text);
    setIsEditing(false);
  };

  // 더블클릭으로 편집 모드 전환
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // 포커스 자동 설정
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // 엔터키 저장, ESC키 취소
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveNode();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setText(node.text);
    }
  };

  // 노드의 배경색 및 스타일 생성 (레벨에 따라 달라짐)
  const getNodeStyle = (level) => {
    const styles = [
      'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400 shadow-blue-100',
      'bg-gradient-to-br from-green-50 to-green-100 border-green-400 shadow-green-100',
      'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-400 shadow-purple-100',
      'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-400 shadow-amber-100',
      'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-400 shadow-indigo-100',
      'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-400 shadow-rose-100'
    ];
    return styles[level % styles.length];
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative p-4 rounded-xl border shadow-md transition-all duration-200 min-w-40 ${getNodeStyle(level)} ${isHovered ? 'scale-105' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleTextChange}
            onBlur={saveNode}
            onKeyDown={handleKeyDown}
            className="w-full bg-white/80 backdrop-blur-sm p-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            autoFocus
          />
        ) : (
          <div 
            onDoubleClick={handleDoubleClick} 
            className="cursor-pointer text-center font-medium py-1"
          >
            {node.text}
          </div>
        )}

        <div className={`flex justify-center mt-2 space-x-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={() => onAddChild(node.id)}
            className="text-blue-600 hover:text-blue-800 bg-white/70 backdrop-blur-sm p-1 rounded-full hover:bg-white transition-all"
            title="하위 노드 추가"
          >
            <PlusCircle size={16} />
          </button>
          {level > 0 && (
            <button 
              onClick={() => onDelete(node.id)}
              className="text-red-600 hover:text-red-800 bg-white/70 backdrop-blur-sm p-1 rounded-full hover:bg-white transition-all"
              title="노드 삭제"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {node.children && node.children.length > 0 && (
        <div className="pt-6 relative">
          <div className="absolute left-1/2 top-0 h-4 w-px bg-gray-300"></div>
          <div className="flex flex-row space-x-6">
            {node.children.map((child, index) => (
              <div key={child.id} className="flex flex-col items-center">
                {index > 0 && index < node.children.length && (
                  <div className="absolute top-4 h-px bg-gray-300" style={{ 
                    width: `${(node.children.length - 1) * 6}rem`,
                    left: `calc(50% - ${((node.children.length - 1) * 6) / 2}rem)`
                  }}></div>
                )}
                <MindMapNode
                  node={child}
                  onUpdate={onUpdate}
                  onAddChild={onAddChild}
                  onDelete={onDelete}
                  level={level + 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 메인 마인드맵 컴포넌트
const MindMap = () => {
  const [mapData, setMapData] = useState(() => {
    const saved = localStorage.getItem('mindmap');
    return saved ? JSON.parse(saved) : {
      id: '1',
      text: '중심 주제',
      children: []
    };
  });
  
  const [title, setTitle] = useState('내 마인드맵');
  const [theme, setTheme] = useState('light');
  const [history, setHistory] = useState([]);
  
  // 테마 변경
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('mindmap', JSON.stringify(mapData));
    // 상태 변화를 히스토리에 추가 (최대 10개)
    setHistory(prev => {
      const newHistory = [...prev, JSON.stringify(mapData)];
      return newHistory.slice(-10);
    });
  }, [mapData]);

  // 새 노드 ID 생성
  const generateId = () => {
    return Date.now().toString();
  };

  // 노드 업데이트 함수
  const updateNode = (id, newText) => {
    const updateNodeRecursively = (node) => {
      if (node.id === id) {
        return { ...node, text: newText };
      }
      
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNodeRecursively)
        };
      }
      
      return node;
    };
    
    setMapData(updateNodeRecursively(mapData));
  };

  // 하위 노드 추가
  const addChild = (parentId) => {
    const addChildRecursively = (node) => {
      if (node.id === parentId) {
        const newChild = {
          id: generateId(),
          text: '새 노드',
          children: []
        };
        
        return {
          ...node,
          children: [...(node.children || []), newChild]
        };
      }
      
      if (node.children) {
        return {
          ...node,
          children: node.children.map(addChildRecursively)
        };
      }
      
      return node;
    };
    
    setMapData(addChildRecursively(mapData));
  };

  // 노드 삭제
  const deleteNode = (id) => {
    const deleteNodeRecursively = (node) => {
      if (node.children) {
        return {
          ...node,
          children: node.children
            .filter(child => child.id !== id)
            .map(deleteNodeRecursively)
        };
      }
      return node;
    };
    
    setMapData(deleteNodeRecursively(mapData));
  };

  // 마인드맵 새로 시작
  const resetMindMap = () => {
    if (window.confirm('마인드맵을 초기화하시겠습니까?')) {
      setMapData({
        id: '1',
        text: '중심 주제',
        children: []
      });
      setTitle('내 마인드맵');
    }
  };

  // 마인드맵 다운로드 (JSON 형식)
  const downloadMindMap = () => {
    const dataStr = JSON.stringify({ title, data: mapData }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = `${title.replace(/\s+/g, '_')}.json`;
    link.href = url;
    link.click();
  };
  
  // 실행 취소 기능
  const undoLastAction = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // 현재 상태 제거
      const lastState = newHistory[newHistory.length - 1];
      setMapData(JSON.parse(lastState));
      setHistory(newHistory);
    }
  };

  return (
    <div className={`flex flex-col items-center min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      <div className="w-full max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Lightbulb className="text-amber-500 mr-2" size={24} />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`text-3xl font-bold ${theme === 'dark' ? 'bg-transparent border-gray-700 text-white' : 'border-blue-200'} border-b-2 pb-1 focus:outline-none focus:border-blue-400 mr-4 transition-colors`}
              placeholder="마인드맵 제목"
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} transition-colors shadow-md`}
              title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              <Layout size={18} className={theme === 'dark' ? 'text-amber-300' : 'text-indigo-500'} />
            </button>
            
            <button 
              onClick={undoLastAction}
              disabled={history.length <= 1}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} transition-colors shadow-md ${history.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="되돌리기"
            >
              <Undo size={18} className={theme === 'dark' ? 'text-blue-300' : 'text-blue-500'} />
            </button>
            
            <button 
              onClick={downloadMindMap}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} transition-colors shadow-md`}
              title="마인드맵 다운로드"
            >
              <FileDown size={18} className={theme === 'dark' ? 'text-green-300' : 'text-green-500'} />
            </button>
            
            <button 
              onClick={resetMindMap}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} transition-colors shadow-md`}
              title="새로 시작하기"
            >
              <Home size={18} className={theme === 'dark' ? 'text-red-300' : 'text-red-500'} />
            </button>
          </div>
        </div>
        
        <div className={`rounded-xl p-8 shadow-xl overflow-auto ${theme === 'dark' ? 'bg-gray-800 shadow-gray-950/50' : 'bg-white/80 backdrop-blur-sm shadow-blue-100/50'} transition-colors`}>
          <div className="flex flex-col items-center min-w-full">
            <div className="overflow-x-auto min-w-full pb-10">
              <MindMapNode
                node={mapData}
                onUpdate={updateNode}
                onAddChild={addChild}
                onDelete={deleteNode}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className={`inline-flex items-center px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white/90 backdrop-blur-sm text-gray-600'} shadow-md`}>
            <div className="text-sm">
              <p>노드를 더블클릭하여 텍스트를 편집할 수 있습니다</p>
              <p>노드에 마우스를 올리면 + 버튼으로 하위 노드를 추가할 수 있습니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindMap;
