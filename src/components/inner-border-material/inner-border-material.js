import React, {Component} from 'react';

//classes from center-material.css

class InnerBorderMaterial extends Component {
    render() {
        const materials = [
            {
                id: 1,
                name: "cotton",
                src: "http://cdn.crucial-trading.com/uploads/20161114130802/cotton-icon-1.svg"
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

        return (
            <div className="materials-center-list">
                {
                    materials.map((material) => {
                        return (
                            <div className="single-materials-center-list" key={material.id}>
                                <div >
                                    <img src={material.src} alt="inner-border-type-material"/>
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

export default InnerBorderMaterial;