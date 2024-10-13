export function getImgNaturalSizeFn(imgURL: string) {
  return new Promise<{
    width: number;
    height: number;
  }>((resolve, reject) => {
    const img = new Image();
    // const imgURL = URL.createObjectURL(imgBlob);
    img.src = imgURL;
    // console.log("hello resolve");
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      // URL.revokeObjectURL(imgURL);
    };
    img.onerror = () => {
      reject(new Error("Failed to load image from Blob"));
      // URL.revokeObjectURL(imgURL);
    };
  });
}

export function calculateImgSides(
  imgWidth: number,
  imgHeight: number,
  sizeFactor: number,
  elementHeight: number,
  elementWidth: number
) {
  const maxWidth = 0.9 * elementWidth;
  const maxHeight = 0.9 * elementHeight;
  const multFactor = Math.sqrt(
    (elementHeight * elementWidth) / sizeFactor / (imgWidth * imgHeight)
  );

  let widthAnsw;
  let heightAnsw;

  widthAnsw = Math.round(multFactor * imgWidth);
  heightAnsw = Math.round(multFactor * imgHeight);
  if (widthAnsw > maxWidth) {
    widthAnsw = maxWidth;
    heightAnsw = (widthAnsw * imgHeight) / imgWidth;
    if (heightAnsw > maxHeight) {
      heightAnsw = maxHeight;
      widthAnsw = (heightAnsw * imgWidth) / imgHeight;
    }
  } else if (heightAnsw > maxHeight) {
    heightAnsw = maxHeight;
    widthAnsw = (heightAnsw * imgWidth) / imgHeight;
    if (widthAnsw > maxWidth) {
      widthAnsw = maxWidth;
      heightAnsw = (widthAnsw * imgHeight) / imgWidth;
    }
  }

  return {
    width: widthAnsw,
    height: heightAnsw,
  };
}
