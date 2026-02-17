import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-cyan-400 p-8 rounded-lg shadow-2xl">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-cyan-400 mb-4 font-mono">
                                ⚠️ SYSTEM ERROR
                            </h1>
                            <div className="bg-black/50 p-4 rounded border border-red-500 mb-6">
                                <p className="text-red-400 font-mono text-sm mb-2">
                                    {this.state.error?.message || 'An unexpected error occurred'}
                                </p>
                            </div>

                            <div className="text-left bg-black/30 p-4 rounded border border-yellow-500 mb-6">
                                <p className="text-yellow-400 font-mono text-sm mb-2">
                                    🔧 Common Issues:
                                </p>
                                <ul className="text-gray-300 font-mono text-xs space-y-1 list-disc list-inside">
                                    <li>Missing environment variable: VITE_SPOTIFY_CLIENT_ID</li>
                                    <li>Invalid Spotify Client ID</li>
                                    <li>Network connectivity issues</li>
                                </ul>
                            </div>

                            <button
                                onClick={() => window.location.reload()}
                                className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded font-mono transition-all transform hover:scale-105"
                            >
                                🔄 RELOAD SYSTEM
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
