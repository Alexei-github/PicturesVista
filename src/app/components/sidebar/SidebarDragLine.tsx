import React from 'react';
import sidebarStyles from '@/components/sidebar/sidebar.module.css';

type Props = {
  setSidebarSize: (size: number) => void;
  resizeMargin: number;
  className?: string;
};
/**
 * SidebarDragLine component which allows user to adjust size of sidebar (click and drag)
 *
 * @param setSidebarSize - Function to set sidebar size
 * @returns SidebarDragLine component
 */
export default function SidebarDragLine({ setSidebarSize, resizeMargin, className }: Props) {
  const [dragging, setDragging] = React.useState(false);
  const [touchEvent, setTouchEvent] = React.useState(false);

  const recordSizeOfSideBar = React.useCallback(
    /**
     * Records size of sidebar.
     *
     * @param e - Maouse event
     */
    (e: MouseEvent | TouchEvent) => {
      // e.preventDefault(); !!!!!!!!!!!!!
      // https://stackoverflow.com/questions/37721782/what-are-passive-event-listeners
      let x;
      if (e instanceof TouchEvent) {
        x = e.touches[0].clientX;
      } else {
        x = e.pageX;
      }
      const size = Math.min(Math.max(x, resizeMargin), window.innerWidth - resizeMargin);
      setSidebarSize(size);
    },
    [setSidebarSize, resizeMargin],
  );

  const setDragingCurosorOnBody = React.useCallback(
    /** Sets "col-resize" cursor on `body` element. */
    () => {
      document.body.style.cursor = 'col-resize';
    },
    [],
  );

  const removeDragingCurosorOnBody = React.useCallback(
    /** Removes `cursor` style property on body element. */
    () => {
      document.body.style.removeProperty('cursor');
    },
    [],
  );

  const mouseUp = React.useCallback(
    /** Performs nesessary actions on `mouse up` event (i.e. once dragging has been completed). */
    () => {
      setDragging(false);
      setTouchEvent(false);
      removeDragingCurosorOnBody();
    },
    [removeDragingCurosorOnBody],
  );

  React.useEffect(
    /**
     * Adds appropriate event listeners on start of dragging.
     *
     * @returns Remves its event listeners.
     */
    () => {
      if (dragging) {
        if (touchEvent) {
          window.addEventListener('touchmove', recordSizeOfSideBar);
          window.addEventListener('touchend', mouseUp);
        } else {
          window.addEventListener('mousemove', recordSizeOfSideBar);
          window.addEventListener('mouseup', mouseUp);
        }
        return () => {
          window.removeEventListener('mousemove', recordSizeOfSideBar);
          window.removeEventListener('mouseup', mouseUp);
          window.removeEventListener('touchmove', recordSizeOfSideBar);
          window.removeEventListener('touchend', mouseUp);
        };
      }
    },
    [dragging, touchEvent, recordSizeOfSideBar, mouseUp],
  );

  return (
    <hr
      className={
        className
          ? className
          : `${sidebarStyles.vertical_line} ${dragging ? sidebarStyles.hover_drag_line_vertic : ''}`
      }
      onMouseDown={(e) => {
        e.preventDefault();
        setDragging(true);
        setDragingCurosorOnBody();
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        setTouchEvent(true);
        setDragging(true);
        setDragingCurosorOnBody();
      }}
    />
  );
}
