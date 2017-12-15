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

    // this.updateStages = updatedCanvasImages => {
    //   return {
    //     type: 'MUTATE_SELECTED_STRUCTURE',
    //     updatedCanvasImages: updatedCanvasImages
    //   }
    // }

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

    this.test()
  };


  dispatchAction(newImage) {
    this.store.dispatch(this.mutateSelectedStructureAction(newImage));
  }

  dispatchUpdateCanvasImagesAction(updatedCanvasImages) {
    this.store.dispatch(this.updateCanvasImages(updatedCanvasImages));
  }

  test() {

    /**
     * FOR TESTING ONLY
     */

    const defaultCanvasImages = [
      {
        stageIndex: 0,
        src: "https://d105txpzekqrfa.cloudfront.net/hospitality/structures/H1200/base.jpg",
        img: "https://d105txpzekqrfa.cloudfront.net/hospitality/structures/H1200/base-colour.jpg",
        jpg: "",
        alt: "H1200"
      },
      {
        stageIndex: 1,
        alt: "C40000",
        src: "https://d105txpzekqrfa.cloudfront.net/hospitality/structures/H1200/C40000/colour-1.png",
        jpg: "https://d105txpzekqrfa.cloudfront.net/hospitality/structures/H1200/C40000/colour-1.jpg",
        img: "https://d105txpzekqrfa.cloudfront.net/hospitality/colours/C40000.jpg"
      }
    ];

    this.dispatchUpdateCanvasImagesAction(defaultCanvasImages);
  }
}
