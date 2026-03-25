
import React, { createContext, useContext, useState } from 'react';

interface NavigationContextType {
    activePageId: string;
    setActivePageId: (id: string) => void;
    selectedPropertyId: string | null;
    setSelectedPropertyId: (id: string | null) => void;
    selectedProjectId: string | null;
    setSelectedProjectId: (id: string | null) => void;
    selectedContactId: string | null;
    setSelectedContactId: (id: string | null) => void;
    selectedAccountId: string | null;
    setSelectedAccountId: (id: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activePageId, setActivePageId] = useState<string>('');
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

    return (
        <NavigationContext.Provider value={{
            activePageId,
            setActivePageId,
            selectedPropertyId,
            setSelectedPropertyId,
            selectedProjectId,
            setSelectedProjectId,
            selectedContactId,
            setSelectedContactId,
            selectedAccountId,
            setSelectedAccountId,
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) throw new Error("useNavigation must be used within NavigationProvider");
    return context;
};
