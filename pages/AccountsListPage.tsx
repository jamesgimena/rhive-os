import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { useNavigation } from '../contexts/NavigationContext';
import { accountService, projectService } from '../lib/firebaseService';
import { UserIcon, BriefcaseIcon, ChevronRightIcon, PlusIcon, MailIcon } from '../components/icons';

const AccountsListPage: React.FC = () => {
    const { setActivePageId, setSelectedAccountId } = useNavigation();

    const [accounts, setAccounts] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        let accountsDone = false;
        let projectsDone = false;

        const finish = () => {
            if (accountsDone && projectsDone) setLoading(false);
        };

        const unsubAccounts = accountService.subscribe((data: any[]) => {
            setAccounts(data);
            accountsDone = true;
            finish();
        });

        const unsubProjects = projectService.subscribe((data: any[]) => {
            setProjects(data);
            projectsDone = true;
            finish();
        });

        return () => {
            unsubAccounts();
            unsubProjects();
        };
    }, []);

    const handleSelectAccount = (id: string) => {
        setSelectedAccountId(id);
        setActivePageId('E-08');
    };

    const isLeadStage = (stage?: string) => {
        if (!stage) return true;
        const s = stage.toLowerCase().trim();
        return s === 'lead' || s.includes('stage 1');
    };

    const validAccounts = accounts.filter(a => {
        const accountProjects = projects.filter(p => p.account_id === a.id || p.user_id === a.id);
        if (accountProjects.length === 0) return false;
        return accountProjects.some(p => !isLeadStage(p.current_stage));
    });

    const filtered = search
        ? validAccounts.filter(a =>
            (a.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (a.email || '').toLowerCase().includes(search.toLowerCase()) ||
            (a.type || '').toLowerCase().includes(search.toLowerCase())
        )
        : validAccounts;

    if (loading) {
        return (
            <PageContainer title="Accounts" description="Loading account records...">
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#ec028b] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="Accounts"
            description="All company and customer accounts associated with active projects."
        >
            {/* Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none sm:w-72">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search accounts..."
                            className="w-full pl-4 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/50 focus:ring-1 focus:ring-[#ec028b]/30 transition"
                        />
                    </div>
                    <span className="text-gray-500 text-sm font-mono whitespace-nowrap">
                        {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <Button className="flex items-center gap-2 shadow-[0_0_15px_rgba(236,2,139,0.2)]">
                    <PlusIcon className="w-4 h-4" />
                    New Account
                </Button>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
                    <UserIcon className="w-16 h-16 text-gray-700 mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-lg">No Accounts Found</p>
                    <p className="text-gray-500 text-sm mt-2 text-center max-w-sm">
                        {search ? `No accounts matching "${search}".` : 'Accounts are created automatically when a lead is converted.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map(account => {
                        const projectCount = projects.filter(p =>
                            p.account_id === account.id || p.user_id === account.id
                        ).length;

                        return (
                            <div
                                key={account.id}
                                onClick={() => handleSelectAccount(account.id)}
                                className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-[#ec028b]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,2,139,0.1)] overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ec028b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-black border border-gray-800 rounded-xl flex items-center justify-center group-hover:bg-[#ec028b]/10 group-hover:border-[#ec028b]/30 transition-colors">
                                        <UserIcon className="w-6 h-6 text-gray-400 group-hover:text-[#ec028b] transition-colors" />
                                    </div>
                                    <span className="text-[10px] bg-gray-900 border border-gray-800 px-2 py-0.5 rounded font-black uppercase tracking-widest text-gray-500">
                                        {account.type || 'Account'}
                                    </span>
                                </div>

                                <div className="space-y-1 mb-4">
                                    <h3 className="text-white font-bold text-lg line-clamp-1 group-hover:text-[#ec028b] transition-colors">
                                        {account.name || account.displayName || 'Unnamed Account'}
                                    </h3>
                                    {account.email && (
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <MailIcon className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{account.email}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BriefcaseIcon className="w-3.5 h-3.5 text-gray-600" />
                                        <span className="text-xs text-gray-400">
                                            {projectCount} Project{projectCount !== 1 ? 's' : ''}
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

export default AccountsListPage;
