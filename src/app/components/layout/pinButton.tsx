import React from "react";
import compStyles from "@/components/components.module.css";

type Props = { pinned: boolean; setPinned: (pinned: boolean) => void };

/**
 * PinButton component which pins sidebar in its position and makes it stay open
 * when mouse leaves it. If `pinned' values is `false` then `onMouseLeave` sidebar
 * will close.
 * @param pinned - boolean value indicating whetehr sidebar is pinned.
 * @param setPinned - function to toggle `pinned` value.
 * @returns PinButton component
 */
const PinButton = ({ pinned, setPinned }: Props) => {
  // console.log(document.getElementById("pushpin")?.innerHTML);
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
      onClick={(e) => {
        console.log("click");
        e.preventDefault;
        setPinned(!pinned);
      }}
      onTouchMove={(e) => {
        e.preventDefault;
      }}
      onTouchStart={(e) => {
        e.preventDefault;
        setPinned(!pinned);
      }}
    >
      <div
        data-testid="pushpin"
        style={{
          transition: "transform 0.25s",
          fontSize: "1rem",
          transform: `${!pinned ? "rotate(45deg)" : "rotate(10deg)"}`,
        }}
      >
        &#128204;
      </div>
    </button>
  );
};

export default PinButton;
// export default React.memo(PinButton);
