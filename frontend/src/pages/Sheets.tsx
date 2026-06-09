import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  FileUp, 
  Plus, 
  Trash2, 
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { sheetService } from '@/api/sheets';
import { reportService } from '@/api/reports';
import { useNavigate } from 'react-router-dom';

export const Sheets = () => {
  const { token } = useAuthStore();
  const [sheets, setSheets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSheets();
  }, []);

  const fetchSheets = async () => {
    try {
      if (!token) return;
      setIsLoading(true);
      const data = await sheetService.getAll(token);
      setSheets(data.sheets);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    try {
      setIsUploading(true);
      setError(null);
      await sheetService.upload(token, file);
      fetchSheets();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateReport = async (sheetId: string) => {
    try {
      if (!token) return;
      setIsGenerating(sheetId);
      setError(null);
      const data = await reportService.generate(token, sheetId);
      navigate(`/reports/${data.report.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Sheets</h1>
          <p className="text-muted-foreground">Upload and manage your data files.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button 
            className="gap-2" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Upload Sheet
          </Button>
        </div>
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
          <p>Loading your sheets...</p>
        </div>
      ) : sheets.length === 0 ? (
        <div 
          className="border-2 border-dashed rounded-xl py-24 flex flex-col items-center justify-center text-center px-4 bg-muted/5 cursor-pointer hover:bg-muted/10 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <FileUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No sheets uploaded yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Drag and drop your CSV or Excel files here, or click the button above to upload.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sheets.map((sheet) => (
            <Card key={sheet.id} className="hover:border-primary/50 transition-colors group">
              <CardContent className="p-0">
                <div className="flex items-center p-6 gap-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg truncate">{sheet.originalName}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{sheet.rowCount} rows</span>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span>{sheet.columnHeaders.length} columns</span>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span>{new Date(sheet.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => handleGenerateReport(sheet.id)}
                      disabled={isGenerating !== null}
                    >
                      {isGenerating === sheet.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <BarChart3 className="w-4 h-4" />
                      )}
                      Generate AI Report
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
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

// Import needed icon since I added BarChart3 here
import { BarChart3 } from 'lucide-react';
