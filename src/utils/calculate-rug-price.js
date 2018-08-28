export const calculatePrice = (length, width, rugType, innerBorder, outerBorder, piping, centerMaterialPrice) => {
    if (length === 0 || length === '' || width === 0 || width === '') {
        return 0;
    }

    const area = length * width;
    const centerPrice = centerMaterialPrice * area;

    if (rugType === 'SINGLE-BORDER') {
        if (centerMaterialPrice && outerBorder.cats) {

            let baseOuterBorderPrice = 0;

            const outerBorderCategory = outerBorder.cats[0].name;

            if (outerBorderCategory === 'Cotton' || outerBorderCategory === 'Linen') {
                baseOuterBorderPrice = 17;
            } else if (outerBorderCategory === 'Leather' || outerBorderCategory === 'Suede') {
                baseOuterBorderPrice = 38;
            }

            const outerBorderPrice = baseOuterBorderPrice * ((length * 2) + (width * 2));

            if (parseFloat(length) > 4 && parseFloat(width) < 2) {
                const totalPrice = ((centerPrice + outerBorderPrice) + (centerPrice + outerBorderPrice) / 4).toFixed(2);
                return(totalPrice);
            } else {
                const totalPrice = (centerPrice + outerBorderPrice).toFixed(2);
                return(totalPrice);
            }
        }
    }

    if (rugType === 'BORDER-PIPING') {
        if (centerMaterialPrice && outerBorder.cats && piping.post_title !== 'PIPING') {

            let baseOuterBorderPrice = 0;

            const outerBorderCategory = outerBorder.cats[0].name;

            if (outerBorderCategory === 'Cotton' || outerBorderCategory === 'Linen') {
                baseOuterBorderPrice = 25;
            } else if (outerBorderCategory === 'Leather' || outerBorderCategory === 'Suede') {
                baseOuterBorderPrice = 50;
            }

            const outerBorderPrice = baseOuterBorderPrice * ((length * 2) + (width * 2));

            if (parseFloat(length) > 4 && parseFloat(width) < 2) {
                const totalPrice = ((centerPrice + outerBorderPrice) + (centerPrice + outerBorderPrice) / 4).toFixed(2);
                return(totalPrice);
            } else {
                const totalPrice = (centerPrice + outerBorderPrice).toFixed(2);
                return(totalPrice);
            }
        }
    }

    if (rugType === 'DOUBLE-BORDER') {
        if (centerMaterialPrice && outerBorder.cats && innerBorder.cats) {

            let basePrice = 0;

            const outerBorderCategory = outerBorder.cats[0].name;
            const innerBorderCategory = innerBorder.cats[0].name;

            switch (innerBorderCategory) {

                case 'Cotton' :

                    if (outerBorderCategory === 'Cotton') {
                        basePrice = 25;
                    } else if (outerBorderCategory === 'Linen') {
                        basePrice = 25;
                    } else if (outerBorderCategory === 'Suede') {
                        basePrice = 50;
                    } else if (outerBorderCategory === 'Leather') {
                        basePrice = 50;
                    }

                    break;

                case 'Linen' :

                    if (outerBorderCategory === 'Cotton') {
                        basePrice = 25;
                    } else if (outerBorderCategory === 'Linen') {
                        basePrice = 25;
                    } else if (outerBorderCategory === 'Suede') {
                        basePrice = 50;
                    } else if (outerBorderCategory === 'Leather') {
                        basePrice = 50;
                    }

                    break;

                case 'Leather' :

                    if (outerBorderCategory === 'Cotton') {
                        basePrice = 50;
                    } else if (outerBorderCategory === 'Linen') {
                        basePrice = 50;
                    } else if (outerBorderCategory === 'Suede') {
                        basePrice = 60;
                    } else if (outerBorderCategory === 'Leather') {
                        basePrice = 60;
                    }

                    break;

                case 'Suede' :

                    if (outerBorderCategory === 'Cotton') {
                        basePrice = 50;
                    } else if (outerBorderCategory === 'Linen') {
                        basePrice = 50;
                    } else if (outerBorderCategory === 'Suede') {
                        basePrice = 60;
                    } else if (outerBorderCategory === 'Leather') {
                        basePrice = 60;
                    }

                    break;
            }


            const borderPrice = basePrice * ((length * 2) + (width * 2));

            if (parseFloat(length) > 4 && parseFloat(width) < 2) {
                const totalPrice = ((centerPrice + borderPrice) + (centerPrice + borderPrice) / 4).toFixed(2);
                return(totalPrice);
            } else {
                const totalPrice = (centerPrice + borderPrice).toFixed(2);
                return(totalPrice);
            }
        }
    }
};