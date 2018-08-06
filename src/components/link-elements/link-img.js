import React from 'react';
import { withRouter } from 'react-router-dom';

const LinkImg = (props) => {
    const {
        history,
        location,
        match,
        staticContext,
        to,
        onClick,
        alt,
        src,
        // ⬆ filtering out props that `button` doesn’t know what to do with.
        ...rest
    } = props;
    return (
        <img
            {...rest} // `children` is just another prop!
            src={src}
            alt={alt}
            onClick={(event) => {
                onClick && onClick(event);
                history.push(to);
            }}
        />
    )
};

export default withRouter(LinkImg);