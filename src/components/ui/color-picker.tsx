import React from "react";
import { Input } from "./input";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ value, onChange, className, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-md border"
          style={{ backgroundColor: value }}
        />
        <Input
          ref={ref}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-12 h-8 p-0 overflow-hidden ${className}`}
          {...props}
        />
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";