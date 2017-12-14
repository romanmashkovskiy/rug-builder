/**
 * handle update canvas images in the Redux Store
 */
RugBuilder.prototype.updateCanvasImageService = function(newImage) {
  const RS = ReduxStore;
  const store = RS.store;

  /**
   * update canvas images in Redux Store
   */
  const updateCanvasImage = (newImage) => {
    console.log('update canvas image');

    var newImages = store.getState().canvasImages[0];

    if (newImage.stageIndex === 0) {
      updateStructureInCanvasImages(newImage);
      return;
    }

    /* if image already added for stage ->
      update previous stage canvas image in */
    const x = checkIfImageExistsForStage(newImages, newImage)

    if (x !== -1) {
      console.log('image exists --> splice !!');

      newImages.splice(x, 1, newImage);
      RS.dispatchUpdateCanvasImagesAction(newImages);
      return;
    }

    console.log('new image !!');

    /* add new canvas image to array for that stage */
    newImages.push(newImage);

    console.log('new images ---->');
    console.log(newImages);
    RS.dispatchUpdateCanvasImagesAction(newImages);
  }


  /**
   * If new image is a structure we can create new canvas images as all color images
   * will be reset when a new structure is selected
   */
  const updateStructureInCanvasImages = (newImage) => {
    console.log('update structures in canvas TT');

    const newImages = [newImage];
    // newImages.push(newImage);
    RS.dispatchUpdateCanvasImagesAction(newImages);
  }


  /**
   * use findIndex to check if an image already exists for this stage
   */
  const checkIfImageExistsForStage = (newImages, newImage) => {
    const x = newImages[0] ? newImages.findIndex((image) => {
        return image.stageIndex === newImage.stageIndex
      })
      :
      -1;

    return x;
  }


  updateCanvasImage(newImage);
}
