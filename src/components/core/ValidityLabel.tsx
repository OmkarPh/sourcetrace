import React from "react";

interface ValidityLabelProps {
  valid?: boolean;
  validText?: string;
  inValidText?: string;
}
const ValidityLabel = (props: ValidityLabelProps) => {
  const { valid, validText, inValidText } = props;

  if (valid) {
    return (
      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-green-800 bg-green-200 uppercase last:mr-0 mr-1">
        {validText || "Valid conditions"}
      </span>
    );
  }

  return (
    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-red-600 bg-red-200 uppercase last:mr-0 mr-1">
      {inValidText || "Invalid conditions ‼️"}
    </span>
  );
};

export default ValidityLabel;
