import React from "react";
import btnStyle from "@/lib/buttons/btns.module.css";

const Btn = ({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={btnStyle.btn_main + " " + className} {...props}>
      {children}
    </button>
  );
};

export default React.memo(Btn);
