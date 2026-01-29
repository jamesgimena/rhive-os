
import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import CollapsibleSection from '../components/CollapsibleSection';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { DocumentTextIcon, ArrowPathIcon, ShareIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';

const ContactVendorProfilePage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-10');
    
    const contractor = {
        name: 'Quality & Roofing',
        type: 'Contractor',
        address: '456 Contractor Ave, Salt Lake City, UT 84101',
        phone: '801-555-7890',
        email: 'contact@qualityroofing.com',
        contacts: [
            { name: 'John Doe', title: 'Owner', phone: '801-555-7891', email: 'john.doe@qualityroofing.com' },
            { name: 'Jane Smith', title: 'Lead Foreman', phone: '801-555-7892', email: 'jane.s@qualityroofing.com' }
        ],
        documents: [
            { name: 'W-9 Form', status: 'on-file' as const },
            { name: 'License', status: 'on-file' as const },
            { name: 'Workers Comp', status: 'expired' as const },
            { name: 'Liability Insurance', status: 'on-file' as const }
        ],
        projects: [
            { name: 'Henderson Residence', address: '123 Maple St, Denver, CO', price: '$12,500', description: 'Full asphalt shingle replacement. Crew was efficient and clean.', galleries: ['Henderson 1', 'Henderson 2', 'Henderson 3'] },
            { name: 'Galleria Mall Roof', address: '789 Pine Ln, Aurora, CO', price: '$8,400', description: 'Partial repair on the west wing. Good work on matching existing materials.', galleries: ['Galleria 1', 'Galleria 2'] }
        ]
    };

    return (
        <PageContainer title={contractor.name} description={contractor.type}>
             <div className="absolute top-6 right-10">
                <Button>
                    <ShareIcon className="w-5 h-5 mr-2" />
                    Share Pricing Form
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-8">
                    <Card title="Contact Information">
                        <div className="space-y-3 text-gray-300">
                            <div>
                                <p className="text-sm text-gray-400">Payment Address</p>
                                <p>{contractor.address}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Phone</p>
                                <p>{contractor.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-[#ec028b] break-all">{contractor.email}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2">
                     <Card title="Key Contacts">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {contractor.contacts.map(contact => (
                                <div key={contact.name} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                    <p className="font-bold text-white">{contact.name}</p>
                                    <p className="text-sm text-gray-400">{contact.title}</p>
                                    <p className="text-sm text-gray-300 mt-2">{contact.phone}</p>
                                    <p className="text-sm text-[#ec028b] break-all">{contact.email}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="mt-8 space-y-8">
                <CollapsibleSection title="Required Documents">
                    <ul className="space-y-3">
                        {contractor.documents.map(doc => (
                            <li key={doc.name} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                <div className="flex items-center">
                                    <DocumentTextIcon className="w-6 h-6 mr-3 text-gray-400" />
                                    <span className="font-medium text-white">{doc.name}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <StatusBadge status={doc.status as any} />
                                    <Button variant="secondary" size="sm">
                                        <ArrowPathIcon className="w-4 h-4 mr-2" />
                                        Request Update
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CollapsibleSection>

                <CollapsibleSection title="Recent Projects">
                    <div className="space-y-6">
                        {contractor.projects.map(project => (
                             <Card key={project.name} className="bg-gray-900/40">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-lg text-white">{project.name}</h4>
                                        <p className="text-sm text-gray-400">{project.address}</p>
                                        <p className="mt-2 text-gray-300">{project.description}</p>
                                    </div>
                                    <p className="font-bold text-xl text-[#ec028b] whitespace-nowrap">{project.price}</p>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm font-semibold mb-2 text-gray-200">Project Gallery</p>
                                    <div className="flex flex-wrap gap-3">
                                        {project.galleries.map((galleryName, index) => (
                                            <Button key={galleryName} variant={index === 0 ? 'primary' : 'secondary'}>
                                                {galleryName}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Services & Pricing">
                    <p className="text-gray-400">This section will contain details about the services offered by this vendor and their pricing structure.</p>
                </CollapsibleSection>
            </div>
        </PageContainer>
    );
};

export default ContactVendorProfilePage;
