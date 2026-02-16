import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center bg-background-dark/50 rounded-3xl border border-white/5">
                    <div className="size-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-red-500">error_outline</span>
                    </div>
                    <h3 className="text-white font-black text-xl mb-2">Something went wrong</h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-md">
                        {this.state.error?.message || 'An unexpected error occurred while rendering this component.'}
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            this.props.onReset?.();
                        }}
                        className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors border border-white/10"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
