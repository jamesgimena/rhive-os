
import React from 'react';
import PageContainer from '../components/PageContainer';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
    UserIcon, 
    BriefcaseIcon, 
    ShieldCheckIcon, 
    DocumentTextIcon, 
    MapPinIcon, 
    PencilSquareIcon,
    TruckIcon
} from '../components/icons';
import { useMockDB } from '../contexts/MockDatabaseContext';

const SupplierProfilePage: React.FC = () => {
    const { currentUser } = useMockDB();

    const companyData = {
        name: currentUser?.name || 'ABC Supply Co.',
        ein: '12-3456789',
        hq: '789 Industrial Way, Salt Lake City, UT 84104',
        paymentTerms: 'Net 30',
        contacts: [
            { name: 'David Smith', role: 'Account Manager', email: 'd.smith@abc.com', phone: '(801) 555-0900' },
            { name: 'Sarah Miller', role: 'Accounts Receivable', email: 'billing@abc.com', phone: '(801) 555-0901' }
        ],
        documents: [
            { name: 'Master Purchase Agreement', status: 'verified', date: '2023-11-15' },
            { name: 'W-9 Form', status: 'verified', date: '2024-01-10' },
            { name: 'Insurance Certificate', status: 'expiring', date: '2024-08-01' }
        ]
    };

    return (
        <PageContainer 
            title="Supplier Company Profile" 
            description="Manage your business identity, legal documentation, and primary contacts."
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Business Basics */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800 text-rhive-pink">
                                <TruckIcon className="w-8 h-8" />
                            </div>
                            <Button variant="secondary" size="sm" className="!p-2">
                                <PencilSquareIcon className="w-4 h-4" />
                            </Button>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">{companyData.name}</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">Verified Partner • Platinum Tier</p>
                        
                        <div className="space-y-4 pt-6 border-t border-gray-800">
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Corporate HQ</p>
                                <div className="flex items-start gap-2">
                                    <MapPinIcon className="w-4 h-4 text-rhive-pink mt-0.5" />
                                    <p className="text-sm text-gray-300">{companyData.hq}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Tax ID / EIN</p>
                                <div className="flex items-center gap-2 font-mono text-xs text-white">
                                    <BriefcaseIcon className="w-4 h-4 text-gray-600" />
                                    {companyData.ein}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Legal & Compliance">
                        <div className="space-y-3">
                            {companyData.documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl group hover:border-rhive-pink/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="text-xs font-bold text-white">{doc.name}</p>
                                            <p className="text-[9px] text-gray-600">Updated: {doc.date}</p>
                                        </div>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${doc.status === 'verified' ? 'bg-green-500 shadow-green-500/50' : 'bg-yellow-500 shadow-yellow-500/50'}`} />
                                </div>
                            ))}
                        </div>
                        <Button variant="secondary" className="w-full mt-4 text-[10px]">Upload New Credentials</Button>
                    </Card>
                </div>

                {/* Right Column: Personnel & Logistics */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Primary Contacts">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {companyData.contacts.map((contact, idx) => (
                                <div key={idx} className="p-5 bg-gray-900/60 border border-gray-800 rounded-2xl relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-rhive-pink/5 blur-2xl group-hover:bg-rhive-pink/10 transition-all" />
                                    <h4 className="text-white font-bold mb-1">{contact.name}</h4>
                                    <p className="text-rhive-pink text-[10px] font-bold uppercase tracking-widest mb-4">{contact.role}</p>
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-400 font-mono">{contact.email}</p>
                                        <p className="text-xs text-gray-400 font-mono">{contact.phone}</p>
                                    </div>
                                </div>
                            ))}
                            <button className="border-2 border-dashed border-gray-800 rounded-2xl p-5 flex flex-col items-center justify-center text-gray-600 hover:border-rhive-pink/50 hover:text-rhive-pink transition-all">
                                <span className="text-2xl mb-1">+</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Add New Lead Contact</span>
                            </button>
                        </div>
                    </Card>

                    <Card title="Logistics & Payment Defaults">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <h5 className="text-white text-sm font-bold uppercase tracking-tight mb-2">Payment Terms</h5>
                                    <p className="text-gray-400 text-xs italic leading-relaxed">Standard net cycle for RHIVE automated invoicing: <span className="text-rhive-pink font-bold">Net 30</span></p>
                                </div>
                                <div>
                                    <h5 className="text-white text-sm font-bold uppercase tracking-tight mb-2">Automated P.O. Format</h5>
                                    <p className="text-gray-400 text-xs font-mono">rhive-supply-[DATE]-[PO_NUM].xml</p>
                                </div>
                            </div>
                            <div className="p-4 bg-rhive-pink/5 border border-rhive-pink/20 rounded-2xl flex items-center gap-4">
                                <ShieldCheckIcon className="w-10 h-10 text-rhive-pink shrink-0" />
                                <div>
                                    <p className="text-white text-xs font-bold uppercase mb-1">QOS Integration Active</p>
                                    <p className="text-gray-500 text-[9px] leading-relaxed">Your company data is automatically synced with RHIVE's Estimator Pricing Backend (A-03).</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </PageContainer>
    );
};

export default SupplierProfilePage;
