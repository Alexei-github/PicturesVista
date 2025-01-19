import { useState, useCallback } from 'react';
import modalStyles from '@/components/modal/modal.module.css';
import DragDiv from '@/lib/DragDiv';

type Props = {
  //   isOpen: boolean;
  onClose?: () => void;
  sizeScale: number;
  children?: React.ReactNode;
};

const Modal = ({ onClose, sizeScale, children }: Props): React.ReactNode => {
  const [position, setPosition] = useState({
    x: (window.innerWidth * (1 - sizeScale)) / 2,
    y: (window.innerHeight * (1 - sizeScale)) / 2,
  });
  const [size, setSize] = useState({
    width: window.innerWidth * sizeScale,
    height: window.innerHeight * sizeScale,
  });
  const [drag, setDrag] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  //   if (!isOpen) return null;

  const setResize = useCallback(
    (deltaX: number, deltaY: number) => {
      const newSize = {
        width: Math.max(200, size.width + deltaX),
        height: Math.max(150, size.height + deltaY),
      };
      setSize(newSize);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [drag],
  );

  const setMove = useCallback(
    (deltaX: number, deltaY: number) => {
      const newPosition = {
        x: position.x + deltaX,
        y: position.y + deltaY,
      };
      setPosition(newPosition);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [drag],
  );

  const close = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setIsOpen(false);
  }, [onClose]);

  return (
    <dialog
      open={isOpen}
      className={modalStyles.modal}
      style={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
      }}
    >
      <button className={modalStyles.button} onClick={close}>
        &times;
      </button>

      <DragDiv
        setMove={setMove}
        classNameAtRest={modalStyles.pan_handle}
        classNameInAction={modalStyles.pan_handle_active}
        updateParent={setDrag}
      >
        <p className={modalStyles.pan_handle_arrow}>&#x2194;</p>
        <p className={modalStyles.pan_handle_arrow}>&#x2195;</p>
      </DragDiv>
      <DragDiv
        setMove={setResize}
        classNameAtRest={modalStyles.resize_handle}
        classNameInAction={modalStyles.resize_handle_active}
        updateParent={setDrag}
      />
      <div className={modalStyles.modal_body}>{children}</div>
    </dialog>
  );
};

export default Modal;
