import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WidgetProps {
  widget: {
    type: string;
    title: string;
    config: {
      dataKey: string;
      categoryKey?: string;
      color?: string;
    };
  };
  data: any[];
}

export const DashboardWidget = ({ widget, data }: WidgetProps) => {
  const { type, title, config } = widget;
  const { dataKey, categoryKey, color = '#3b82f6' } = config;

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={categoryKey} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={categoryKey} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        // Simple aggregation for pie chart if categoryKey is present
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={categoryKey}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill={color}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'metric':
        // For metric, we just sum or average the dataKey
        const total = data.reduce((acc, curr) => acc + (Number(curr[dataKey]) || 0), 0);
        const avg = data.length > 0 ? (total / data.length).toFixed(2) : 0;
        return (
          <div className="h-[300px] flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-primary">{total.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-2">Total {dataKey}</div>
            <div className="mt-4 pt-4 border-t w-full text-center">
              <div className="text-xl font-semibold">{avg}</div>
              <div className="text-xs text-muted-foreground">Average per record</div>
            </div>
          </div>
        );
      default:
        return <div className="h-[300px] flex items-center justify-center">Unsupported chart type: {type}</div>;
    }
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};
