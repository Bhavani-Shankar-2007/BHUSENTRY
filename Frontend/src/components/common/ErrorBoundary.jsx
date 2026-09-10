import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-lg bg-white border border-red-200 rounded-2xl p-6 shadow-lg">
            <h1 className="text-lg font-bold text-red-800 mb-2">Something went wrong</h1>
            <p className="text-sm text-slate-600 mb-4">
              {this.state.error?.message || 'Unknown runtime error'}
            </p>
            <pre className="text-xs bg-slate-100 p-3 rounded-lg overflow-auto max-h-40 text-slate-700">
              {String(this.state.error?.stack || '')}
            </pre>
            <button
              type="button"
              className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
