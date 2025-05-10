
import { useState } from "react";
import { UserProfile } from "@/context/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface UserSelectorProps {
  users: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
}

export function UserSelector({ users, onSelectUser }: UserSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <span>Select User</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
        <DropdownMenuLabel>Users</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {users
          .filter(u => u.role !== "admin" && u.role !== "blocked")
          .map(user => (
            <DropdownMenuItem 
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="cursor-pointer"
            >
              {user.full_name || user.email || "Unknown"}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
