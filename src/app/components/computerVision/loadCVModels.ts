// import "@tensorflow/tfjs-backend-webgl";
// import "@tensorflow/tfjs-backend-cpu";
// import * as mobilenet from "@tensorflow-models/mobilenet";
// import * as coco_ssd from "@tensorflow-models/coco-ssd";
// import { useVision } from "@/stores/computerVision";
// const { loadMobileNet, loadCocoSsd } = useVision();

// export async function loadMobileNetFn(load: boolean) {
//   if (load) {
//     await import("@tensorflow/tfjs-backend-webgl");
//     const mobileNet = await (
//       await import("@tensorflow-models/mobilenet")
//     ).load({ version: 2, alpha: 1.0 });
//     console.log("mobileNetLoaded");
//     return mobileNet;
//   }
// }

export async function loadCoocSSDFn(load: boolean) {
  if (load) {
    await import('@tensorflow/tfjs-backend-webgl');

    await import('@tensorflow/tfjs-backend-cpu');
    const cocoSSD = await (await import('@tensorflow-models/coco-ssd')).load();
    console.log('cocoSsdLoaded');
    return cocoSSD;
  }
}
