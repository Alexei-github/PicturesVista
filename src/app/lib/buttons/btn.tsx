import btnStyle from '@/lib/buttons/btns.module.css';
import React from 'react';

const Btn = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={btnStyle.btn_main + ' ' + className} {...props}>
      {children}
    </button>
  );
};

export default React.memo(Btn);
