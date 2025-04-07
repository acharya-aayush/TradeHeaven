
import React from 'react';
import SearchBar from './SearchBar';
import NotificationsDropdown from '../notifications/NotificationsDropdown';
import UserMenu from './UserMenu';

const TopNav = () => {
  return (
    <div className="border-b px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 w-full max-w-sm">
          <SearchBar />
        </div>
        
        <div className="flex items-center gap-2">
          <NotificationsDropdown />
          <UserMenu />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
