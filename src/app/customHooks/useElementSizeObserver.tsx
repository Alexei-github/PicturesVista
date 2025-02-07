import React from 'react';

function useElementSizeObserver<T extends HTMLElement>(
  setSizeInStore: ({ width, height }: { width: number; height: number }) => void
) {
  const elementRef = React.useRef<T | null>(null);

  React.useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const handleResize = () => {
      setSizeInStore({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    // Create a ResizeObserver instance to track size changes
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    // Start observing the referenced element
    resizeObserver.observe(element);

    // Handle the initial size on mount
    handleResize();

    // Cleanup observer on unmount
    return () => {
      resizeObserver.unobserve(element);
    };
  }, [setSizeInStore]);

  // Return both the ref and the size object
  return [elementRef];
}

export default useElementSizeObserver;
