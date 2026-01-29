
import React from 'react';
import { cn } from '../../lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
    const chamferSize = "24px";

    // CLIP PATH for Backgrounds (Matches the border logic)
    const clipPathValue = `polygon(
        ${chamferSize} 0,
        100% 0,
        100% calc(100% - ${chamferSize}),
        calc(100% - ${chamferSize}) 100%,
        0 100%,
        0 ${chamferSize}
    )`;

    return (
        <div 
            ref={ref} 
            className={cn('relative flex flex-col group isolate transition-all duration-300', className)} 
            {...props}
        >
            {/* 1. Background Layers (Clipped) - Clear/Black only with blur */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-md transition-colors duration-300 z-[-2]"
                style={{ clipPath: clipPathValue }}
            />
            <div
                className="absolute inset-[1px] bg-black/40 z-[-1] overflow-hidden"
                style={{ clipPath: clipPathValue }}
            >
                {/* Overlay to ensure text readability while remaining clear */}
                <div className="absolute inset-0 bg-black/20 z-0" />
            </div>

            {/* 2. BORDER CONSTRUCTION (Manual Placement - Gray Only) */}
            {/* Left Border */}
            <div className="absolute left-0 top-6 bottom-0 w-[1px] bg-gray-800/80 z-10" />
            
            {/* Top Border */}
            <div className="absolute left-6 right-0 top-0 h-[1px] bg-gray-800/80 z-10" />

            {/* Right Border */}
            <div className="absolute right-0 top-0 bottom-6 w-[1px] bg-gray-800/80 z-10" />

            {/* Bottom Border */}
            <div className="absolute left-0 right-6 bottom-0 h-[1px] bg-gray-800/80 z-10" />

            {/* Top-Left Chamfer SVG (Gray Base Only) */}
            <svg className="absolute top-0 left-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                <line x1="0" y1="24" x2="24" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
            </svg>

            {/* Bottom-Right Chamfer SVG (Gray Base Only) */}
            <svg className="absolute bottom-0 right-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                <line x1="0" y1="24" x2="24" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
            </svg>

            {/* 3. Card Content */}
            <div className="relative z-20 h-full">
                {children}
            </div>
        </div>
    );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6 border-b border-gray-800/50', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-xl font-bold text-gray-100 tracking-tight uppercase', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-gray-400 font-medium', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-6', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
