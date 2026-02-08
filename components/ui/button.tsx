"use client"

export const Button = ({
  children,
  active = false,
  onClick,
  className = "",
  variant = "secondary",
}) => {
  const baseStyles =
    "px-10 py-5 rounded text-lg font-semibold transition-all duration-200 flex-1"

  const variants = {
    primary: "bg-[#f57c00] hover:bg-[#ff8f00] text-white w-full py-6 text-2xl",
    secondary: active
      ? "bg-[#f57c00] text-white text-lg"
      : "bg-[#242c38] text-gray-400 hover:bg-[#2d3745] text-lg",
  }

  const finalVariant =
    variant === "primary" ? variants.primary : variants.secondary

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${finalVariant} ${className}`}
    >
      {children}
    </button>
  )
}
