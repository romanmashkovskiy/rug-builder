/**
 * handle update canvas images in the Redux Store
 */
RugBuilder.prototype.updateCanvasImageService = function(newImage) {
  console.log('service !!!!!');

  const RS = ReduxStore;
  const store = RS.store;


  var newImages = store.getState().canvasImages;

  console.log(newImages);

  console.log('0');

  const x = newImages[0] ? newImages.findIndex((image) => {
      return image.stageIndex === newImage.stageIndex
    })
    :
    -1;

  console.log('1');

  /* update previous stage canvas image in
    the array if stage already added  */
  if (x !== -1) {
    if (this.currentStage === 0) {
      newImages = [];
      newImages.push(newImage);
    } else {
      newImages.splice(x, 1, newImage);
    }
  }

  /* add new canvas image to array for that stage */
  else {
    if (this.currentStage === 0) {
      newImages = [];
      newImages.push(newImage);
    }
    newImages.push(newImage);
  }

  console.log('dispatch action from service !!');
  RS.dispatchUpdateCanvasImagesAction(newImages);
}
