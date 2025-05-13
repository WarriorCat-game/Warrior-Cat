import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import { useNFT } from '../contexts/NFTContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/CreateNFT.css';

/**
 * CreateNFT page component
 * @returns {React.ReactElement} CreateNFT page
 */
const CreateNFT = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { createNFT, loading, error } = useNFT();
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collection: '',
    imageFile: null,
  });
  
  const [preview, setPreview] = useState(null);
  const [attributes, setAttributes] = useState([
    { trait_type: '', value: '' }
  ]);
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        imageFile: 'Please select a valid image file (JPEG, PNG, GIF, or WEBP)'
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        imageFile: 'Image size must be less than 5MB'
      });
      return;
    }
    
    // Set file and preview
    setFormData({
      ...formData,
      imageFile: file
    });
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Clear error
    if (errors.imageFile) {
      setErrors({
        ...errors,
        imageFile: ''
      });
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle attribute change
  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index] = {
      ...newAttributes[index],
      [field]: value
    };
    setAttributes(newAttributes);
  };

  // Add new attribute
  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }]);
  };

  // Remove attribute
  const removeAttribute = (index) => {
    if (attributes.length <= 1) return;
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.collection.trim()) {
      newErrors.collection = 'Collection name is required';
    }
    
    if (!formData.imageFile) {
      newErrors.imageFile = 'Image is required';
    }
    
    // Validate attributes have both trait_type and value
    const invalidAttributes = attributes.filter(
      attr => (attr.trait_type.trim() && !attr.value.trim()) || 
              (!attr.trait_type.trim() && attr.value.trim())
    );
    
    if (invalidAttributes.length > 0) {
      newErrors.attributes = 'All attributes must have both a trait type and value';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/create' } });
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmissionError('');
    
    try {
      // Filter out empty attributes
      const filteredAttributes = attributes.filter(
        attr => attr.trait_type.trim() && attr.value.trim()
      );
      
      // Create NFT metadata
      const nftData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        collection: formData.collection.trim(),
        imageFile: formData.imageFile,
        attributes: filteredAttributes
      };
      
      // Create NFT
      const result = await createNFT(nftData);
      
      if (result) {
        navigate(`/nft/${result._id}`);
      }
    } catch (err) {
      setSubmissionError(err.message || 'Failed to create NFT. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-nft-page">
      <div className="create-nft-header">
        <h1>Create New NFT</h1>
        <p>Create your unique Warrior Cat NFT on the blockchain</p>
      </div>

      <form className="create-nft-form" onSubmit={handleSubmit}>
        <div className="create-nft-layout">
          {/* Image Upload */}
          <div className="image-upload-section">
            <div 
              className={`image-upload-area ${errors.imageFile ? 'has-error' : ''}`}
              onClick={triggerFileInput}
            >
              {preview ? (
                <img 
                  src={preview} 
                  alt="NFT preview" 
                  className="image-preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <p className="upload-text">Click to upload an image</p>
                  <p className="upload-hint">Supports JPG, PNG, GIF, WEBP (Max 5MB)</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageSelect}
                className="file-input"
              />
            </div>
            {errors.imageFile && (
              <p className="error-message">{errors.imageFile}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="form-fields-section">
            <div className="form-group">
              <Input
                label="Name"
                name="name"
                placeholder="Give your NFT a name"
                value={formData.name}
                onChange={handleInputChange}
                required
                error={errors.name}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                placeholder="Describe your NFT"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`textarea-input ${errors.description ? 'error' : ''}`}
              />
              {errors.description && (
                <p className="error-message">{errors.description}</p>
              )}
            </div>

            <div className="form-group">
              <Input
                label="Collection"
                name="collection"
                placeholder="Collection name"
                value={formData.collection}
                onChange={handleInputChange}
                required
                error={errors.collection}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Attributes</label>
              <div className="attributes-list">
                {attributes.map((attr, index) => (
                  <div key={index} className="attribute-row">
                    <div className="attribute-inputs">
                      <input
                        type="text"
                        placeholder="Trait type (e.g. Color)"
                        value={attr.trait_type}
                        onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                        className="attribute-input"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. Blue)"
                        value={attr.value}
                        onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                        className="attribute-input"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      className="attribute-remove"
                      disabled={attributes.length <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              {errors.attributes && (
                <p className="error-message">{errors.attributes}</p>
              )}
              <button
                type="button"
                onClick={addAttribute}
                className="add-attribute-button"
              >
                + Add Attribute
              </button>
            </div>

            {submissionError && (
              <div className="submission-error">
                <p>{submissionError}</p>
              </div>
            )}

            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <span className="loading-text">Creating</span>
                    <Loader size="small" variant="white" />
                  </>
                ) : (
                  'Create NFT'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateNFT; 