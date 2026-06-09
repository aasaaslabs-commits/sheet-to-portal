import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BarChart3, 
  ChevronLeft, 
  Share2, 
  Download, 
  Loader2, 
  AlertCircle,
  Calendar,
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { reportService } from '@/api/reports';
import { sheetService } from '@/api/sheets';
import { DashboardWidget } from '@/components/DashboardWidget';

export const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuthStore();
  const [report, setReport] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && token) {
      fetchReportAndData(id, token);
    }
  }, [id, token]);

  const fetchReportAndData = async (reportId: string, authToken: string) => {
    try {
      setIsLoading(true);
      const reportData = await reportService.getById(authToken, reportId);
      setReport(reportData);
      
      const sheetData = await sheetService.getData(authToken, reportData.sheetId);
      setData(sheetData.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareLink = () => {
    if (!report) return;
    const url = `${window.location.origin}/shared/${report.shareToken}`;
    navigator.clipboard.writeText(url);
    alert('Public share link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Loading your report and processing data...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Failed to load report</h2>
        <p className="text-muted-foreground max-w-md mb-8">{error || 'The report you are looking for does not exist.'}</p>
        <Button asChild>
          <Link to="/reports">Back to Reports</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link 
            to="/reports" 
            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Reports
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{report.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{report.sheet.originalName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Generated on {new Date(report.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={copyShareLink}>
            <Share2 className="w-4 h-4" />
            Share Link
          </Button>
          <Button className="gap-2" onClick={() => window.print()}>
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {report.widgets.map((widget: any) => (
          <DashboardWidget key={widget.id} widget={widget} data={data} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Summary</CardTitle>
          <CardDescription>A quick look at the underlying spreadsheet data used for this report.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  {Object.keys(data[0] || {}).map((header) => (
                    <th key={header} className="px-4 py-3 font-medium">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.slice(0, 10).map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    {Object.values(row).map((val: any, j) => (
                      <td key={j} className="px-4 py-3 truncate max-w-[200px]">
                        {val?.toString() || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 10 && (
              <p className="text-xs text-center text-muted-foreground mt-4 italic">
                Showing first 10 rows of {data.length} total records.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
