import { 
  FileSpreadsheet, 
  BarChart3, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export const Dashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Total Sheets', value: '12', icon: FileSpreadsheet, trend: '+2 this month' },
    { label: 'Reports Generated', value: '48', icon: BarChart3, trend: '+12% from last week' },
    { label: 'Collaborators', value: '5', icon: Users, trend: 'Active now' },
    { label: 'Data Accuracy', value: '99.2%', icon: TrendingUp, trend: '+0.4% increase' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your reports today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" asChild>
            <Link to="/reports">
              <BarChart3 className="w-4 h-4" />
              View Reports
            </Link>
          </Button>
          <Button className="gap-2" asChild>
            <Link to="/sheets">
              <Plus className="w-4 h-4" />
              Upload Sheet
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-primary" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest sheet updates and report generations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border">
                    <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sales_Report_Q2_2026.csv</p>
                    <p className="text-xs text-muted-foreground">Updated 2 hours ago by You</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
            <CardDescription>Storage and processing limits for your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span className="text-muted-foreground">65% used</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[65%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Requests</span>
                <span className="text-muted-foreground">1,240 / 5,000</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[25%]" />
              </div>
            </div>
            <Button variant="outline" className="w-full">Upgrade Plan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
