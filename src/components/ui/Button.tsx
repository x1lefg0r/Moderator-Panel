import clsx from "clsx";
import type { ButtonProps } from "../../types";

const SIZE_STYLES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-4 py-3 text-base",
};

const VARIANT_STYLES = {
  primary: "bg-green-500 hover:bg-green-600 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
  danger: "bg-red-100 hover:bg-red-200 text-red-700",
  warning: "bg-yellow-400 hover:bg-yellow-500 text-yellow-900",
  ghost: "hover:bg-gray-100 text-gray-600",
};

export const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  className = "",
}: ButtonProps) => {
  const computedClassName = clsx(
    "font-bold rounded transition",
    "disabled:opacity-50 disabled:cursor-now-allowed",
    SIZE_STYLES[size],
    VARIANT_STYLES[variant],
    fullWidth && "w-fall",
    className,
  );

  return (
    <button onClick={onClick} disabled={disabled} className={computedClassName}>
      {children}
    </button>
  );
};
