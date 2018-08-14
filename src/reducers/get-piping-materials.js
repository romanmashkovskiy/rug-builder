import * as actions from '../actions/action-types'

const materials = [
    {
        id: 1,
        name: "COR6",
        src: "http://cdn.crucial-trading.com/uploads/20170130121435/GPC20239654_DP-150x150.jpg"
    },
    {
        id: 2,
        name: "COR7",
        src: "http://cdn.crucial-trading.com/uploads/20170130121834/GPC20239662_DP-optim-150x150.jpg"
    },
    {
        id: 3,
        name: "COR8",
        src: "http://cdn.crucial-trading.com/uploads/20170130123124/GPC20239671_DP-optim-150x150.jpg"
    },
    {
        id: 4,
        name: "COR9",
        src: "http://cdn.crucial-trading.com/uploads/20170130123330/GPC20239689_DP-optim-150x150.jpg"
    },
    {
        id: 5,
        name: "COR1",
        src: "http://cdn.crucial-trading.com/uploads/20170130123034/GPC20239590_DP-optim-150x150.jpg"
    },
    {
        id: 6,
        name: "COR10",
        src: "http://cdn.crucial-trading.com/uploads/20170130123446/GPC20239603_DP-optim-150x150.jpg"
    },
    {
        id: 7,
        name: "COR11",
        src: "http://cdn.crucial-trading.com/uploads/20170130124107/GPC20441178_DP-optim-150x150.jpg"
    },
    {
        id: 8,
        name: "COR12",
        src: "http://cdn.crucial-trading.com/uploads/20170130124544/GPC20441186_DP-optim-150x150.jpg"
    },
    {
        id: 9,
        name: "COR2",
        src: "http://cdn.crucial-trading.com/uploads/20170130144838/GPC20239611_DP-optim-150x150.jpg"
    },
    {
        id: 10,
        name: "COR5",
        src: "http://cdn.crucial-trading.com/uploads/20170130145130/GPC20239646_DP-optim-150x150.jpg"
    }
];

export default (state = materials, action) => {
    switch (action.type) {
        case actions.GET_MATERIALS_PIPING:
            return state;
        default:
            return state;
    }
}