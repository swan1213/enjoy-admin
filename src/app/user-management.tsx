'use client'
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import UserTable from './user-table';
import SearchBar from './searchbar';
import UserDetailsModal from './userdetails';


interface UserManagementProps {
  users: User[];
  loading: boolean;
  onRefresh: () => void;
  onSuspendUser: (id: string) => void;
  onDeleteUser: (id: string) => void;
}

export default function UserManagement({ 
  users, 
  loading, 
  onRefresh, 
  onSuspendUser, 
  onDeleteUser 
}: UserManagementProps) {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    if (!userSearch.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.phone.includes(userSearch)
      );
      setFilteredUsers(filtered);
    }
  }, [users, userSearch]);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <Button onClick={onRefresh} disabled={loading} className="flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : null}
          Refresh Users
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <SearchBar
            placeholder="Search users by name, email, or phone..."
            value={userSearch}
            onChange={setUserSearch}
            resultCount={filteredUsers.length}
            totalCount={users.length}
          />
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
            </div>
          ) : (
            <UserTable users={filteredUsers} onViewDetails={handleViewDetails} />
          )}
        </CardContent>
      </Card>

      <UserDetailsModal
        user={selectedUser}
        open={showUserDetails}
        onClose={() => setShowUserDetails(false)}
        onSuspendUser={onSuspendUser}
        onDeleteUser={onDeleteUser}
      />
    </div>
  );
}