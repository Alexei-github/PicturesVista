import React from "react";

import { useVision } from "@/stores/computerVisionStore";

function ComputerVision() {
  const {
    mobileNetModel,
    cocoSsd,
    computerVisionOn,
    loadMobileNet,
    loadCocoSsd,
    setComputerVisionOn,
  } = useVision();

  React.useEffect(() => {
    (async () => {
      if (computerVisionOn) {
        // check for internet connection
        if (navigator.onLine && (!mobileNetModel || !cocoSsd)) {
          if (!mobileNetModel) {
            const loadMobileNetFn = (
              await import("@/components/computerVision/loadCVModels")
            ).loadMobileNetFn;
            loadMobileNet(
              await loadMobileNetFn(computerVisionOn && !mobileNetModel)
            );
          }
          if (!cocoSsd) {
            const loadCoocSSDFn = (
              await import("@/components/computerVision/loadCVModels")
            ).loadCoocSSDFn;
            loadCocoSsd(await loadCoocSSDFn(computerVisionOn && !cocoSsd));
          }
        } else {
          if (!mobileNetModel || !cocoSsd) {
            alert("Please connect to internet.");
            setComputerVisionOn(false);
            return;
          }
        }
      }
    })();
    // import
  }, [computerVisionOn]);

  return (
    <>
      <span
        style={{ ...iconStyle, color: `${computerVisionOn ? "red" : "grey"}` }}
        onClick={() => {
          setComputerVisionOn(!computerVisionOn);
        }}
        onTouchEnd={() => {
          setComputerVisionOn(!computerVisionOn);
        }}
      >
        &#128065;
      </span>
    </>
  );
}

const iconStyle = {
  fontSize: "2rem",
  margin: "-0.7rem 0",
};

export default React.memo(ComputerVision);
