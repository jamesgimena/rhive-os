/**
 * Firebase Usage Examples
 * This file demonstrates how to use Firebase services in React components
 */

import React, { useState, useEffect } from 'react';
import { authService, customerService, storageService } from '../lib/firebaseService';
import type { Customer } from '../lib/firebaseService';

// ============================================
// AUTHENTICATION EXAMPLE
// ============================================

export function AuthExample() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Listen to auth state changes
        const unsubscribe = authService.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleSignUp = async () => {
        try {
            await authService.signUp(email, password);
            setError('');
            alert('Account created successfully!');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSignIn = async () => {
        try {
            await authService.signIn(email, password);
            setError('');
            alert('Signed in successfully!');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSignOut = async () => {
        try {
            await authService.signOut();
            setError('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Firebase Authentication</h2>

            {user ? (
                <div>
                    <p className="mb-4">Welcome, {user.email}!</p>
                    <button
                        onClick={handleSignOut}
                        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 p-2 border rounded"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSignIn}
                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={handleSignUp}
                            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            )}

            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
}

// ============================================
// FIRESTORE CRUD EXAMPLE
// ============================================

export function CustomerCRUDExample() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Customer>>({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active'
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    // Load customers on mount
    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        const result = await customerService.getAllCustomers();
        if (result.success) {
            setCustomers(result.data as Customer[]);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            // Update existing customer
            const result = await customerService.updateCustomer(editingId, formData);
            if (result.success) {
                alert('Customer updated!');
                setEditingId(null);
            }
        } else {
            // Add new customer
            const result = await customerService.addCustomer(formData as Omit<Customer, 'id'>);
            if (result.success) {
                alert('Customer added!');
            }
        }

        // Reset form and reload
        setFormData({ name: '', email: '', phone: '', address: '', status: 'active' });
        loadCustomers();
    };

    const handleEdit = (customer: Customer) => {
        setFormData(customer);
        setEditingId(customer.id || null);
    };

    const handleDelete = async (customerId: string) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            const result = await customerService.deleteCustomer(customerId);
            if (result.success) {
                alert('Customer deleted!');
                loadCustomers();
            }
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Customer Management (Firestore)</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="p-2 border rounded"
                    />
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="p-2 border rounded"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="p-2 border rounded col-span-2"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
                >
                    {editingId ? 'Update Customer' : 'Add Customer'}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ name: '', email: '', phone: '', address: '', status: 'active' });
                        }}
                        className="mt-4 ml-2 bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}
            </form>

            {/* Customer List */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id} className="border-t">
                                    <td className="p-3">{customer.name}</td>
                                    <td className="p-3">{customer.email}</td>
                                    <td className="p-3">{customer.phone}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-sm ${customer.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : customer.status === 'inactive'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleEdit(customer)}
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer.id!)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ============================================
// FILE UPLOAD EXAMPLE
// ============================================

export function FileUploadExample() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadedURL, setUploadedURL] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first');
            return;
        }

        setUploading(true);
        const path = `uploads/${Date.now()}_${file.name}`;
        const result = await storageService.uploadFile(file, path);

        if (result.success) {
            setUploadedURL(result.url || '');
            alert('File uploaded successfully!');
        } else {
            alert('Error uploading file');
        }

        setUploading(false);
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Firebase Storage Upload</h2>

            <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 w-full"
            />

            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
                {uploading ? 'Uploading...' : 'Upload File'}
            </button>

            {uploadedURL && (
                <div className="mt-4">
                    <p className="font-semibold mb-2">Uploaded File:</p>
                    <a
                        href={uploadedURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline break-all"
                    >
                        {uploadedURL}
                    </a>
                </div>
            )}
        </div>
    );
}

// ============================================
// COMBINED DEMO COMPONENT
// ============================================

export function FirebaseDemo() {
    const [activeTab, setActiveTab] = useState<'auth' | 'crud' | 'storage'>('auth');

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">Firebase Integration Demo</h1>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('auth')}
                        className={`px-6 py-2 rounded ${activeTab === 'auth'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Authentication
                    </button>
                    <button
                        onClick={() => setActiveTab('crud')}
                        className={`px-6 py-2 rounded ${activeTab === 'crud'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Firestore CRUD
                    </button>
                    <button
                        onClick={() => setActiveTab('storage')}
                        className={`px-6 py-2 rounded ${activeTab === 'storage'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Storage Upload
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'auth' && <AuthExample />}
                {activeTab === 'crud' && <CustomerCRUDExample />}
                {activeTab === 'storage' && <FileUploadExample />}
            </div>
        </div>
    );
}

export default FirebaseDemo;
