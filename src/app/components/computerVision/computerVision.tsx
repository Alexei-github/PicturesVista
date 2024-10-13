import React from "react";

import { useVision } from "@/stores/computerVisionStore";

import cvStyle from "@/components/computerVision/cv.module.css";

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
    <span
      className={cvStyle.cv_icon}
      style={{ color: `${computerVisionOn ? "red" : "grey"}` }}
      onClick={() => {
        setComputerVisionOn(!computerVisionOn);
      }}
      onTouchEnd={() => {
        setComputerVisionOn(!computerVisionOn);
      }}
    >
      <div style={{ transform: "translate(0%, -8%)", margin: "-0.5rem 0" }}>
        &#128065;
      </div>
    </span>
  );
}

export default React.memo(ComputerVision);
