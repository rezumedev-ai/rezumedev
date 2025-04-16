
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { SonnerToaster } from "@/components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastProvider } from "./components/ToastProvider";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Router>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ToastProvider>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <AppRoutes />
                  <Toaster />
                  <SonnerToaster />
                </AuthProvider>
              </QueryClientProvider>
            </ToastProvider>
          </ThemeProvider>
        </Router>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
