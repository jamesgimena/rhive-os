
import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '../components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Button from '../components/Button';
import {
    MagnifyingGlassIcon,
    UserIcon,
    MapPinIcon,
    BriefcaseIcon,
    BuildingStorefrontIcon,
    BoltIcon,
    ArrowRightIcon,
    XIcon,
    PlusIcon
} from '../components/icons';
import { useNavigation } from '../contexts/NavigationContext';
import { cn, getStagePageId } from '../lib/utils';
import { firestoreService, contactService, projectService } from '../lib/firebaseService';

// ─── Types ────────────────────────────────────────────────────────────────────
interface FirebaseContact {
    id: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    project_id?: string;
    created_at?: string;
    [key: string]: any;
}

interface FirebaseProject {
    id: string;
    name?: string;
    status?: string;
    current_stage?: string;
    property_address?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

interface FirebaseProperty {
    id: string;
    address_full?: string;
    property_address?: string;
    city?: string;
    state?: string;
    zip?: string;
    type?: string;
    coordinates?: { lat: number; lng: number };
    features?: string[];
    created_at?: string;
    [key: string]: any;
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
const RowSkeleton = () => (
    <div className="flex items-center p-5 gap-4 animate-pulse">
        <div className="h-12 w-12 rounded-xl bg-gray-800 shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-800 rounded w-48" />
            <div className="h-3 bg-gray-800/60 rounded w-32" />
        </div>
    </div>
);

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({
    icon: Icon,
    title,
    count,
    loading,
    action,
}: {
    icon: React.FC<any>;
    title: string;
    count?: number;
    loading?: boolean;
    action?: React.ReactNode;
}) => (
    <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800/50 bg-white/5">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-rhive-pink/10 rounded-lg">
                <Icon className="w-5 h-5 text-rhive-pink" />
            </div>
            <div className="flex items-center gap-2">
                <CardTitle className="text-sm tracking-[0.2em]">{title}</CardTitle>
                {!loading && count !== undefined && (
                    <span className="text-[10px] font-bold bg-rhive-pink/20 text-rhive-pink border border-rhive-pink/30 px-2 py-0.5 rounded-full">
                        {count}
                    </span>
                )}
                {loading && (
                    <div className="h-4 w-6 bg-gray-800 rounded-full animate-pulse" />
                )}
            </div>
        </div>
        {action}
    </CardHeader>
);

// ─── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ message }: { message: string }) => (
    <div className="p-10 text-center text-gray-600 text-sm italic">{message}</div>
);

// ─── Stage Badge ───────────────────────────────────────────────────────────────
const stageBadgeColor = (stage?: string) => {
    const s = (stage || '').toLowerCase();
    if (s.includes('lead')) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    if (s.includes('quote')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (s.includes('sign')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (s.includes('install') || s.includes('progress')) return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    if (s.includes('complet') || s.includes('paid')) return 'bg-green-500/10 text-green-400 border-green-500/30';
    return 'bg-gray-800 text-gray-400 border-gray-700';
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const GlobalNavCustomerLookup: React.FC = () => {
    const { setActivePageId, setSelectedPropertyId, setSelectedProjectId, setSelectedContactId } = useNavigation();

    // ── Firebase State ──
    const [contacts, setContacts] = useState<FirebaseContact[]>([]);
    const [projects, setProjects] = useState<FirebaseProject[]>([]);
    const [properties, setProperties] = useState<FirebaseProperty[]>([]);

    const [loadingContacts, setLoadingContacts] = useState(true);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingProperties, setLoadingProperties] = useState(true);

    // ── Search ──
    const [query, setQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    // ── Firebase Realtime Subscriptions ───────────────────────────────────────
    useEffect(() => {
        // Contacts module → 'contacts' collection
        const unsubContacts = firestoreService.subscribeToDocuments('contacts', (data) => {
            setContacts(data as FirebaseContact[]);
            setLoadingContacts(false);
        });

        // Deals module → 'project' collection
        const unsubProjects = projectService.subscribe((data) => {
            setProjects(data as FirebaseProject[]);
            setLoadingProjects(false);
        });

        // Properties module → 'properties' collection
        const unsubProperties = firestoreService.subscribeToDocuments('properties', (data) => {
            setProperties(data as FirebaseProperty[]);
            setLoadingProperties(false);
        });

        return () => {
            unsubContacts();
            unsubProjects();
            unsubProperties();
        };
    }, []);

    // ── Search Filter ──────────────────────────────────────────────────────────
    const lowerQ = query.toLowerCase().trim();

    const filteredContacts = lowerQ
        ? contacts.filter(c => {
            const fullName = `${c.first_name || ''} ${c.last_name || ''} ${c.name || ''}`.toLowerCase();
            return fullName.includes(lowerQ) || (c.email || '').toLowerCase().includes(lowerQ) || (c.role || '').toLowerCase().includes(lowerQ) || (c.phone || '').includes(lowerQ);
        })
        : contacts;

    const filteredProjects = lowerQ
        ? projects.filter(p =>
            (p.name || '').toLowerCase().includes(lowerQ) ||
            (p.status || '').toLowerCase().includes(lowerQ) ||
            (p.current_stage || '').toLowerCase().includes(lowerQ) ||
            (p.property_address || '').toLowerCase().includes(lowerQ)
        )
        : projects;

    const filteredProperties = lowerQ
        ? properties.filter(p =>
            (p.address_full || '').toLowerCase().includes(lowerQ) ||
            (p.property_address || '').toLowerCase().includes(lowerQ) ||
            (p.city || '').toLowerCase().includes(lowerQ) ||
            (p.type || '').toLowerCase().includes(lowerQ)
        )
        : properties;

    const getContactDisplayName = (c: FirebaseContact) => {
        if (c.first_name || c.last_name) return `${c.first_name || ''} ${c.last_name || ''}`.trim();
        return c.name || 'Unknown Contact';
    };

    const getPropertyAddress = (p: FirebaseProperty) =>
        p.address_full || [p.property_address, p.city, p.state, p.zip].filter(Boolean).join(', ') || 'Unknown Address';

    const isLeadStage = (stage?: string) => {
        const s = (stage || '').toLowerCase().trim();
        return s === 'lead' || s.includes('stage 1');
    };

    const handleProjectClick = (proj: FirebaseProject) => {
        setSelectedProjectId(proj.id);
        setActivePageId(getStagePageId(proj.current_stage));
    };

    const handleContactClick = (c: FirebaseContact) => {
        const contactProjects = projects.filter(p => 
            p.user_id === c.id || p.account_id === c.id || p.owner_id === c.id || p.project_id === c.id || (p.contacts && p.contacts.some((cp: any) => cp.id === c.id))
        );
        const isConverted = contactProjects.length > 0 && contactProjects.some(p => !isLeadStage(p.current_stage));

        setSelectedContactId(c.id);
        setActivePageId(isConverted ? 'E-10' : 'E-TEMP'); // Contact Profile page or Pre-conversion
    };

    const handlePropertyClick = (p: FirebaseProperty) => {
        const propProjects = projects.filter(proj => proj.property_id === p.id);
        const isConverted = propProjects.length > 0 && propProjects.some(proj => !isLeadStage(proj.current_stage));

        setSelectedPropertyId(p.id);
        setActivePageId(isConverted ? 'E-12' : 'E-TEMP'); // Property Profile page or Pre-conversion
    };

    const anyLoading = loadingContacts || loadingProjects || loadingProperties;

    return (
        <div className="relative h-full w-full overflow-hidden">
            <PageContainer
                title="Dispatch & Search"
                description="Global QOS node lookup. Access any contact, deal, or property record — live from Firebase."
            >
                {/* ── Search HUD ── */}
                <div className="flex flex-col items-center justify-center mb-12 sticky top-0 z-40 py-4 -mt-4">
                    <div className="w-full max-w-4xl relative group">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                            <MagnifyingGlassIcon className={cn(
                                "h-6 w-6 transition-all duration-500",
                                hasSearched ? 'text-rhive-pink drop-shadow-[0_0_8px_#ec028b]' : 'text-gray-600'
                            )} />
                        </div>
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-xl z-0"
                            style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
                        />
                        <input
                            id="global-dispatch-search"
                            type="text"
                            className="block w-full pl-16 pr-6 py-6 bg-transparent border border-gray-800 focus:border-rhive-pink rounded-none leading-5 text-white placeholder-gray-600 focus:outline-none focus:ring-0 transition-all duration-300 text-xl relative z-10 font-sans tracking-tight"
                            placeholder="Search contacts, deals, properties…"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setHasSearched(e.target.value.length > 0);
                            }}
                            autoFocus
                            style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
                        />
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible opacity-30 group-focus-within:opacity-100 transition-opacity">
                            <path d="M 20 0 L 0 20 M calc(100% - 20px) 100% L 100% calc(100% - 20px)" stroke="#ec028b" strokeWidth="2" />
                        </svg>

                        {/* Live status badge */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5">
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                anyLoading ? "bg-yellow-400 animate-pulse" : "bg-green-400"
                            )} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                {anyLoading ? 'Syncing…' : 'Live'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10 max-w-6xl mx-auto pb-32">

                    {/* ── PEOPLE & ENTITIES (Contacts Module) ── */}
                    <Card className="overflow-visible border-gray-800/40">
                        <SectionHeader
                            icon={UserIcon}
                            title="People & Entities"
                            count={filteredContacts.length}
                            loading={loadingContacts}
                            action={
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 text-[10px]"
                                    onClick={() => setActivePageId('E-02a')}
                                >
                                    <PlusIcon className="w-3 h-3 mr-1" /> New Contact
                                </Button>
                            }
                        />
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-800/30">
                                {loadingContacts ? (
                                    <>{[0, 1, 2].map(i => <RowSkeleton key={i} />)}</>
                                ) : filteredContacts.length === 0 ? (
                                    <EmptyState message={hasSearched ? `No contacts matching "${query}"` : "No contacts in Firebase yet. Add your first contact."} />
                                ) : (
                                    filteredContacts.map((contact) => (
                                        <div
                                            key={contact.id}
                                            onClick={() => handleContactClick(contact)}
                                            className="flex items-center p-5 hover:bg-rhive-pink/5 transition-all cursor-pointer group relative overflow-hidden"
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rhive-pink scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                            <div className="h-12 w-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-rhive-pink mr-5 shrink-0 group-hover:border-rhive-pink/50 group-hover:shadow-pink-glow-sm transition-all">
                                                {(contact.role || '').toLowerCase().includes('contractor') || (contact.role || '').toLowerCase().includes('supplier')
                                                    ? <BuildingStorefrontIcon className="h-6 w-6" />
                                                    : <UserIcon className="h-6 w-6" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-bold text-white group-hover:text-rhive-pink transition-colors truncate">
                                                    {getContactDisplayName(contact)}
                                                </h4>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                                    {contact.role && (
                                                        <span className="uppercase tracking-widest">{contact.role}</span>
                                                    )}
                                                    {contact.role && contact.email && <span className="opacity-30">•</span>}
                                                    {contact.email && (
                                                        <span className="font-mono truncate max-w-[200px]">{contact.email}</span>
                                                    )}
                                                    {contact.phone && (
                                                        <>
                                                            <span className="opacity-30">•</span>
                                                            <span className="font-mono">{contact.phone}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <ArrowRightIcon className="w-5 h-5 text-gray-700 group-hover:text-rhive-pink group-hover:translate-x-1 transition-all shrink-0" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── ACTIVE PROJECTS (Deals Module) ── */}
                    <Card className="overflow-visible border-gray-800/40">
                        <SectionHeader
                            icon={BriefcaseIcon}
                            title="Active Projects"
                            count={filteredProjects.length}
                            loading={loadingProjects}
                            action={
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 text-[10px]"
                                    onClick={() => setActivePageId('E-02a')}
                                >
                                    <PlusIcon className="w-3 h-3 mr-1" /> Start New
                                </Button>
                            }
                        />
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-800/30">
                                {loadingProjects ? (
                                    <>{[0, 1, 2].map(i => <RowSkeleton key={i} />)}</>
                                ) : filteredProjects.length === 0 ? (
                                    <EmptyState message={hasSearched ? `No projects matching "${query}"` : "No projects in Firebase yet. Create your first deal."} />
                                ) : (
                                    filteredProjects.map((proj) => (
                                        <div
                                            key={proj.id}
                                            onClick={() => handleProjectClick(proj)}
                                            className="flex items-center p-5 hover:bg-rhive-pink/5 transition-all cursor-pointer group relative overflow-hidden"
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rhive-pink scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                            <div className="h-12 w-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-rhive-pink mr-5 shrink-0 group-hover:border-rhive-pink/50 group-hover:shadow-pink-glow-sm transition-all">
                                                <BriefcaseIcon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-bold text-white group-hover:text-rhive-pink transition-colors truncate">
                                                    {proj.name || 'Unnamed Project'}
                                                </h4>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                                    {proj.current_stage && (
                                                        <span className={cn(
                                                            "uppercase tracking-widest px-2 py-0.5 rounded-full border text-[10px] font-black",
                                                            stageBadgeColor(proj.current_stage)
                                                        )}>
                                                            {proj.current_stage}
                                                        </span>
                                                    )}
                                                    {proj.property_address && (
                                                        <>
                                                            <span className="opacity-30">•</span>
                                                            <span className="font-mono truncate max-w-[200px]">{proj.property_address}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 shrink-0">
                                                {proj.status && (
                                                    <div className="hidden md:block text-right">
                                                        <p className="text-[10px] text-gray-600 font-bold uppercase">Status</p>
                                                        <p className="text-white font-mono font-bold text-sm">{proj.status}</p>
                                                    </div>
                                                )}
                                                <button className="h-10 w-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 group-hover:border-rhive-pink group-hover:text-rhive-pink transition-all">
                                                    <BoltIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── PROPERTIES & SITES (Properties Module) ── */}
                    <Card className="overflow-visible border-gray-800/40">
                        <SectionHeader
                            icon={MapPinIcon}
                            title="Properties & Sites"
                            count={filteredProperties.length}
                            loading={loadingProperties}
                            action={
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 text-[10px]"
                                    onClick={() => setActivePageId('E-12')}
                                >
                                    <PlusIcon className="w-3 h-3 mr-1" /> Add Site
                                </Button>
                            }
                        />
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-800/30">
                                {loadingProperties ? (
                                    <>{[0, 1, 2].map(i => <RowSkeleton key={i} />)}</>
                                ) : filteredProperties.length === 0 ? (
                                    <EmptyState message={hasSearched ? `No properties matching "${query}"` : "No properties in Firebase yet."} />
                                ) : (
                                    filteredProperties.map((prop) => (
                                        <div
                                            key={prop.id}
                                            className="flex items-center p-5 hover:bg-rhive-pink/5 transition-all cursor-pointer group relative overflow-hidden"
                                            onClick={() => handlePropertyClick(prop)}
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rhive-pink scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                            <div className="h-12 w-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-rhive-pink mr-5 shrink-0 group-hover:border-rhive-pink/50 group-hover:shadow-pink-glow-sm transition-all">
                                                <MapPinIcon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-bold text-white group-hover:text-rhive-pink transition-colors truncate">
                                                    {getPropertyAddress(prop)}
                                                </h4>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                                    {prop.type && (
                                                        <span className="uppercase tracking-widest">{prop.type}</span>
                                                    )}
                                                    {prop.coordinates && (
                                                        <>
                                                            <span className="opacity-30">•</span>
                                                            <span className="font-mono text-[10px]">
                                                                {prop.coordinates.lat?.toFixed(2)}, {prop.coordinates.lng?.toFixed(2)}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {prop.features && prop.features.length > 0 && (
                                                <div className="flex gap-1 flex-wrap justify-end max-w-[140px] shrink-0">
                                                    {prop.features.slice(0, 3).map((f: string) => (
                                                        <span key={f} className="text-[8px] bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-gray-500 uppercase font-black">
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <ArrowRightIcon className="w-5 h-5 ml-3 text-gray-700 group-hover:text-rhive-pink group-hover:translate-x-1 transition-all shrink-0" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </PageContainer>
        </div>
    );
};

export default GlobalNavCustomerLookup;
