import { useState } from 'react';

export default function ImageUpload({ label, onFileSelect, currentImageUrl, required }) {
  const [preview, setPreview] = useState(currentImageUrl || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="flex items-center space-x-4">
        {preview && (
          <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded border" />
        )}

        <div className="flex-1">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-green-700 file:text-white
              hover:file:bg-green-600 hover:file:shadow-md
              file:transition-all
              cursor-pointer"
          />
          <p className="mt-1 text-xs text-gray-500">
            Accepted: JPEG, PNG, WebP (max 10MB)
          </p>
        </div>
      </div>
    </div>
  );
}
