let map = document.getElementById('map');
let nodes = [];
let connections = [];
let zoomLevel = 1;

function createNode(x, y, text = '노드', parent = null) {
  const node = document.createElement('div');
  node.className = parent ? 'node' : 'node central-node';  // Add class conditionally
  node.style.left = x + 'px';
  node.style.top = y + 'px';

  const content = document.createElement('div');
  content.className = 'node-content';
  content.contentEditable = true;
  content.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newX = parseInt(node.style.left) + 150;
      const newY = parseInt(node.style.top) + (Math.random() * 100 - 50);
      const newNode = createNode(newX, newY, '새 노드', node);
      connectNodes(node, newNode);
    }
  });
  content.innerText = text;

  const addButton = document.createElement('button');
  addButton.className = 'add-btn';
  addButton.innerText = '+';
  addButton.onclick = () => {
    const newX = parseInt(node.style.left) + 150;
    const newY = parseInt(node.style.top) + (Math.random() * 100 - 50);
    const newNode = createNode(newX, newY, '새 노드', node);
    connectNodes(node, newNode);
  };

  node.appendChild(content);
  node.appendChild(addButton);
  map.appendChild(node);

  makeDraggable(node);
  nodes.push(node);
  return node;
}

// 연결선 생성 함수
function createConnection(fromNode, toNode) {
  const svg = document.getElementById("connections"); // SVG 요소 가져오기
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

  // 연결선 스타일 설정
  line.setAttribute("stroke", "#aaa");
  line.setAttribute("stroke-width", "2");

  // SVG에 연결선 추가
  svg.appendChild(line);

  // 연결 정보 저장
  connections.push({ fromNode, toNode, line });

  // 연결선 위치 업데이트
  updateConnectionPosition(fromNode, toNode, line);
}

// 특정 연결선의 위치를 업데이트하는 함수
function updateConnectionPosition(fromNode, toNode, line) {
  const rect = document.getElementById('map-container').getBoundingClientRect();

  // 시작 노드와 끝 노드의 중심 좌표 계산
  const fromX = fromNode.offsetLeft + fromNode.offsetWidth / 2 - rect.left;
  const fromY = fromNode.offsetTop + fromNode.offsetHeight / 2 - rect.top;
  const toX = toNode.offsetLeft + toNode.offsetWidth / 2 - rect.left;
  const toY = toNode.offsetTop + toNode.offsetHeight / 2 - rect.top;

  // 연결선의 시작점과 끝점 설정
  line.setAttribute("x1", fromX);
  line.setAttribute("y1", fromY);
  line.setAttribute("x2", toX);
  line.setAttribute("y2", toY);
}

function connectNodes(parent, child) {
  createConnection(parent, child);
}

// 모든 연결선의 위치를 업데이트하는 함수
function updateConnections() {
  connections.forEach(({ fromNode, toNode, line }) => {
    updateConnectionPosition(fromNode, toNode, line);
  });
}

function makeDraggable(element) {
  let offsetX, offsetY;
  element.onmousedown = function (e) {
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    document.onmousemove = function (e) {
      element.style.left = e.clientX - offsetX + 'px';
      element.style.top = e.clientY - offsetY + 'px';
      updateConnections();
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}

function init() {
  const centerX = map.offsetWidth / 2 - 50;
  const centerY = map.offsetHeight / 2 - 25;
  createNode(centerX, centerY, '중앙 노드');
}

window.addEventListener('resize', updateConnections);
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  zoomLevel += e.deltaY * -0.001;
  zoomLevel = Math.min(Math.max(zoomLevel, 0.5), 2);
  map.style.transform = `scale(${zoomLevel})`;
  updateConnections();
}, { passive: false });

init();
