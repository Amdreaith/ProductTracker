
import { Settings } from "lucide-react";

export function EmptyPermissionsState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center border rounded-md bg-muted/30">
      <Settings className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium">Select a User</p>
      <p className="text-sm text-muted-foreground">
        Choose a user to manage their action permissions
      </p>
    </div>
  );
}
