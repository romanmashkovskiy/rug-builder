import React, {Component} from 'react';
import './center-material.css';
import './wool-center/wool-center';

class CenterMaterial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showChildrenFibre: false
        }
    }


    renderChildren(children) {
        //this.setState({showChildrenFibre: true});
    }

    render() {
        const materials = [
            {
                id: 1,
                name: "wool",
                src: "http://cdn.crucial-trading.com/uploads/2016/10/24195046/wool.svg",
                children: [
                    {
                        id: 1,
                        name: "affluenc",
                        src: "http://cdn.crucial-trading.com/uploads/20161111175248/GPC20643480.jpg"
                    },
                    {
                        id: 2,
                        name: "alaska",
                        src: "http://cdn.crucial-trading.com/uploads/20161111175325/GPC20729953.jpg"
                    },
                    {
                        id: 3,
                        name: "alluring stripe",
                        src: "http://cdn.crucial-trading.com/uploads/20161111175325/GPC20729953.jpg"
                    },
                    {
                        id: 4,
                        name: "audrey",
                        src: "http://cdn.crucial-trading.com/uploads/20161111175435/GPC20200880.jpg"
                    },
                    {
                        id: 5,
                        name: "bella",
                        src: "http://cdn.crucial-trading.com/uploads/20161111175550/GPC20980591.jpg"
                    },
                    {
                        id: 6,
                        name: "biscayne",
                        src: "http://cdn.crucial-trading.com/uploads/20161111175624/GPC30231741.jpg"
                    },
                    {
                        id: 7,
                        name: "biscayne plain",
                        src: "http://cdn.crucial-trading.com/uploads/20161111175816/GPC30231864.jpg"
                    },
                    {
                        id: 8,
                        name: "chicago",
                        src: "http://cdn.crucial-trading.com/uploads/20161111175954/GPC20730102.jpg"
                    },
                    {
                        id: 9,
                        name: "coast",
                        src: "http://cdn.crucial-trading.com/uploads/20161111181147/GPC20415843.jpg"
                    },
                    {
                        id: 10,
                        name: "enchanted",
                        src: "http://cdn.crucial-trading.com/uploads/20161111181242/GPC20954329.jpg"
                    },
                    {
                        id: 11,
                        name: "fabulous",
                        src: "http://cdn.crucial-trading.com/uploads/20161111181324/GPC20676515.jpg"
                    },
                    {
                        id: 12,
                        name: "Fuji",
                        src: "http://cdn.crucial-trading.com/uploads/20161111181506/GPC20530561.jpg"
                    },
                    {
                        id: 13,
                        name: "Grace",
                        src: "http://cdn.crucial-trading.com/uploads/20161111181513/GPC20980486.jpg"
                    },
                    {
                        id: 14,
                        name: "Indulgent",
                        src: "http://cdn.crucial-trading.com/uploads/20161111181625/GPC20347066.jpg"
                    },
                    {
                        id: 15,
                        name: "Inspire",
                        src: "http://cdn.crucial-trading.com/uploads/20161111181653/GPC20643820.jpg"
                    },
                    {
                        id: 16,
                        name: "Jasmine",
                        src: "http://cdn.crucial-trading.com/uploads/20161111181659/GPC20980648.jpg"
                    },
                    {
                        id: 17,
                        name: "Linen n Wool",
                        src: "http://cdn.crucial-trading.com/uploads/20161111181818/GPC20530367.jpg"
                    },
                    {
                        id: 18,
                        name: "Mississippi",
                        src: "http://cdn.crucial-trading.com/uploads/20161111182024/GPC20707992.jpg"
                    },
                    {
                        id: 19,
                        name: "Moloko",
                        src: "http://cdn.crucial-trading.com/uploads/20161111182051/GPC20551879.jpg"
                    },
                    {
                        id: 20,
                        name: "Monsoon",
                        src: "http://cdn.crucial-trading.com/uploads/20161111182127/GPC20530588.jpg"
                    },
                    {
                        id: 21,
                        name: "Oasis",
                        src: "http://cdn.crucial-trading.com/uploads/20161111182148/GPC20699825.jpg"
                    },
                    {
                        id: 22,
                        name: "Opal",
                        src: "http://cdn.crucial-trading.com/uploads/20161111182244/GPC20643625.jpg"
                    },
                    {
                        id: 23,
                        name: "Oregon",
                        src: "http://cdn.crucial-trading.com/uploads/20161111182325/GPC20643846.jpg"
                    },
                    {
                        id: 24,
                        name: "Oregon Stripe",
                        src: "http://cdn.crucial-trading.com/uploads/20161111182402/GPC20643897.jpg"
                    },
                    {
                        id: 25,
                        name: "Passion",
                        src: "http://cdn.crucial-trading.com/uploads/20161111182516/GPC20730021.jpg"
                    },
                    {
                        id: 26,
                        name: "Romeo",
                        src: "http://cdn.crucial-trading.com/uploads/20161111182716/GPC20415908.jpg"
                    },
                    {
                        id: 27,
                        name: "Rustica",
                        src: "http://cdn.crucial-trading.com/uploads/20161111182749/GPC20530464.jpg"
                    },
                    {
                        id: 28,
                        name: "Serenity",
                        src: "http://cdn.crucial-trading.com/uploads/20161111182825/GPC20484144.jpg"
                    },
                    {
                        id: 29,
                        name: "Shimmer",
                        src: "http://cdn.crucial-trading.com/uploads/20161111182910/GPC20973013.jpg"
                    },
                    {
                        id: 30,
                        name: "Sisool Masai",
                        src: "http://cdn.crucial-trading.com/uploads/20161111174516/GPC20813253.jpg"
                    },
                    {
                        id: 31,
                        name: "Sisool Plaid",
                        src: "http://cdn.crucial-trading.com/uploads/20161111174535/GPC20779438.jpg"
                    },
                    {
                        id: 32,
                        name: "Sisool Tric",
                        src: "http://cdn.crucial-trading.com/uploads/20161111174537/GPC20530413.jpg"
                    },
                    {
                        id: 33,
                        name: "Spirit",
                        src: "http://cdn.crucial-trading.com/uploads/20161111183003/GPC20980575.jpg"
                    },
                    {
                        id: 34,
                        name: "Storm",
                        src: "http://cdn.crucial-trading.com/uploads/20161111183103/GPC20717394.jpg"
                    },
                    {
                        id: 35,
                        name: "Treasure",
                        src: "http://cdn.crucial-trading.com/uploads/20161111183115/GPC20975377.jpg"
                    },
                    {
                        id: 36,
                        name: "Venice",
                        src: "http://cdn.crucial-trading.com/uploads/20161111183212/GPC20633085.jpg"
                    },
                    {
                        id: 37,
                        name: "Wilton Panache",
                        src: "http://cdn.crucial-trading.com/uploads/20161111183308/GPC20346744.jpg"
                    },
                    {
                        id: 38,
                        name: "Wilton Svelte",
                        src: "http://cdn.crucial-trading.com/uploads/20161111183405/GPC20346795.jpg"
                    },
                    {
                        id: 39,
                        name: "Wilton Vogue",
                        src: "http://cdn.crucial-trading.com/uploads/20161111183453/GPC20346655.jpg"
                    },
                ]
            },
            {
                id: 2,
                name: "sisal",
                src: "http://cdn.crucial-trading.com/uploads/2016/10/24195044/sisal.svg"
            },
            {
                id: 3,
                name: "sisool",
                src: "http://cdn.crucial-trading.com/uploads/2016/10/24195045/sisool.svg"
            },
            {

                id: 4,
                name: "seagrass",
                src: "http://cdn.crucial-trading.com/uploads/2016/10/24195043/seagrass.svg"
            },
            {
                id: 5,
                name: "coir",
                src: "http://cdn.crucial-trading.com/uploads/2016/10/24195040/coir.svg"
            },
            {
                id: 6,
                name: "jute",
                src: "http://cdn.crucial-trading.com/uploads/2016/10/24195041/jute.svg"
            },
        ];

        return (
            <div className="materials-center-list">
                {
                    !this.state.showChildrenFibre &&
                    materials.map((material) => {
                        return (
                            <div className="single-materials-center-list" key={material.id}
                                 onClick={() => this.setState({showChildrenFibre: true})}>
                                <div>
                                    <img src={material.src} alt="type-material-center"/>
                                    <h3>{material.name}</h3>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        );
    }
}

export default CenterMaterial;