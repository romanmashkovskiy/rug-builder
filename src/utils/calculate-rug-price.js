export const calculatePrice = (length, width, rugType, innerBorder, outerBorder, piping, centerMaterialPrice) => {
    if (length === 0 || length === '' || width === 0 || width === '') {
        return 0;
    }

    if (centerMaterialPrice && innerBorder.cats && outerBorder.cats) {
        let innerBorderPrice = 0;
        let outerBorderPrice = 0;
        let pipingPrice = 0;

        let totalPrice;

        const innerBorderCategory = innerBorder.cats[0].name;
        console.log(innerBorderCategory);
        const outerBorderCategory = outerBorder.cats[0].name;
        console.log(outerBorderCategory);






        const area = length * width;
        const centerPrice = centerMaterialPrice * area;

    }

};

// calculatePrice(
//     this.props.length,
//     this.props.width,
//     this.props.border,
//     this.props.innerBorder,
//     this.props.outerBorder,
//     this.props.piping,
//     this.props.centerMaterialPrice
// )


// calculatePrice(LENGTH, WIDTH) {
//
//     const R = rugBuilder;
//
//     let totalPrice;
//
//     // If the length/width is empty or 0, publish the newPrice event so the price can be updated to zero, and return
//     if ( LENGTH === 0 || LENGTH === '' || WIDTH === 0 || WIDTH === '' ) {
//         PubSub.publish('newPrice', 0);
//         return;
//     }
//
//     // Get user's current center material choice
//     const CURRENT_CENTER_MATERIAL = this.centerMaterial;
//
//     // Get the price data for the user's current center material choice
//     this.getPriceData(CURRENT_CENTER_MATERIAL)
//         .then((price) => {
//
//             // Work out the center area and how much that will cost
//             const AREA         = LENGTH * WIDTH;
//             const CENTER_PRICE = price * AREA;
//             let BORDER_PRICE;
//
//             const BORDER_TYPE = R.borderType;
//
//             let INNER_BORDER = false;
//             let PIPING       = false;
//             let OUTER_BORDER = false;
//
//             switch ( BORDER_TYPE ) {
//
//                 case 'single' :
//                     let single_choice = R.borderMaterials.single.split(' ').join('');
//                     INNER_BORDER      = R.WCswatches[single_choice];
//                     break;
// //
//                 case 'piping' :
//                     let border_choice = R.borderMaterials.piping.inner.split(' ').join('');
//                     let piping_choice = R.borderMaterials.piping.piping;
//                     INNER_BORDER      = R.WCswatches[border_choice];
//
//                     for ( let i = 0; i < R.WCpiping.length; i++ ) {
//                         if ( piping_choice === R.WCpiping[i].post_title ) {
//                             PIPING = R.WCpiping[i];
//                             break;
//                         }
//                     }
//
//                     break;
//
//                 case 'double' :
//                     let inner_choice = R.borderMaterials.double.inner.split(' ').join('');
//                     let outer_choice = R.borderMaterials.double.outer.split(' ').join('');
//                     INNER_BORDER     = R.WCswatches[inner_choice];
//                     OUTER_BORDER     = R.WCswatches[outer_choice];
//                     break
//             }
//
//             if ( BORDER_TYPE === 'single' ) {
//
//                 let s_singleBorderMaterial, s_singleBorderPrice = 0;
//
//                 for ( let i = 0; i < INNER_BORDER.cats.length; i++ ) {
//
//                     if ( INNER_BORDER.cats[i].parent === 487 ) {
//                         s_singleBorderMaterial = INNER_BORDER.cats[i].slug;
//                         break;
//                     }
//
//                 }
//
//                 if ( s_singleBorderMaterial === 'cotton' || s_singleBorderMaterial === 'linen' ) {
//                     s_singleBorderPrice = 17;
//                 } else if ( s_singleBorderMaterial === 'leather' || s_singleBorderMaterial === 'suede' ) {
//                     s_singleBorderPrice = 38;
//                 }
//
//                 BORDER_PRICE = s_singleBorderPrice * ((LENGTH * 2) + (WIDTH * 2));
//
//             } else if ( BORDER_TYPE === 'piping' ) {
//
//                 let p_singleBorderMaterial, p_singleBorderPrice = 0;
//
//                 for ( let i = 0; i < INNER_BORDER.cats.length; i++ ) {
//
//                     if ( INNER_BORDER.cats[i].parent === 487 ) {
//                         p_singleBorderMaterial = INNER_BORDER.cats[i].slug;
//                         break;
//                     }
//
//                 }
//
//                 if ( p_singleBorderMaterial === 'cotton' || p_singleBorderMaterial === 'linen' ) {
//                     p_singleBorderPrice = 25;
//                 } else if ( p_singleBorderMaterial === 'leather' || p_singleBorderMaterial === 'suede' ) {
//                     p_singleBorderPrice = 50;
//                 }
//
//                 let outerBorderPrice = p_singleBorderPrice * ((LENGTH * 2) + (WIDTH * 2));
//
//                 // have PIPING the obj that contains the piping but no idea if needed or not
//                 // For now assume £0 per m2 and times by perimeter and add to actual border price
//
//                 let pipingPrice      = 0 * ((LENGTH * 2) + (WIDTH * 2));
//
//                 BORDER_PRICE = outerBorderPrice + pipingPrice;
//
//             } else if ( BORDER_TYPE === 'double' ) {
//
//                 let innerBorderMaterial, outerBorderMaterial;
//
//                 for ( let i = 0; i < INNER_BORDER.cats.length; i++ ) {
//
//                     if ( INNER_BORDER.cats[i].parent === 487 ) {
//                         innerBorderMaterial = INNER_BORDER.cats[i].slug;
//                         break;
//                     }
//
//                 }
//
//                 for ( let i = 0; i < OUTER_BORDER.cats.length; i++ ) {
//
//                     if ( OUTER_BORDER.cats[i].parent === 487 ) {
//                         outerBorderMaterial = OUTER_BORDER.cats[i].slug;
//                         break;
//                     }
//
//                 }
//
//                 let basePrice;
//
//                 switch ( innerBorderMaterial ) {
//
//                     case 'cotton' :
//
//                         if ( outerBorderMaterial === 'cotton' ) {
//                             basePrice = 25;
//                         } else if ( outerBorderMaterial === 'linen' ) {
//                             basePrice = 25;
//                         } else if ( outerBorderMaterial === 'suede' ) {
//                             basePrice = 50;
//                         } else if ( outerBorderMaterial === 'leather' ) {
//                             basePrice = 50;
//                         }
//
//                         break;
//
//                     case 'linen' :
//
//                         if ( outerBorderMaterial === 'cotton' ) {
//                             basePrice = 25;
//                         } else if ( outerBorderMaterial === 'linen' ) {
//                             basePrice = 25;
//                         } else if ( outerBorderMaterial === 'suede' ) {
//                             basePrice = 50;
//                         } else if ( outerBorderMaterial === 'leather' ) {
//                             basePrice = 50;
//                         }
//
//                         break;
//
//                     case 'leather' :
//
//                         if ( outerBorderMaterial === 'cotton' ) {
//                             basePrice = 50;
//                         } else if ( outerBorderMaterial === 'linen' ) {
//                             basePrice = 50;
//                         } else if ( outerBorderMaterial === 'suede' ) {
//                             basePrice = 60;
//                         } else if ( outerBorderMaterial === 'leather' ) {
//                             basePrice = 60;
//                         }
//
//                         break;
//
//                     case 'suede' :
//
//                         if ( outerBorderMaterial === 'cotton' ) {
//                             basePrice = 50;
//                         } else if ( outerBorderMaterial === 'linen' ) {
//                             basePrice = 50;
//                         } else if ( outerBorderMaterial === 'suede' ) {
//                             basePrice = 60;
//                         } else if ( outerBorderMaterial === 'leather' ) {
//                             basePrice = 60;
//                         }
//
//                         break;
//
//                 }
//
//                 BORDER_PRICE = basePrice * ((LENGTH * 2) + (WIDTH * 2));
//
//             }
//
//             const PRE_SUBTOTAL = parseFloat(CENTER_PRICE + BORDER_PRICE);
//             const SUBTOTAL     = PRE_SUBTOTAL.toFixed(2);
//             let TOTAL_PRICE = SUBTOTAL;
//
//             /* add an additional quarter in price for rugs
//                 with width > 4 and length < 2 */
//             if ( parseFloat(LENGTH) > 4 && parseFloat(WIDTH) < 2 ) {
//                 TOTAL_PRICE = parseFloat(TOTAL_PRICE);
//                 TOTAL_PRICE = TOTAL_PRICE + (TOTAL_PRICE / 4);
//                 TOTAL_PRICE = TOTAL_PRICE.toFixed(2);
//             }
//
//             // Publish the newPrice event so the price can be updated
//             PubSub.publish('newPrice', [TOTAL_PRICE, LENGTH, WIDTH]);
//
//             // Save the user selected length and width, and the price
//             this.length = LENGTH;
//             this.width  = WIDTH;
//             this.price  = TOTAL_PRICE;
//         })
//         .catch(() => {
//             R.error(1000, true)
//         });
// }