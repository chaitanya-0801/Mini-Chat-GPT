const CTAButton = ({
  text,
  type = "button",
  clickHandler,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={clickHandler}
      disabled={disabled}
      className="
        w-full
        py-3
        px-6
        rounded-xl
        font-semibold
        text-white
        bg-linear-to-r
        from-blue-600
        to-indigo-600
        shadow-lg
        transition-all
        duration-300
        hover:from-blue-700
        hover:to-indigo-700
        hover:shadow-xl
        hover:-translate-y-0.5
        active:scale-95
        focus:outline-none
        focus:ring-4
        focus:ring-blue-300
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:translate-y-0
      "
    >
      {text}
    </button>
  );
};

export default CTAButton;