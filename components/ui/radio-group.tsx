import * as React from 'react';
import { cn } from '../../lib/utils';

// Simplified RadioGroup implementation
interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string;
    onValueChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
}>({value: '', onValueChange: () => {}});

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ className, value = '', onValueChange = () => {}, children, ...props }, ref) => {
        return (
            <RadioGroupContext.Provider value={{ value, onValueChange }}>
                <div ref={ref} className={cn('grid gap-2', className)} {...props}>
                    {children}
                </div>
            </RadioGroupContext.Provider>
        );
    }
);
RadioGroup.displayName = 'RadioGroup';

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
    ({ className, ...props }, ref) => {
        const context = React.useContext(RadioGroupContext);
        return (
            <input
                type="radio"
                ref={ref}
                checked={context.value === props.value}
                onChange={(e) => context.onValueChange(e.target.value)}
                className={cn('h-4 w-4 text-[#ec028b] focus:ring-pink-500/70 border-gray-600 bg-gray-800', className)}
                {...props}
            />
        );
    }
);
RadioGroupItem.displayName = 'RadioGroupItem';


export { RadioGroup, RadioGroupItem };
