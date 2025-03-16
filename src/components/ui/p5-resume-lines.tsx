
import { useRef, useEffect } from 'react';
import p5 from 'p5';

interface P5ResumeLinesProps {
  className?: string;
}

export const P5ResumeLines = ({ className }: P5ResumeLinesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup the sketch
    const sketch = (p: p5) => {
      const nodes: Node[] = [];
      const nodeCount = 8;
      
      class Node {
        x: number;
        y: number;
        size: number;
        connections: Node[];
        
        constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
          this.size = p.random(3, 6);
          this.connections = [];
        }
        
        connect(otherNode: Node) {
          if (!this.connections.includes(otherNode)) {
            this.connections.push(otherNode);
          }
        }
        
        display() {
          p.noStroke();
          p.fill(100, 100, 255, 100);
          p.ellipse(this.x, this.y, this.size);
          
          p.stroke(100, 100, 255, 50);
          p.strokeWeight(1);
          
          for (const connection of this.connections) {
            p.line(this.x, this.y, connection.x, connection.y);
          }
        }
      }
      
      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current?.offsetWidth || p.windowWidth,
          containerRef.current?.offsetHeight || p.windowHeight
        );
        canvas.position(0, 0);
        canvas.style('z-index', '-1');
        
        // Create nodes along a resume-like structure
        const centerX = p.width / 2;
        const startY = p.height * 0.2;
        const endY = p.height * 0.8;
        const sectionHeight = (endY - startY) / (nodeCount - 1);
        
        for (let i = 0; i < nodeCount; i++) {
          // Add nodes on a vertical line (like a resume timeline)
          const mainNode = new Node(centerX, startY + i * sectionHeight);
          nodes.push(mainNode);
          
          // Add some offset nodes to create a document-like structure
          if (i > 0 && i < nodeCount - 1) {
            const leftNode = new Node(centerX - p.random(50, 150), startY + i * sectionHeight + p.random(-20, 20));
            const rightNode = new Node(centerX + p.random(50, 150), startY + i * sectionHeight + p.random(-20, 20));
            
            nodes.push(leftNode);
            nodes.push(rightNode);
            
            mainNode.connect(leftNode);
            mainNode.connect(rightNode);
            
            // Connect to previous nodes occasionally
            if (i > 1 && p.random() > 0.5) {
              const prevMainNode = nodes[i - 1];
              leftNode.connect(prevMainNode);
            }
          }
        }
        
        // Connect sequential main nodes
        for (let i = 0; i < nodeCount - 1; i++) {
          nodes[i].connect(nodes[i + 1]);
        }
      };
      
      p.draw = () => {
        p.clear();
        
        // Display all nodes and their connections
        for (const node of nodes) {
          node.display();
        }
      };
      
      p.windowResized = () => {
        if (!containerRef.current) return;
        p.resizeCanvas(
          containerRef.current.offsetWidth,
          containerRef.current.offsetHeight
        );
        
        // Reset nodes when window is resized
        nodes.length = 0;
        p.setup();
      };
    };
    
    // Initialize the sketch
    sketchRef.current = new p5(sketch, containerRef.current);
    
    // Cleanup
    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
      }
    };
  }, []);
  
  return <div ref={containerRef} className={`absolute inset-0 ${className}`} />;
};
