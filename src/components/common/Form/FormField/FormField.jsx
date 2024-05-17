
const FormField = ({ value, onChange, type="", children }) => {
    return <div className="w-full">
        <label className="block mb-2 text-sm font-bold text-white">
            {children}
        </label>

        <input
            type={type || "text"}
            value={value}
            onChange={onChange}
            className="w-full py-2 px-4 rounded-lg bg-[#ffffff20] text-white placeholder-[#e0e7ff] focus:ring-4 focus:ring-[#bfdbfe] shadow-inner"
        />
    </div>
}

export default FormField;