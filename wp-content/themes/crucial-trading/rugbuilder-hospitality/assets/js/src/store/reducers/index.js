const myState = [];

const selectedStages = (state = myState, action) => {
  if (!state) {
    return [
      ...selectedStages { selectedStages: [] }
    ];
  }

  return [
    ...currentSearchQuery,
    { currentSearchQuery: action.newSearchQuery }
  ];
}

export default currentSearchQuery
