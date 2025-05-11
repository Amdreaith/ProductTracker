
import { UserProfile } from "@/types/authTypes";

interface UserDetailProps {
  user: UserProfile;
}

export function UserDetail({ user }: UserDetailProps) {
  return (
    <div className="bg-muted p-4 rounded-md mb-4">
      <h4 className="font-medium">Selected User:</h4>
      <p>
        {user.full_name || "No name"} ({user.email || "No email"})
      </p>
    </div>
  );
}
