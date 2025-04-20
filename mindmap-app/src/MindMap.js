import { useState, useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';

// 상수 분리
const DEFAULT_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  NODE_RADIUS: {
    ROOT: 40,
    LEVEL_1: 30,
    DEFAULT: 30
  },
  NODE_COLORS: {
    ROOT: '#ff5722',
    LEVEL_1: '#2196f3',
    DEFAULT: '#4caf50',
    SELECTED: '#ff9800'
  },
  LINK_COLOR: '#999',
  ZOOM: {
    MIN: 0.1,
    MAX: 3
  }
};

const emptyMindMap = {
  nodes: [{ id: "root", label: "새 마인드맵", level: 0 }],
  edges: [],
  style: { theme: "light" }
};

export default function MindMap() {
  // 상태 관리
  const [data, setData] = useState(null);
  const [newNodeText, setNewNodeText] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [rootText, setRootText] = useState("");
  const svgRef = useRef(null);
  const simulationRef = useRef(null);

  // 시뮬레이션 정리
  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, []);

  // 마인드맵 렌더링
  const renderMindMap = useCallback(() => {
    if (!svgRef.current || !data) return;

    const { WIDTH, HEIGHT, NODE_RADIUS, NODE_COLORS, LINK_COLOR, ZOOM } = DEFAULT_CONFIG;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // 줌 기능
    const zoom = d3.zoom()
      .scaleExtent([ZOOM.MIN, ZOOM.MAX])
      .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoom)
       .call(zoom.transform, d3.zoomIdentity.translate(WIDTH / 2, HEIGHT / 2));

    // 물리 시뮬레이션
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.edges).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(0, 0))
      .force("collision", d3.forceCollide().radius(70));

    simulationRef.current = simulation;

    // 연결선
    const links = g.selectAll(".link")
      .data(data.edges)
      .enter().append("line")
      .attr("class", "link")
      .attr("stroke", LINK_COLOR)
      .attr("stroke-width", 2);

    // 노드 스타일 함수
    const getNodeColor = d => {
      if (d === selectedNode) return NODE_COLORS.SELECTED;
      if (d.level === 0) return NODE_COLORS.ROOT;
      if (d.level === 1) return NODE_COLORS.LEVEL_1;
      return NODE_COLORS.DEFAULT;
    };

    const getNodeRadius = d => {
      if (d.level === 0) return NODE_RADIUS.ROOT;
      if (d.level === 1) return NODE_RADIUS.LEVEL_1;
      return NODE_RADIUS.DEFAULT;
    };

    // 노드 그룹
    const nodes = g.selectAll(".node")
      .data(data.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", function(e, d) {
        e.stopPropagation();
        setSelectedNode(d);
      });

    // 노드 원
    nodes.append("circle")
      .attr("r", getNodeRadius)
      .attr("fill", getNodeColor)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // 노드 텍스트
    nodes.append("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#fff")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    // 시뮬레이션 업데이트
    simulation.on("tick", () => {
      links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodes.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

    // 드래그 핸들러
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // 배경 클릭 시 선택 해제
    svg.on("click", () => setSelectedNode(null));

  }, [data, selectedNode]);

  useEffect(() => {
    renderMindMap();
  }, [renderMindMap]);

  // 새 마인드맵 생성
  const createNewMindMap = useCallback(() => {
    if (!rootText.trim()) {
      alert("중심 주제를 입력해주세요.");
      return;
    }

    const newMindMap = {
      ...emptyMindMap,
      nodes: [{ id: "root", label: rootText, level: 0 }]
    };

    setData(newMindMap);
    setSelectedNode(newMindMap.nodes[0]);
  }, [rootText]);

  // 노드 추가
  const addNode = useCallback(() => {
    if (!selectedNode || !newNodeText.trim()) return;

    const newNodeId = `node-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      label: newNodeText,
      level: selectedNode.level + 1,
      parentId: selectedNode.id
    };

    const newEdge = { source: selectedNode.id, target: newNodeId };

    setData(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      edges: [...prev.edges, newEdge]
    }));

    setNewNodeText("");
  }, [selectedNode, newNodeText]);

  // 노드 삭제
  const deleteNode = useCallback(() => {
    if (!selectedNode || selectedNode.id === "root") return;

    if (!window.confirm("선택한 노드와 모든 하위 노드를 삭제하시겠습니까?")) {
      return;
    }

    const nodesToDelete = new Set([selectedNode.id]);
    const findChildren = (nodeId) => {
      data.nodes.forEach(node => {
        if (node.parentId === nodeId) {
          nodesToDelete.add(node.id);
          findChildren(node.id);
        }
      });
    };
    findChildren(selectedNode.id);

    setData(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => !nodesToDelete.has(node.id)),
      edges: prev.edges.filter(edge => 
        !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)
      )
    }));
    setSelectedNode(null);
  }, [selectedNode, data]);

  // 파일 저장
  const saveMindMap = useCallback(() => {
    if (!data) return;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindmap_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  // 파일 불러오기
  const loadMindMap = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedData = JSON.parse(e.target.result);
        setData(loadedData);
        const rootNode = loadedData.nodes.find(node => node.level === 0);
        if (rootNode) setRootText(rootNode.label);
      } catch (error) {
        alert("올바른 JSON 파일을 선택해주세요.");
      }
    };
    reader.readAsText(file);
  }, []);

  // 초기 화면
  if (!data) {
    return (
      <div className="mindmap-init-container">
        <div className="mindmap-init-card">
          <h1 className="mindmap-title">모던 마인드맵</h1>
          
          <div className="mindmap-control-group">
            <label className="mindmap-label">새 마인드맵 만들기</label>
            <div className="mindmap-input-group">
              <input 
                type="text" 
                className="mindmap-input"
                value={rootText}
                onChange={(e) => setRootText(e.target.value)}
                placeholder="중심 주제 입력"
              />
              <button 
                className="mindmap-button primary"
                onClick={createNewMindMap}
              >
                생성
              </button>
            </div>
          </div>
          
          <div className="mindmap-file-control">
            <label className="mindmap-button secondary">
              기존 마인드맵 불러오기
              <input 
                type="file" 
                accept=".json" 
                onChange={loadMindMap} 
                className="mindmap-file-input" 
              />
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mindmap-container">
      <header className="mindmap-header">
        <h1 className="mindmap-title">모던 마인드맵</h1>
        <div className="mindmap-header-controls">
          <button 
            className="mindmap-button"
            onClick={() => {
              if (window.confirm("새 마인드맵을 시작하시겠습니까? 저장되지 않은 변경사항은 모두 사라집니다.")) {
                setData(null);
                setRootText("");
                setSelectedNode(null);
              }
            }}
          >
            새로 만들기
          </button>
          <button 
            className="mindmap-button primary"
            onClick={saveMindMap}
          >
            저장하기
          </button>
          <label className="mindmap-button secondary">
            불러오기
            <input 
              type="file" 
              accept=".json" 
              onChange={loadMindMap} 
              className="mindmap-file-input" 
            />
          </label>
        </div>
      </header>

      <main className="mindmap-main">
        <div className="mindmap-area">
          <svg 
            ref={svgRef} 
            width={DEFAULT_CONFIG.WIDTH} 
            height={DEFAULT_CONFIG.HEIGHT}
            className="mindmap-svg"
          ></svg>
          <div className="mindmap-zoom-controls">
            <button className="mindmap-zoom-button" onClick={zoomIn}>+</button>
            <button className="mindmap-zoom-button" onClick={zoomOut}>-</button>
            <button className="mindmap-zoom-button" onClick={resetZoom}>⟲</button>
          </div>
        </div>

        <aside className="mindmap-sidebar">
          <h2 className="mindmap-sidebar-title">노드 관리</h2>
          
          {selectedNode ? (
            <div className="mindmap-node-controls">
              <p className="mindmap-selected-node">
                <span>선택된 노드:</span> {selectedNode.label}
              </p>
              
              <div className="mindmap-node-form">
                <input
                  type="text"
                  className="mindmap-input"
                  value={newNodeText}
                  onChange={(e) => setNewNodeText(e.target.value)}
                  placeholder="노드 텍스트 입력"
                />
                <button
                  className="mindmap-button primary"
                  onClick={addNode}
                >
                  추가
                </button>
              </div>
              
              {selectedNode.id !== "root" && (
                <button
                  className="mindmap-button danger"
                  onClick={deleteNode}
                >
                  노드 삭제
                </button>
              )}
            </div>
          ) : (
            <p className="mindmap-node-hint">노드를 선택하여 편집하세요</p>
          )}
        </aside>
      </main>
    </div>
  );

  // 줌 기능
  function zoomIn() {
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svg.node());
    svg.transition().call(
      d3.zoom().transform, 
      d3.zoomIdentity.translate(currentTransform.x, currentTransform.y)
        .scale(currentTransform.k * 1.2)
    );
  }

  function zoomOut() {
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svg.node());
    svg.transition().call(
      d3.zoom().transform, 
      d3.zoomIdentity.translate(currentTransform.x, currentTransform.y)
        .scale(currentTransform.k * 0.8)
    );
  }

  function resetZoom() {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom().transform, 
      d3.zoomIdentity.translate(DEFAULT_CONFIG.WIDTH/2, DEFAULT_CONFIG.HEIGHT/2).scale(1)
    );
  }
}