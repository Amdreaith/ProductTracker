
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: string;
  unit: string;
  description: string;
  icon: React.ReactNode;
  badgeText?: string;
  badgeVariant?: 'success' | 'warning' | 'error';
}

export const InventoryStats = ({ 
  title, 
  value, 
  unit, 
  description, 
  icon, 
  badgeText,
  badgeVariant = 'success' 
}: Props) => {
  return (
    <Card className="overflow-hidden border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon}
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-muted-foreground">{unit}</span>
          {badgeText && (
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full ml-2",
              badgeVariant === 'success' && "bg-emerald-100 text-emerald-800",
              badgeVariant === 'warning' && "bg-amber-100 text-amber-800",
              badgeVariant === 'error' && "bg-red-100 text-red-800",
            )}>
              {badgeText}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </div>
    </Card>
  );
};
