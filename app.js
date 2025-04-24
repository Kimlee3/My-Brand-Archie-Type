// 저장 기능
document.getElementById('save-btn').addEventListener('click', () => {
    const data = {
      nodes: nodes.map(node => ({
        x: node.x,
        y: node.y,
        text: node.element.querySelector('.node-content').textContent,
        isCentral: node.parent === null,
        direction: node.direction
      })),
      connections: connections.map(conn => ({
        fromIndex: nodes.indexOf(conn.fromNode),
        toIndex: nodes.indexOf(conn.toNode)
      }))
    };
  
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmap-${new Date().toISOString().slice(0,10)}.mindmap`;
    a.click();
  });
  
  // 불러오기 기능
  document.getElementById('load-btn').addEventListener('click', () => {
    document.getElementById('file-input').click();
  });
  
  document.getElementById('file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = JSON.parse(event.target.result);
        resetMap();
        loadMap(data);
      };
      reader.readAsText(file);
    }
  });
  
  // 초기화 기능
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('정말 초기화하시겠습니까?')) {
      resetMap();
      createCentralNode();
    }
  });
  
  function resetMap() {
    document.querySelectorAll('.node, .connection').forEach(el => el.remove());
    nodes = [];
    connections = [];
  }
  
  function loadMap(data) {
    // 노드 먼저 생성
    data.nodes.forEach((nodeData, i) => {
      const node = document.createElement('div');
      node.className = `node ${nodeData.isCentral ? 'central-node' : ''}`;
      node.style.left = `${nodeData.x}px`;
      node.style.top = `${nodeData.y}px`;
      
      const content = document.createElement('div');
      content.className = 'node-content';
      content.textContent = nodeData.text;
      node.appendChild(content);
      
      map.appendChild(node);
      
      const nodeObj = {
        element: node,
        x: nodeData.x,
        y: nodeData.y,
        direction: nodeData.direction || 'right'
      };
      nodes.push(nodeObj);
      
      if (nodeData.isCentral) {
        centralNode = nodeObj;
      }
    });
    
    // 연결선 생성
    data.connections.forEach(conn => {
      createConnection(nodes[conn.fromIndex], nodes[conn.toIndex]);
    });
  }
  
  // 노드 드래그 개선
  function setupDrag(nodeObj) {
    let isDragging = false;
    let startPos = { x: 0, y: 0 };
    
    nodeObj.element.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('add-btn') || 
          e.target.classList.contains('branch-btn')) return;
      
      isDragging = true;
      startPos = { x: e.clientX, y: e.clientY };
      selectNode(nodeObj);
      e.preventDefault(); // 텍스트 선택 방지
    });
  
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const dx = (e.clientX - startPos.x) / scale;
        const dy = (e.clientY - startPos.y) / scale;
        
        nodeObj.x += dx;
        nodeObj.y += dy;
        nodeObj.element.style.left = `${nodeObj.x}px`;
        nodeObj.element.style.top = `${nodeObj.y}px`;
        
        startPos = { x: e.clientX, y: e.clientY };
        updateConnections();
      }
    });
  
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
  
  // 모든 노드에 드래그 설정 적용
  nodes.forEach(node => setupDrag(node));

  function addChildNode(parentNode, directionAngle) {
    const branchLength = 180; // 부모 노드와 자식 노드 간 거리
    const angleVariation = Math.PI / 4; // 각도 변화 (45도)
  
    // 자식 노드 개수에 따라 각도 조정
    const childCount = parentNode.children ? parentNode.children.length : 0;
    const angle = directionAngle + (childCount % 3 - 1) * angleVariation;
  
    // 자식 노드의 좌표 계산
    const x = parentNode.x + Math.cos(angle) * branchLength;
    const y = parentNode.y + Math.sin(angle) * branchLength;
  
    // 자식 노드 생성
    const childNode = document.createElement('div');
    childNode.className = 'node';
    childNode.style.left = `${x}px`;
    childNode.style.top = `${y}px`;
  
    const content = document.createElement('div');
    content.className = 'node-content';
    content.textContent = `노드 ${nodes.length + 1}`;
    childNode.appendChild(content);
  
    // 부모-자식 관계 설정
    if (!parentNode.children) {
      parentNode.children = [];
    }
    parentNode.children.push({ element: childNode, x, y });
  
    // DOM에 추가
    document.getElementById('map').appendChild(childNode);
  
    // 노드 리스트에 추가
    nodes.push({
      element: childNode,
      x,
      y,
      parent: parentNode,
      direction: angle
    });
  
    // 드래그 기능 추가
    setupDrag(nodes[nodes.length - 1]);
  
    // 부모와 자식 간 연결선 생성
    createConnection(parentNode, nodes[nodes.length - 1]);
  }

  // 자동 정렬 함수
  function autoArrange(node = centralNode, depth = 0) {
    const angleStep = (2 * Math.PI) / (node.children.length || 1); // 각도 간격
    const radius = 150 + depth * 100; // 깊이에 따른 반지름 증가
  
    node.children.forEach((child, i) => {
      const angle = i * angleStep; // 각도 계산
      child.x = node.x + Math.cos(angle) * radius; // x 좌표 계산
      child.y = node.y + Math.sin(angle) * radius; // y 좌표 계산
      child.element.style.left = `${child.x}px`; // DOM 업데이트
      child.element.style.top = `${child.y}px`;
      child.element.classList.add(`level-${depth + 1}`); // 레벨 클래스 추가
  
      // 재귀적으로 자식 노드 정렬
      autoArrange(child, depth + 1);
    });
  
    // 연결선 업데이트
    updateConnections();
  }
  
  // 호출 예시: 중앙 노드부터 자동 정렬 실행
  document.getElementById('auto-arrange-btn').addEventListener('click', () => {
    if (centralNode) {
      autoArrange(centralNode);
    }
  });