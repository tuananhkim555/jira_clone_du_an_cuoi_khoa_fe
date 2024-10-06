import React from 'react';

interface ShinyEffectProps {
    left?: number;
    right?: number;
    top: number;
    size?: number;
}

const ShinyEffect: React.FC<ShinyEffectProps> = ({ left, right, top, size = 500 }) => {
    const positionStyles: React.CSSProperties & { left?: string; right?: string } = {
        top: `${top}px`,
        width: `${size}px`,
        height: `${size}px`,
        zIndex: -1,
        filter: 'blur(150px)', // tạo hiệu ứng mờ
        pointerEvents: 'none' // để không tương tác với các element khác
    };

    if (left !== undefined) {
        positionStyles.left = `${left}px`;
    }
    if (right !== undefined) {
        positionStyles.right = `${right}px`;
    }

    return <div style={positionStyles as React.CSSProperties} className="shiny-effect"></div>;
};

export default ShinyEffect
