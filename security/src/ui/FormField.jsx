const FormField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
  helperText = "",
  error = "",
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="text-lg font-medium text-gray-500"
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full  rounded-md border px-3 py-5 mb-5 text-lg outline-none
          bg-transparent
           text-gray-400 placeholder:text-gray-400
           placeholder:text-lg
          focus:border-gray-400 focus:ring-1 focus:ring-gray-400
          ${error ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}
        `}
        {...props}
      />

      {/* Helper / error text */}
      {error ? (
        <p className="text-xs text-red-400 mt-0.5">{error}</p>
      ) : (
        helperText && (
          <p className="text-xs text-gray-400 mt-0.5">{helperText}</p>
        )
      )}
    </div>
  );
};

export default FormField;