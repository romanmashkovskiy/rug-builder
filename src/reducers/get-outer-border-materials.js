import * as actions from '../actions/action-types'

const materials = [
    {
        id: 1,
        name: "cotton",
        src: "http://cdn.crucial-trading.com/uploads/20161114130802/cotton-icon-1.svg",
        children: [
            {
                id: 1,
                name: "Cotton Chenille",
                src: "http://cdn.crucial-trading.com/uploads/20170131113640/Cotton_Chenille_CCN1_1223_small.jpg",
                children: [
                    {
                        id: 1,
                        name: "CCN1",
                        src: "http://cdn.crucial-trading.com/uploads/20161114134225/GPC20238437-150x150.jpg"
                    },
                    {
                        id: 2,
                        name: "CCN10",
                        src: "http://cdn.crucial-trading.com/uploads/20161114172558/GPC20238445-150x150.jpg"
                    },
                    {
                        id: 3,
                        name: "CCN12",
                        src: "http://cdn.crucial-trading.com/uploads/20161114172602/GPC20238453-150x150.jpg"
                    }
                ]
            },
            {
                id: 2,
                name: "Cotton Herrinbone",
                src: "http://cdn.crucial-trading.com/uploads/20170202104646/Cotton_Herringbone_C33_1327_small1.jpg"
            },
            {
                id: 3,
                name: "Cotton Picallo",
                src: "http://cdn.crucial-trading.com/uploads/20170202110958/Cotton_Picallo_CP2_1298_small.jpg"
            },
        ]
    },
    {
        id: 2,
        name: "leather",
        src: "http://cdn.crucial-trading.com/uploads/20161114130816/leather-icon-1.svg"
    },
    {
        id: 3,
        name: "linen",
        src: "http://cdn.crucial-trading.com/uploads/20161114130818/linen-icon-1.svg"
    },
    {
        id: 4,
        name: "suede",
        src: "http://cdn.crucial-trading.com/uploads/20161114130819/suede-icon-1.svg"
    }
];

export default (state = materials, action) => {
    switch (action.type) {
        case actions.GET_MATERIALS_OUTER_BORDER:
            return state;
        default:
            return state;
    }
}