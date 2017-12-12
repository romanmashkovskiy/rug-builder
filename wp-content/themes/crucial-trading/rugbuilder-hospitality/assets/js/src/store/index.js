class ReduxStore {
  constructor() {
    /**
     * actions
     */
     this.updateCanvasImages = updatedCanvasImages => {
      return {
        type: 'MUTATE_SELECTED_STRUCTURE',
        updatedCanvasImages: updatedCanvasImages
      }
    }

    this.mutateSelectedStructureAction = newSelectedStructure => {
      return {
        type: 'MUTATE_SELECTED_STRUCTURE',
        newSelectedStructure: newSelectedStructure
      }
    }

    const mutateSelectedColorsAction = mutatedSelectedColors => {
      return {
        type: 'MUTATE_SELECTED_COLORS',
        newSelectedColors: newSelectedColors
      }
    };

    /**
     * reducers
     */
     const canvasImages = (state = [], action) => {
       if (!state) {
         return [
           ...canvasImages, []
         ];
       }

       return [
          ...canvasImages, action.updatedCanvasImages
       ];
     }

    const selectedStructure = (state = {}, action) => {
      if (!state) {
        return [
          ...selectedStructure, {}
        ];
      }

      return [
         ...selectedStructure, action.newSelectedStructure
      ];
    }

    const selectedColors = (state = [], action) =>
    {
      if (!state) {
        return [
          ...selectedColors, { selectedColors: [] }
        ];
      }

      return [
        ...selectedColors, { selectedColors: action.newSelectedColors }
      ];
    }

    this.reducers = Redux.combineReducers({
      canvasImages,
      selectedStructure,
      selectedColors
    });

    this.store = Redux.createStore(this.reducers,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  };


  dispatchAction(newImage) {
    console.log('dispatch action');
    console.log(newImage);
    this.store.dispatch(this.mutateSelectedStructureAction(newImage));
  }

  dispatchUpdateCanvasImagesAction(updatedCanvasImages) {
    console.log('dispatch update canvas image');
    this.store.dispatch(this.updateCanvasImages(updatedCanvasImages));
  }
}
