import React from "react";
import { Input } from "antd";
import { useAppData } from "../contexts/AppContext";


const { TextArea } = Input;

export const CodeInput = () => {
  const { setCode } = useAppData();
  return (
    <TextArea
      onChange={(e) => {
        setCode(e.target.value);
      }}
    />
  );
};
