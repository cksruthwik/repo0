import React, { useState, useCallback } from 'react';
// --- React Flow Imports ---
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css'; // Import base styles
// --- End React Flow Imports ---

import './MindMapper.css'; // Your custom styles

// --- Initial Node/Edge Data Based on Dummy Summary ---
const initialNodes = [
  // Center Node
  { id: 'root', position: { x: 300, y: 150 }, data: { label: 'Webpage Focus:\nAI Technology (ChatGPT)' }, type: 'input', style: { width: 170, textAlign: 'center' } },

  // Main Branches
  { id: 'apps', position: { x: 100, y: 250 }, data: { label: 'Applications' } },
  { id: 'research', position: { x: 500, y: 250 }, data: { label: 'Research & Dev' } },
  { id: 'aspects', position: { x: 300, y: 350 }, data: { label: 'Other Aspects' } },

  // Application Examples
  { id: 'math-tutor', position: { x: 0, y: 350 }, data: { label: 'Custom Math Tutor' } },
  { id: 'openai-biz', position: { x: 150, y: 350 }, data: { label: 'OpenAI for Business' } },

  // Research/Aspects Details
  { id: 'ethics', position: { x: 500, y: 350 }, data: { label: 'Ethical Discussions' } },
  { id: 'promo', position: { x: 300, y: 450 }, data: { label: 'Promotional Nature?' }, style: { background: '#fffbe6' } }, // Slightly different style
  { id: 'integration', position: { x: 100, y: 450 }, data: { label: 'Integration' } },


];

const initialEdges = [
  // Connect Root to main branches
  { id: 'e-root-apps', source: 'root', target: 'apps', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-root-research', source: 'root', target: 'research', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-root-aspects', source: 'root', target: 'aspects', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },

  // Connect Applications to examples
  { id: 'e-apps-math', source: 'apps', target: 'math-tutor', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-apps-biz', source: 'apps', target: 'openai-biz', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },

  // Connect Research/Aspects
  { id: 'e-research-ethics', source: 'research', target: 'ethics', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-aspects-promo', source: 'aspects', target: 'promo', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-aspects-integration', source: 'aspects', target: 'integration', type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },

];
// --- End Sample Data ---

function MindMapper() {
  // --- React Flow State Hooks ---
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // --- Callback for connecting nodes ---
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  );

  // --- State for Update Simulation (Keep existing) ---
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('Idle');

  // --- Simulate API call & Map Update (Keep existing simulation logic) ---
  const handleUpdateClick = async () => {
    setIsUpdating(true);
    setUpdateStatus('Requesting update...');
    console.log("MindMapper: Update requested.");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUpdateStatus('Update started...');
      console.log("MindMapper: Simulating update...");
      // Example: Add a node related to 'Ethics'
      const newNodeId = `ethics-detail-${Date.now()}`;
      const newNode = {
        id: newNodeId,
        position: { x: 650, y: 350 + Math.random() * 50 },
        data: { label: 'Responsible AI' },
        style: { background: '#d1f7c4', borderColor: '#73d13d' }
      };
      const newEdge = {
        id: `e-ethics-${newNodeId}`, source: 'ethics', target: newNodeId,
        type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed }
      };
      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => eds.concat(newEdge));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUpdateStatus('Update complete. New node added.');
      console.log("MindMapper: Update complete.");
    } catch (error) { /* ... error handling ... */ }
    finally { setTimeout(() => { setIsUpdating(false); }, 500); }
  };

  return (
    <div className="mindmapper-container">
      <h3>Mind Mapping</h3>

      <button
        className="update-button primary-action-button"
        onClick={handleUpdateClick}
        disabled={isUpdating}
      >
        {isUpdating ? 'Updating...' : 'Update Mind Map'}
      </button>

      <p className="update-status">
        Status: {updateStatus}
      </p>

      {/* --- React Flow Visualization Area --- */}
      <div className="mindmap-display-area">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView // Zoom to fit content initially
          className="react-flow-canvas"
        >
          <Controls />
          <Background variant="dots" gap={16} size={1} />
        </ReactFlow>
      </div>
      {/* --- End Visualization Area --- */}

       <p className="info-text">
         Interactive mind map based on summary content. Drag nodes to rearrange.
       </p>
    </div>
  );
}

export default MindMapper;