import { Component, type ReactNode } from "react";

// The 3D globe needs WebGL. Some browsers have it turned off
// (e.g. graphics acceleration disabled), so check first and catch errors.

let webglSupport: boolean | null = null;

export const hasWebGL = () => {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    webglSupport = Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    webglSupport = false;
  }
  return webglSupport;
};

type Props = { children: ReactNode; fallback: ReactNode };
type State = { failed: boolean };

class GlobeErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// Shows the globe, or the fallback if WebGL isn't available or the globe crashes
const GlobeGuard = ({ children, fallback }: Props) =>
  hasWebGL() ? (
    <GlobeErrorBoundary fallback={fallback}>{children}</GlobeErrorBoundary>
  ) : (
    <>{fallback}</>
  );

export default GlobeGuard;

// Default message shown instead of the globe
export const GlobeUnavailable = ({
  compact = false,
}: {
  compact?: boolean;
}) => (
  <div
    className={`grid place-items-center px-6 text-center text-sm text-white/85 ${
      compact ? "py-8" : "min-h-[320px] py-12"
    }`}
  >
    <div>
      <p className="font-medium text-white">
        The 3D globe can't load in this browser.
      </p>
      <p className="mt-1">
        {compact
          ? "Search for the place or use your current location instead."
          : "Turn on graphics acceleration in your browser settings, or try another browser. Your sightings are safe."}
      </p>
    </div>
  </div>
);
 