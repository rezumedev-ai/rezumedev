
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastProvider } from "./components/ToastProvider";

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Router>
            <QueryClientProvider client={queryClient}>
              <ToastProvider>
                <AuthProvider>
                  <AppRoutes />
                  <Toaster />
                </AuthProvider>
              </ToastProvider>
            </QueryClientProvider>
          </Router>
        </ThemeProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
