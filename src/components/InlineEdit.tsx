import React, { useState, useEffect } from "react";

type InlineEditProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  onChange: (newValue: string) => void;
  onSave: () => void;
};

const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onChange,
  onSave,
  className = "",
  ...props
}) => {
  const [tempValue, setTempValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    if (tempValue !== value) {
      onChange(tempValue);
      onSave();
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return isEditing ? (
    <input
      {...props}
      autoFocus
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSave();
        } else if (e.key === "Escape") {
          handleCancel();
        }
      }}
      className={`border-b focus:outline-none ${className}`}
    />
  ) : (
    <div
      {...props}
      className={`cursor-pointer ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {value}
    </div>
  );
};

export default InlineEdit;
