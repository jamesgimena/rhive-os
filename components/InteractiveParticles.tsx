
import React, { useEffect, useRef } from 'react';

export const InteractiveParticles: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        
        // Helper to set canvas size
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };

        // Initial resize
        resizeCanvas();

        const particles: Particle[] = [];
        // Adjust particle count based on screen size to prevent lag
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80); 
        const connectionDistance = 150;
        const mouseDistance = 200;

        let mouseX = -1000;
        let mouseY = -1000;

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Mouse interaction - repel
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;
                    const directionX = forceDirectionX * force * 0.5;
                    const directionY = forceDirectionY * force * 0.5;

                    this.vx -= directionX;
                    this.vy -= directionY;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = '#ec028b';
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            // Draw connections
            ctx.strokeStyle = 'rgba(236, 2, 139, 0.15)'; // faint pink
            ctx.lineWidth = 1; 

            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                
                // Connection to mouse
                const dx = mouseX - particles[i].x;
                const dy = mouseY - particles[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouseDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            resizeCanvas();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouseX = -1000;
            mouseY = -1000;
        };

        window.addEventListener('resize', handleResize);
        
        const parent = canvas.parentElement;
        if (parent) {
             parent.addEventListener('mousemove', handleMouseMove);
             parent.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
             if (parent) {
                 parent.removeEventListener('mousemove', handleMouseMove);
                 parent.removeEventListener('mouseleave', handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-black pointer-events-none" />;
};

export default InteractiveParticles;
