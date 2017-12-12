/**
 * handle update canvas images in the Redux Store
 */
RugBuilder.prototype.updateCanvasImageService = function(newImage) {
  const RS = ReduxStore;
  const store = RS.store;

  const updateCanvasImage = (newImage) => {
    var newImages = store.getState().canvasImages;

    const x = newImages[0] ? newImages.findIndex((image) => {
        return image.stageIndex === newImage.stageIndex
      })
      :
      -1;

    if (newImage.stageIndex === 0) {
      newImages = [];
      newImages.push(newImage);
      RS.dispatchUpdateCanvasImagesAction(newImages);
      return;
    }

    /* update previous stage canvas image in
      the array -> if stage already added  */
    if (x !== -1) {
      newImages.splice(x, 1, newImage);
      RS.dispatchUpdateCanvasImagesAction(newImages);
      return;
    }

    /* add new canvas image to array for that stage */
    newImages.push(newImage);
    RS.dispatchUpdateCanvasImagesAction(newImages);
  }

  updateCanvasImage(newImage);
}
