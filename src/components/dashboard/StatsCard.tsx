import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
}

export default function StatsCard({ title, value, icon, description }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="text-xs text-neutral-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

