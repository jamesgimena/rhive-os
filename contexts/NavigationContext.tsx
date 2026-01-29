
import React, { createContext, useContext, useState } from 'react';

interface NavigationContextType {
    activePageId: string;
    setActivePageId: (id: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activePageId, setActivePageId] = useState<string>(''); 

    return (
        <NavigationContext.Provider value={{ activePageId, setActivePageId }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) throw new Error("useNavigation must be used within NavigationProvider");
    return context;
};
