import React, { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigation } from '../contexts/NavigationContext';
import { firestoreService } from '../lib/firebaseService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BriefcaseIcon, MapPinIcon, UserIcon, ArrowLeftIcon } from '../components/icons';

const PreConversionRecordPage: React.FC = () => {
    const { selectedPropertyId, selectedContactId, setActivePageId } = useNavigation();
    const [data, setData] = useState<any>(null);
    const [type, setType] = useState<'property' | 'contact' | null>(null);

    useEffect(() => {
        const fetchRecord = async () => {
            if (selectedPropertyId) {
                setType('property');
                const d = await getDoc(doc(db, 'properties', selectedPropertyId));
                if (d.exists()) setData({ id: d.id, ...d.data() });
            } else if (selectedContactId) {
                setType('contact');
                const d = await getDoc(doc(db, 'contacts', selectedContactId));
                if (d.exists()) setData({ id: d.id, ...d.data() });
            }
        };
        fetchRecord();
    }, [selectedPropertyId, selectedContactId]);

    if (!data) {
        return (
            <PageContainer title="Loading Record" description="Fetching pre-conversion data...">
                <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-t-rhive-pink border-rhive-pink/30 animate-spin" /></div>
            </PageContainer>
        );
    }

    const title = type === 'property' 
        ? data.address_full || data.property_address || 'Unnamed Property'
        : data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unnamed Contact';

    return (
        <PageContainer 
            title={title} 
            description={`Unconverted ${type === 'property' ? 'Property' : 'Contact'} Record`}
            headerAction={
                <Button variant="secondary" onClick={() => setActivePageId('E-15')}>
                    <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Search
                </Button>
            }
        >
            <div className="max-w-3xl mx-auto mt-10">
                <Card className="p-10 text-center bg-gray-900/40 border-dashed border-gray-700">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-800 border-2 border-rhive-pink/50 flex items-center justify-center text-rhive-pink mb-6">
                        {type === 'property' ? <MapPinIcon className="w-10 h-10" /> : <UserIcon className="w-10 h-10" />}
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Pre-Conversion Record</h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        This {type} was discovered via global search but is currently linked only to <strong className="text-white">Lead-stage</strong> projects. 
                        It will automatically graduate to a full Profile Page once its associated project is converted to Stage 2 (Estimate) or beyond.
                    </p>
                    
                    <div className="bg-black/50 border border-gray-800 rounded-xl p-6 text-left inline-block min-w-[300px]">
                        <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Record Details</h4>
                        <div className="space-y-3">
                            {type === 'property' ? (
                                <>
                                    <div><span className="text-gray-500 text-xs">Address:</span> <span className="text-white text-sm ml-2">{data.property_address || data.address_full}</span></div>
                                    <div><span className="text-gray-500 text-xs">City/State:</span> <span className="text-white text-sm ml-2">{data.city}, {data.state}</span></div>
                                </>
                            ) : (
                                <>
                                    <div><span className="text-gray-500 text-xs">Name:</span> <span className="text-white text-sm ml-2">{title}</span></div>
                                    <div><span className="text-gray-500 text-xs">Email:</span> <span className="text-white text-sm ml-2">{data.email || 'N/A'}</span></div>
                                    <div><span className="text-gray-500 text-xs">Phone:</span> <span className="text-white text-sm ml-2">{data.phone || 'N/A'}</span></div>
                                    <div><span className="text-gray-500 text-xs">Role:</span> <span className="text-white text-sm ml-2">{data.role || 'Lead Contact'}</span></div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800">
                        <Button 
                            onClick={() => setActivePageId('E-26')}
                            className="bg-rhive-pink/10 text-rhive-pink border border-rhive-pink/30 hover:bg-rhive-pink hover:text-white"
                        >
                            <BriefcaseIcon className="w-4 h-4 mr-2" />
                            View Leads Pipeline
                        </Button>
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
};

export default PreConversionRecordPage;
