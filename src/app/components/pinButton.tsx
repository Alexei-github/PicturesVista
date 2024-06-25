import React from "react";
import compStyles from "@/components/components.module.css";

type Props = { pinned: boolean; setPinned: (pinned: boolean) => void };

const PinButton = ({ pinned, setPinned }: Props) => {
  return (
    <button
      className={compStyles.pin}
      style={
        !pinned
          ? {
              color: "transparent",
              textShadow: "0 0 0 rgb(99, 99, 99)",
            }
          : {}
      }
      onClick={() => setPinned(!pinned)}
    >
      &#128204;
    </button>
  );
};

export default React.memo(PinButton);
