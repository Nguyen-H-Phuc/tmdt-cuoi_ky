import React, { useState } from 'react';
import ProfileSidebar from '../components/ProfileSidebar';
import ProfileSettingsCard from '../components/ProfileSettingsCard';
import ProfileSecurityCard from '../components/ProfileSecurityCard';
import ChatInbox from '../components/ChatInbox';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sidebar - Left */}
                <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Main Content - Right */}
                {activeTab === 'profile' && <ProfileSettingsCard />}
                {activeTab === 'security' && <ProfileSecurityCard />}
                {activeTab === 'chat' && <ChatInbox />}
                
                {/* Placeholder for other tabs */}
                {activeTab !== 'profile' && activeTab !== 'security' && activeTab !== 'chat' && (
                    <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-12 flex flex-col items-center justify-center text-center gap-4">
                        <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                            <img src="https://api.dicebear.com/7.x/shapes/svg?seed=empty" alt="Empty" className="w-20 h-20" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#222222]">Tính năng đang phát triển</h3>
                            <p className="text-gray-500 mt-2">Phần này sẽ sớm được hoàn thiện để phục vụ bạn tốt hơn.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
