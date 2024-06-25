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
          : { color: "transparent", textShadow: "0 0 0 blue" }
      }
      onClick={() => setPinned(!pinned)}
    >
      <h3
        style={{
          transition: "transform 0.75s",

          transform: `${!pinned ? "rotate(45deg)" : "rotate(10deg)"}`,
        }}
      >
        &#128204;
      </h3>
    </button>
  );
};

export default React.memo(PinButton);
