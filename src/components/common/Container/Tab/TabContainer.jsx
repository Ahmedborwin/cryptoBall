import React from 'react';
import propTypes from "prop-types";

const TabContainer = ({ children, ...props }) => {
    return <div className="w-full h-screen flex justify-between p-10" {...props}>{children}</div>;
}

TabContainer.propTypes = {
    children: propTypes.any
}

export default TabContainer;