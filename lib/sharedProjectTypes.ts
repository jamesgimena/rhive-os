// Shared interfaces for Project Data implementation
// Used by both frontend (API client) and backend (Service)

export interface ContactInput {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    role: string; // 'Property Owner', etc.
    isPrimary: boolean;
    preferredContactMethod?: string;
    responsibilities?: string[];
    affiliations?: string[];
}

export interface AddressInput {
    address: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
}

export interface ProjectInput {
    userId: string | number; // ID of the sales rep/user creating the lead
    name: string;
    type: 'Residential' | 'Commercial' | 'Government';
    property: AddressInput;
    insurance?: {
        isClaim: boolean;
        carrier?: string;
        status?: string;
        claimNumber?: string;
        deductible?: string;
        dateOfLoss?: string;
        damageType?: string[];
    };
    organization?: {
        parentCompany?: string;
        propertyName?: string;
    };
    billing?: {
        name: string;
        address: AddressInput;
    };
    details?: {
        purchaseIntent?: string; // 'Ready', 'Exploring'
        scopeType?: string; // 'Repair', 'Replacement'
        activeLeak?: boolean;
        isOld?: boolean;
        hasPhotos?: boolean;
        scheduledInspection?: string;
    };
    contacts: ContactInput[];
}
