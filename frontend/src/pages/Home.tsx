import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export const Home = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 text-center py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Hero Section */}
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-foreground">
          Welcome {user?.name || user?.email}, to <br className="hidden sm:block" />
          <span className="text-primary">Sheet Reporting</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Transform raw spreadsheet data into beautiful, actionable reports in minutes. 
          Secure, fast, and designed for modern teams.
        </p>
        
        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8" onClick={logout}>
            Log out
          </Button>
        </div>
        
        {/* Features Grid */}
        <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Analytics</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Upload your sheets and instantly get insights with our automated analytics engine. No coding required.
            </p>
          </div>
          
          <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure by Default</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your data is encrypted at rest and in transit. We prioritize your privacy and enterprise-grade security.
            </p>
          </div>
          
          <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.632l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Sharing</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Collaborate with your team seamlessly by sharing interactive reports with just a single click.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
