import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class OnboardingErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('Onboarding error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">
                            Oops! Something went wrong
                        </h2>

                        <p className="text-gray-600">
                            We encountered an unexpected error during onboarding. Don't worry, your progress has been saved.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={() => window.location.reload()}
                                className="w-full"
                            >
                                Refresh Page
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => window.location.href = '/dashboard'}
                                className="w-full"
                            >
                                Go to Dashboard
                            </Button>
                        </div>

                        <p className="text-sm text-gray-500">
                            If the problem persists, please contact support.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
