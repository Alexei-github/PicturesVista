import React from 'react';

type Props = {
  setMove: (deltaX: number, deltaY: number) => void;
  updateParent: (update: boolean) => void;
  classNameAtRest?: string;
  classNameInAction?: string;
  children?: React.ReactNode;
};
/**
 * DragDiv component which allows user to adjust size of elements (click and drag)
 *
 * @returns DragDiv component
 */
export default function DragDiv({
  setMove,
  updateParent,
  children,
  classNameInAction,
  classNameAtRest,
}: Props) {
  const [dragging, setDragging] = React.useState(false);

  const dragAction = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
      setDragging(true);
      updateParent(true);

      let startX = 0;
      let startY = 0;
      if (e.type === 'touchstart') {
        startX = (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX;
        startY = (e as React.TouchEvent<HTMLDivElement>).touches[0].clientY;
      } else if (e.type === 'mousedown') {
        // startX = e.pageX;
        startX = (e as React.MouseEvent<HTMLDivElement, MouseEvent>).clientX;
        // startY = e.pageY;
        startY = (e as React.MouseEvent<HTMLDivElement, MouseEvent>).clientY;
      }

      const actOnDrag =
        /**
         * Records change in position.
         *
         * @param e - Maouse or touch event
         */
        (e: MouseEvent | TouchEvent) => {
          let x = 0;
          let y = 0;
          if (e instanceof TouchEvent) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
          } else if (e instanceof MouseEvent) {
            x = e.pageX;
            y = e.pageY;
          }

          setMove(x - startX, y - startY);
        };

      const mouseUp = () => {
        updateParent(false);
        document.removeEventListener('mousemove', actOnDrag);
        document.removeEventListener('mouseup', mouseUp);
        document.removeEventListener('touchmove', actOnDrag);
        document.removeEventListener('touchend', mouseUp);
        setDragging(false);
      };

      if (e instanceof TouchEvent) {
        document.addEventListener('touchmove', actOnDrag);
        document.addEventListener('touchend', mouseUp);
      } else {
        document.addEventListener('mousemove', actOnDrag);
        document.addEventListener('mouseup', mouseUp);
      }
    },
    [setMove, updateParent],
  );

  return (
    <div
      className={`${classNameAtRest} ${dragging && classNameInAction}`}
      onMouseDown={dragAction}
      onTouchStart={dragAction}
    >
      {children}
    </div>
  );
}
