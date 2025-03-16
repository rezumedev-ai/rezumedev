
import { useRef, useEffect } from 'react';
import p5 from 'p5';

interface P5BackgroundProps {
  className?: string;
}

export const P5Background = ({ className }: P5BackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup the sketch
    const sketch = (p: p5) => {
      const particles: Particle[] = [];
      const icons: string[] = ['📄', '📝', '🎯', '💼', '📊', '✅', '👔'];
      
      class Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        icon: string;
        opacity: number;
        rotationSpeed: number;
        rotation: number;
        
        constructor() {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.size = p.random(15, 30);
          this.speedX = p.random(-0.3, 0.3);
          this.speedY = p.random(-0.3, 0.3);
          this.icon = icons[Math.floor(p.random(icons.length))];
          this.opacity = p.random(0.1, 0.3);
          this.rotationSpeed = p.random(-0.01, 0.01);
          this.rotation = p.random(0, p.TWO_PI);
        }
        
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          this.rotation += this.rotationSpeed;
          
          // Boundary check
          if (this.x < 0) this.x = p.width;
          if (this.x > p.width) this.x = 0;
          if (this.y < 0) this.y = p.height;
          if (this.y > p.height) this.y = 0;
        }
        
        display() {
          p.push();
          p.translate(this.x, this.y);
          p.rotate(this.rotation);
          p.textSize(this.size);
          p.textAlign(p.CENTER, p.CENTER);
          p.fill(100, 100, 255, this.opacity * 255);
          p.text(this.icon, 0, 0);
          p.pop();
        }
      }
      
      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current?.offsetWidth || p.windowWidth,
          containerRef.current?.offsetHeight || p.windowHeight
        );
        canvas.position(0, 0);
        canvas.style('z-index', '-1');
        
        // Create particles
        for (let i = 0; i < 30; i++) {
          particles.push(new Particle());
        }
      };
      
      p.draw = () => {
        p.clear();
        
        // Update and display particles
        for (const particle of particles) {
          particle.update();
          particle.display();
        }
      };
      
      p.windowResized = () => {
        if (!containerRef.current) return;
        p.resizeCanvas(
          containerRef.current.offsetWidth,
          containerRef.current.offsetHeight
        );
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
