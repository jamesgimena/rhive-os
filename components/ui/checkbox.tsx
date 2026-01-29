import React from 'react';
import { cn } from '../../lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    const [checked, setChecked] = React.useState(props.checked || false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setChecked(isChecked);
        if(onCheckedChange) {
            onCheckedChange(isChecked);
        }
        if(props.onChange) {
            props.onChange(e);
        }
    };

    React.useEffect(() => {
        setChecked(props.checked || false);
    }, [props.checked]);

    return (
        <div className="relative flex items-center">
            <input
                type="checkbox"
                ref={ref}
                {...props}
                checked={checked}
                onChange={handleChange}
                className={cn(
                    "peer h-4 w-4 shrink-0 rounded-sm border border-gray-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-pink-500 checked:border-pink-500/70 appearance-none",
                    className
                )}
             />
        </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
