let map = document.getElementById('map');
let nodes = [];
let connections = [];
let zoomLevel = 1;

function createNode(x, y, text = '노드', parent = null) {
  const div = document.createElement('div');
  div.className = parent ? 'node' : 'node central-node'; // 중앙 노드와 일반 노드 구분
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;

  const content = document.createElement('div');
  content.className = 'node-content';
  content.contentEditable = true;
  content.textContent = text;
  div.appendChild(content);

  const addButton = document.createElement('button');
  addButton.className = 'add-btn';
  addButton.textContent = '+';
  addButton.onclick = () => {
    const newX = parseInt(div.style.left) + 150;
    const newY = parseInt(div.style.top) + (Math.random() * 100 - 50);
    const newNode = createNode(newX, newY, '새 노드', div);
    connectNodes(div, newNode.element);
  };
  div.appendChild(addButton);

  document.getElementById('map').appendChild(div);

  makeDraggable(div);

  // 노드 객체 반환
  const node = {
    x,                     // 노드의 x 좌표
    y,                     // 노드의 y 좌표
    text,                  // 노드의 텍스트
    element: div,          // DOM 요소 참조
    parent,                // 부모 노드 참조
    direction: null        // 방향 (중앙 기준 좌우)
  };

  nodes.push(node); // 노드를 nodes 배열에 추가
  return node;
}

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
