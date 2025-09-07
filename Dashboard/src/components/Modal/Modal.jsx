import React, { useState } from "react";

const Modal = ({
    title,
    subtitle,
    mode,
    data,
    fields,
    onClose,
    onSubmit,
    loading,
    errors = {}
}) => {
    const [formData, setFormData] = useState(() => {
        const initial = {};
        fields?.forEach(f => {
            initial[f.name] = data?.[f.name] || "";
        });
        return initial;
    });

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === "delete") {
            onSubmit({ id: data?._id });
        } else {
            onSubmit(formData);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">

                {/* Header */}
                <div className="flex justify-between items-center border-b p-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        {subtitle && (
                            <p className="text-sm text-gray-500">{subtitle}</p>
                        )}
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
                    >
                        ✕
                    </button>
                </div>

                {/* Delete Mode */}
                {mode === "delete" ? (
                    <div className="p-6">
                        <p className="text-gray-700">
                            Are you sure you want to delete <b>{data?.name || "this item"}</b>?
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button 
                                onClick={onClose} 
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                disabled={loading}
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Grid with 2 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields?.map((field) => (
                                <div key={field.name} className={field.containerClassName || ''}>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>

                                    {field.type === "select" ? (
                                        <select
                                            value={formData[field.name]}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className={`${field.className || ''} w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors[field.name] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            required={field.required}
                                            {...(field.inputProps || {})}
                                        >
                                            <option value="">Select {field.label}</option>
                                            {Array.isArray(field.options) && field.options.map((opt) => {
                                                const isObject = typeof opt === 'object' && opt !== null;
                                                const optionValue = isObject ? (opt.value ?? opt.label ?? '') : opt;
                                                const optionLabel = isObject ? (opt.label ?? opt.value ?? '') : opt;
                                                return (
                                                    <option key={optionValue} value={optionValue}>{optionLabel}</option>
                                                );
                                            })}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={formData[field.name]}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className={`${field.className || ''} w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors[field.name] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder={`Enter ${field.label.toLowerCase()}`}
                                            required={field.required}
                                            {...(field.inputProps || {})}
                                        />
                                    )}
                                    {errors[field.name] && (
                                        <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-6 py-2 rounded-lg text-white transition-colors ${
                                    mode === "edit" 
                                        ? "bg-blue-600 hover:bg-blue-700" 
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                                disabled={loading}
                            >
                                {loading
                                    ? "Processing..."
                                    : mode === "add"
                                        ? "Add"
                                        : "Update"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Modal;
