import React from "react";

const CustomPrevArrow = (props: { className: any; style: any; onClick: any; }) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, left: "20px", zIndex: 1 }}
      onClick={onClick}
    >
      {/* You can customize the arrow icon or text here */}
      Prev
    </div>
  );
};

const CustomNextArrow = (props: { className: any; style: any; onClick: any; }) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, right: "20px", zIndex: 1 }}
      onClick={onClick}
    >
      {/* You can customize the arrow icon or text here */}
      Next
    </div>
  );
};

export { CustomPrevArrow, CustomNextArrow };
