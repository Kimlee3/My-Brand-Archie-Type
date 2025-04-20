import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

// 기본 빈 마인드맵 데이터
const emptyMindMap = {
  nodes: [
    { id: "root", label: "새 마인드맵", level: 0 }
  ],
  edges: [],
  style: {
    theme: "light",
  }
};

export default function MindMap() {
  const [data, setData] = useState(null);
  const [newNodeText, setNewNodeText] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [rootText, setRootText] = useState("");
  const svgRef = useRef(null);

  // 마인드맵 렌더링
  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const g = svg.append("g");

    // 줌 기능 추가
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // 초기 중앙 위치로 설정
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2));

    // 방사형 레이아웃 생성
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.edges)
        .id(d => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(0, 0))
      .force("collision", d3.forceCollide().radius(70));

    // 연결선 그리기
    const links = g.selectAll(".link")
      .data(data.edges)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    // 노드 그룹 생성
    const nodes = g.selectAll(".node")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (e, d) => {
        e.stopPropagation();
        setSelectedNode(d);
      });

    // 노드 원 그리기
    nodes.append("circle")
      .attr("r", d => d.level === 0 ? 40 : 30)
      .attr("fill", d => {
        if (d.level === 0) return "#ff5722";
        if (d.level === 1) return "#2196f3";
        return "#4caf50";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // 노드 텍스트 추가
    nodes.append("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#fff")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    // 시뮬레이션 업데이트 함수
    simulation.on("tick", () => {
      links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodes.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

    // 드래그 이벤트 핸들러
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
    svg.on("click", () => {
      setSelectedNode(null);
    });

  }, [data]);

  // 새 노드 추가
  const addNode = () => {
    if (!selectedNode || !newNodeText.trim()) return;

    const newNodeId = `node-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      label: newNodeText,
      level: selectedNode.level + 1,
      parentId: selectedNode.id
    };

    const newEdge = {
      source: selectedNode.id,
      target: newNodeId
    };

    setData(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      edges: [...prev.edges, newEdge]
    }));

    setNewNodeText("");
  };

  // 새 마인드맵 생성
  const createNewMindMap = () => {
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
  };

  // UI 렌더링
  if (!data) {
    return (
      <div>
        <input
          type="text"
          placeholder="중심 주제 입력"
          value={rootText}
          onChange={(e) => setRootText(e.target.value)}
        />
        <button onClick={createNewMindMap}>새 마인드맵 생성</button>
      </div>
    );
  }

  return (
    <div>
      <svg ref={svgRef} width="800" height="600"></svg>
      <input
        type="text"
        placeholder="새 노드 텍스트"
        value={newNodeText}
        onChange={(e) => setNewNodeText(e.target.value)}
      />
      <button onClick={addNode}>노드 추가</button>
    </div>
  );
}