// var createStore = Redux.createStore;
// var Provider = ReactRedux.Provider;
// var connect = ReactRedux.connect;
//
//
// var initialState = {
//   data: [],
//   url: "/api/comments",
//   pollInterval: 2000
// }
//
//
//
// /* First action: add_comment */
// {
//   type: 'add_comment',
//   comment: comment,
// }
//
// /* Second action: set_comments */
// {
//   type: 'set_comments',
//   data: data
// }
//
//
//
// var reducer = function(state, action) {
//   if(state === undefined) {
//     return initialState;
//   }
//   var newState = state;
//   switch(action.type) {
//     case 'add_comment':
//       var newComments = state.data.concat([action.comment]);
//       newState = Object.assign({}, state, {data: newComments});
//       break;
//     case 'set_comments':
//       newState = Object.assign({}, state, {data: action.data})
//       break;
//   }
//
//   return newState;
// }
////
//
// var store = createStore(reducer, initialState);
