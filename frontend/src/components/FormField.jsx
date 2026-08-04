const FormField = ({
  id,
  type,
  label,
  placeholder,
  register,
  className = "",
  validation,
  error,
}) => {
  return (
    <div className={`mb-5 ${className}`}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-zinc-300"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id, validation)}
        className="
          w-full
          rounded-xl
          border
          border-zinc-700
          bg-zinc-800
          px-4
          py-3
          text-white
          placeholder:text-zinc-500
          outline-none
          transition-all
          duration-200
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/30
        "
      />
      {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
  );
};

export default FormField;
