import React from "react";
import "../styles/Category.css";
const Category = ({ title }) => {
  return (
    <div className="category">
      <h3>🎥{title}</h3>
    </div>
  );
};

export default Category;
