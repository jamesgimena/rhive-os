import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { UserIcon, BuildingStorefrontIcon, TruckIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';

const ContactsVendorsPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-09');

    const [contacts, setContacts] = React.useState<any[]>([]);
    
    React.useEffect(() => {
        // Here we could fetch from contactService, but since this is just a placeholder page right now
        // we'll leave it empty to conform to "Remove dummy contents".
    }, []);
    
    return (
        <PageContainer title={page?.name || 'Contacts & Vendors'} description={page?.description || 'A directory of all contacts.'}>
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4">
                    <input
                        type="search"
                        placeholder="Search contacts..."
                        className="w-full md:w-1/3 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ec028b]/70"
                    />
                    <div className="flex space-x-2">
                        <Button variant="secondary">All</Button>
                        <Button variant="secondary">Customers</Button>
                        <Button variant="secondary">Contractors</Button>
                        <Button variant="secondary">Suppliers</Button>
                    </div>
                    <Button>Add New Contact</Button>
                </div>
            </Card>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.map(contact => (
                     <Card key={contact.name} className="p-0">
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-gray-900/50 rounded-full flex items-center justify-center mb-4 border-2 border-[#ec028b]/30">
                                {contact.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white">{contact.name}</h3>
                            <p className="text-sm text-gray-400">{contact.type}</p>
                            <p className="text-sm text-[#ec028b] mt-2 break-all">{contact.email}</p>
                        </div>
                         <div className="border-t border-gray-700 p-3">
                             <Button variant="secondary" className="w-full">View Profile</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </PageContainer>
    );
};

export default ContactsVendorsPage;