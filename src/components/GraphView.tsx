import React, { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface Node {
    id: string;
    name: string;
    val: number;
    group: string;
}

interface Link {
    source: string;
    target: string;
}

interface GraphData {
    nodes: Node[];
    links: Link[];
}

export default function GraphView() {
    const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<any>(null);

    useEffect(() => {
        // Load graph data
        fetch('/graph-data.json')
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error('Failed to load graph data:', err));

        // Handle resize
        const handleResize = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.clientWidth);
                setHeight(window.innerHeight - 200); // Adjust for header/footer
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNodeClick = (node: any) => {
        window.location.href = `/notes/${node.id}`;
    };

    const getNodeColor = (node: Node) => {
        switch (node.group) {
            case 'dev': return '#3b82f6'; // blue
            case 'design': return '#ec4899'; // pink
            case 'life': return '#10b981'; // green
            default: return '#9ca3af'; // gray
        }
    };

    return (
        <div ref={containerRef} className="graph-container" style={{ width: '100%', height: 'calc(100vh - 200px)' }}>
            {data.nodes.length > 0 ? (
                <ForceGraph2D
                    ref={graphRef}
                    width={width}
                    height={height}
                    graphData={data}
                    nodeLabel="name"
                    nodeColor={getNodeColor}
                    nodeRelSize={6}
                    linkColor={() => 'rgba(156, 163, 175, 0.2)'}
                    onNodeClick={handleNodeClick}
                    cooldownTicks={100}
                    onEngineStop={() => graphRef.current?.zoomToFit(400)}
                />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                    Loading graph...
                </div>
            )}
        </div>
    );
}
