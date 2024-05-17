import React from "react";

const BentoGrid = ({ children }) => {
    return (
        <div className="flex flex-col items-center my-2">
            <div className="flex w-3/4 flex-col bg-[#131315] px-12 py-10 rounded-3xl my-2">
                {children}
            </div>
        </div>
    )
}

export default BentoGrid;