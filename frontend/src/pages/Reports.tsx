import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Plus, 
  Trash2, 
  ChevronRight,
  Loader2,
  AlertCircle,
  Share2,
  Calendar,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { reportService } from '@/api/reports';
import { useNavigate, Link } from 'react-router-dom';

export const Reports = () => {
  const { token } = useAuthStore();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      if (!token) return;
      setIsLoading(true);
      const data = await reportService.getAll(token);
      setReports(data.reports);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Generated Reports</h1>
          <p className="text-muted-foreground">View and manage your automated dashboards.</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/sheets')}>
          <Plus className="w-4 h-4" />
          Create New Report
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p>Loading your reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="border-2 border-dashed rounded-xl py-24 flex flex-col items-center justify-center text-center px-4 bg-muted/5">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No reports generated yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Go to the Sheets page, upload a file, and click "Generate AI Report" to create your first dashboard.
          </p>
          <Button onClick={() => navigate('/sheets')}>Go to Sheets</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:border-primary/50 transition-all group hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground -mr-2 -mt-2">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="mt-4 truncate">{report.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                  {report.description || `Based on data from ${report.sheet.originalName}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    <span className="truncate">{report.sheet.originalName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <Button className="flex-1 gap-2" asChild>
                      <Link to={`/reports/${report.id}`}>
                        View Dashboard
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" title="Copy share link" onClick={() => {
                      const url = `${window.location.origin}/shared/${report.shareToken}`;
                      navigator.clipboard.writeText(url);
                      alert('Share link copied to clipboard!');
                    }}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
