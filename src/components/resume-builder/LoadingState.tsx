
interface LoadingStateProps {
  status: 'loading' | 'enhancing';
}

export function LoadingState({ status }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-lg">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
        <h2 className="text-2xl font-semibold mb-3">
          {status === 'loading' ? 'Preparing Your Resume' : 'Enhancing Your Resume'}
        </h2>
        <p className="text-gray-600 mb-4">
          {status === 'loading'
            ? 'Please wait while we load your resume...'
            : 'Our AI is analyzing your experience and crafting professional descriptions...'}
        </p>
        {status === 'enhancing' && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
}
