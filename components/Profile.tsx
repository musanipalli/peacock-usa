import React, { useState } from 'react';
import { User, UserType } from '../types';

interface ProfileProps {
    user: User;
    userType: UserType;
    onUpdateProfile: (updatedUser: User) => void;
    onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, userType, onUpdateProfile, onBack }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedUser = { ...user, name, email, phoneNumber };
        onUpdateProfile(updatedUser);
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (currentPassword !== user.password) {
            setPasswordError('Current password is not correct.');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }

        onUpdateProfile({ ...user, password: newPassword });
        setPasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="text-peacock-sapphire hover:underline mb-6 font-medium">&larr; Back to Shopping</button>
                <h1 className="text-3xl font-bold font-serif mb-8 text-peacock-dark">My Profile</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Profile Details */}
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold font-serif mb-6">Account Information</h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 mt-1 border rounded-md" />
                            </div>
                             <div>
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mt-1 border rounded-md" />
                            </div>
                             <div>
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full p-2 mt-1 border rounded-md" />
                            </div>
                            <div className="text-right">
                                <button type="submit" className="bg-peacock-magenta text-white py-2 px-6 rounded-full font-bold transition-colors hover:bg-peacock-sapphire">Save Changes</button>
                            </div>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold font-serif mb-6">Change Password</h2>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                            {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}
                            <div>
                                <label className="text-sm font-medium text-gray-700">Current Password</label>
                                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full p-2 mt-1 border rounded-md" required/>
                            </div>
                             <div>
                                <label className="text-sm font-medium text-gray-700">New Password</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 mt-1 border rounded-md" required/>
                            </div>
                             <div>
                                <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-2 mt-1 border rounded-md" required/>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="bg-peacock-emerald text-white py-2 px-6 rounded-full font-bold transition-colors hover:bg-peacock-sapphire">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};