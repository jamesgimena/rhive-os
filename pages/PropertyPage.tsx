
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { useNavigation } from '../contexts/NavigationContext';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { propertyService, projectService } from '../lib/firebaseService';
import { MapPinIcon, BuildingStorefrontIcon, ChevronRightIcon, PlusIcon } from '../components/icons';

const PropertyPage: React.FC = () => {
    const { setActivePageId, setSelectedPropertyId } = useNavigation();
    const { currentUser } = useMockDB();

    const [allProperties, setAllProperties] = useState<any[]>([]);
    const [allProjects, setAllProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch live properties and projects
    useEffect(() => {
        let isMounted = true;
        
        const unsubProps = propertyService.subscribe((data: any[]) => {
            if (isMounted) setAllProperties(data);
        });

        const unsubProjs = projectService.subscribe((data: any[]) => {
            if (isMounted) setAllProjects(data);
        });

        // Simulate short loading state
        const timer = setTimeout(() => {
            if (isMounted) setLoading(false);
        }, 600);

        return () => {
            isMounted = false;
            unsubProps();
            unsubProjs();
            clearTimeout(timer);
        };
    }, []);

    const isLeadStage = (stage?: string) => {
        if (!stage) return true;
        const s = stage.toLowerCase().trim();
        return s === 'lead' || s.includes('stage 1');
    };

    // Filter properties based on role and project stage
    const getVisibleProperties = () => {
        if (!currentUser) return [];

        let roleFiltered = allProperties;
        const role = currentUser.role;
        
        // For customers or external users, we trace their properties through their projects
        if (role !== 'Admin' && role !== 'Super Admin' && role !== 'Employee') {
            const myProjects = allProjects.filter(p => p.user_id === currentUser.id || p.account_id === currentUser.id);
            const myPropertyIds = new Set(myProjects.map(p => p.property_id).filter(Boolean));
            roleFiltered = allProperties.filter(prop => myPropertyIds.has(prop.id));
        }

        // Only show properties that have at least one project NOT in the Lead stage
        return roleFiltered.filter(prop => {
            const propProjects = allProjects.filter(p => p.property_id === prop.id);
            if (propProjects.length === 0) return false;
            return propProjects.some(p => !isLeadStage(p.current_stage));
        });
    };

    const properties = getVisibleProperties();

    const handleSelectProperty = (id: string) => {
        setSelectedPropertyId(id);
        // E-12 is the exact property profile page we just created/renamed. E-11 is currently generic. Let's assume we map E-11 to this list, and clicking goes to E-12 profile. Wait, if E-11 is list and E-12 is profile, we route to E-12 here.
        setActivePageId('E-12'); 
    };

    if (loading) {
        return (
            <PageContainer title="My Properties" description="Loading property records...">
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#ec028b] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer 
            title={currentUser?.role === 'Admin' || currentUser?.role === 'Employee' ? "All Properties" : "My Properties"} 
            description="Manage and track real estate assets tied to your projects."
        >
            <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-400 text-sm">
                    Showing <span className="font-bold text-white">{properties.length}</span> recorded properties.
                </p>
                <Button className="flex items-center gap-2 shadow-[0_0_15px_rgba(236,2,139,0.2)]">
                    <PlusIcon className="w-4 h-4" />
                    Add Property
                </Button>
            </div>

            {properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
                    <BuildingStorefrontIcon className="w-16 h-16 text-gray-700 mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-lg">No Properties Found</p>
                    <p className="text-gray-500 text-sm mt-2 text-center max-w-sm">
                        You do not have any properties associated with your account yet. Properties are automatically added when a project is started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {properties.map(property => {
                        const addressTitle = property.address_full || [property.property_address, property.city, property.state, property.zip].filter(Boolean).join(', ') || 'Unknown Address';
                        const relatedProjectsCount = allProjects.filter(p => p.property_id === property.id).length;

                        return (
                            <div 
                                key={property.id} 
                                onClick={() => handleSelectProperty(property.id)}
                                className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-[#ec028b]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,2,139,0.1)] overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ec028b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 bg-black border border-gray-800 rounded-xl flex items-center justify-center group-hover:bg-[#ec028b]/10 group-hover:border-[#ec028b]/30 transition-colors">
                                        <MapPinIcon className="w-6 h-6 text-gray-400 group-hover:text-[#ec028b] transition-colors" />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] bg-gray-900 border border-gray-800 px-2 py-0.5 rounded font-black uppercase tracking-widest text-gray-400">
                                            {property.type || 'Property'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="mt-5 space-y-1">
                                    <h3 className="text-white font-bold text-lg line-clamp-1">{property.property_address || addressTitle.split(',')[0]}</h3>
                                    <p className="text-gray-500 text-xs truncate">
                                        {property.city ? `${property.city}, ${property.state} ${property.zip}` : addressTitle}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            {relatedProjectsCount} Project{relatedProjectsCount !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 group-hover:border-[#ec028b] group-hover:text-[#ec028b] group-hover:bg-[#ec028b]/10 transition-colors">
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </PageContainer>
    );
};

export default PropertyPage;
