import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { useNavigation } from '../contexts/NavigationContext';
import { firestoreService, projectService } from '../lib/firebaseService';
import { UserIcon, ChevronRightIcon, PlusIcon, MailIcon, BriefcaseIcon } from '../components/icons';
import { cn } from '../lib/utils';

const roleColor = (role?: string) => {
    const r = (role || '').toLowerCase();
    if (r.includes('customer')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (r.includes('primary')) return 'bg-[#ec028b]/10 text-[#ec028b] border-[#ec028b]/30';
    if (r.includes('owner')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    return 'bg-gray-800 text-gray-400 border-gray-700';
};

const ContactsListPage: React.FC = () => {
    const { setActivePageId, setSelectedContactId } = useNavigation();

    const [contacts, setContacts] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('All');

    useEffect(() => {
        let contactsDone = false;
        let projectsDone = false;
        const finish = () => { if (contactsDone && projectsDone) setLoading(false); };

        const unsubContacts = firestoreService.subscribeToDocuments('contacts', (data: any[]) => {
            setContacts(data);
            contactsDone = true;
            finish();
        });

        const unsubProjects = projectService.subscribe((data: any[]) => {
            setProjects(data);
            projectsDone = true;
            finish();
        });

        return () => {
            unsubContacts();
            unsubProjects();
        };
    }, []);

    const handleSelectContact = (id: string) => {
        setSelectedContactId(id);
        setActivePageId('E-10');
    };

    const roles = ['All', ...Array.from(new Set(contacts.map(c => c.role || 'Other').filter(Boolean)))];

    const isLeadStage = (stage?: string) => {
        if (!stage) return true;
        const s = stage.toLowerCase().trim();
        return s === 'lead' || s.includes('stage 1');
    };

    const validContacts = contacts.filter(c => {
        const contactProjects = projects.filter(p => p.id === c.project_id || (p.contacts && p.contacts.some((cp: any) => cp.id === c.id)));
        if (contactProjects.length === 0) return false;
        return contactProjects.some(p => !isLeadStage(p.current_stage));
    });

    const filtered = validContacts
        .filter(c => filterRole === 'All' || (c.role || 'Other') === filterRole)
        .filter(c => {
            if (!search) return true;
            const name = `${c.first_name || ''} ${c.last_name || ''} ${c.name || ''}`.toLowerCase();
            return name.includes(search.toLowerCase()) ||
                (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
                (c.phone || '').includes(search);
        });

    if (loading) {
        return (
            <PageContainer title="Contacts" description="Loading contact records...">
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#ec028b] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="Contacts"
            description="All linked contacts — customers, primary contacts, and stakeholders."
        >
            {/* Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search contacts..."
                            className="w-64 pl-4 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/50 transition"
                        />
                    </div>
                    <div className="flex gap-1 flex-wrap">
                        {roles.slice(0, 5).map(role => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all",
                                    filterRole === role
                                        ? 'bg-[#ec028b]/20 text-[#ec028b] border-[#ec028b]/40'
                                        : 'bg-gray-900/50 text-gray-500 border-gray-800 hover:text-white'
                                )}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                    <span className="text-gray-500 text-sm font-mono">
                        {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <Button className="flex items-center gap-2 shadow-[0_0_15px_rgba(236,2,139,0.2)]">
                    <PlusIcon className="w-4 h-4" />
                    Add Contact
                </Button>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
                    <UserIcon className="w-16 h-16 text-gray-700 mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-lg">No Contacts Found</p>
                    <p className="text-gray-500 text-sm mt-2 text-center max-w-sm">
                        {search ? `No contacts matching "${search}".` : 'Contacts are created when leads are submitted through the intake form.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map(contact => {
                        const name = contact.first_name || contact.last_name
                            ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                            : contact.name || 'Unknown Contact';
                        const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

                        const linkedProject = projects.find(p => p.id === contact.project_id);

                        return (
                            <div
                                key={contact.id}
                                onClick={() => handleSelectContact(contact.id)}
                                className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-[#ec028b]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,2,139,0.1)] overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ec028b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#ec028b]/20 to-black border border-[#ec028b]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#ec028b] font-black text-sm">{initials || '?'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-[#ec028b] transition-colors">
                                            {name}
                                        </h3>
                                        {contact.role && (
                                            <span className={cn(
                                                'text-[9px] px-2 py-0.5 rounded border font-black uppercase tracking-widest',
                                                roleColor(contact.role)
                                            )}>
                                                {contact.role}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {contact.email && (
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <MailIcon className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{contact.email}</span>
                                        </div>
                                    )}
                                    {linkedProject && (
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <BriefcaseIcon className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{linkedProject.name || 'Linked Project'}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-600 font-mono">
                                        {contact.is_primary ? '★ Primary Contact' : contact.phone || 'No phone'}
                                    </span>
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

export default ContactsListPage;
