"use client";

import React from "react";
import Cookbook from "../../public/Cookbook.json";
import Lottie from "lottie-react";
const CookbookSVG = () => {
  const style = {
    height: 400,
  };
  return <Lottie animationData={Cookbook} loop={false} style={style} />;
};

export default CookbookSVG;
