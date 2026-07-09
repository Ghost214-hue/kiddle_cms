import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("React error boundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-[#3d2010] mb-2">
                Something went wrong
              </h2>
              <p className="text-[#7a5c3a] mb-4">
                Please refresh the page or try again later.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 bg-[#a0693a] text-white rounded-lg"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
