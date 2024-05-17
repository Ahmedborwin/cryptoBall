
const FormFile = ({ onChange, children }) => {
    return (
        <div className="w-full">
            <label className="block mb-2 text-sm font-bold text-white">
                {children}
            </label>

            <input
                type="file"
                name="media"
                onChange={onChange}
                accept="image/*, video/*"
                className="w-full px-4 py-2 text-white bg-[#ffffff20] rounded-md focus:ring focus:ring-blue-500"
            />
        </div>
    )
}

export default FormFile;