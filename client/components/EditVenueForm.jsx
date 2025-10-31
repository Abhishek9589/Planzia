import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AutocompleteInput } from '@/components/ui/autocomplete-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Upload, Plus, Trash2, X } from 'lucide-react';
import { VENUE_TYPES } from '@/constants/venueOptions';
import { getUserFriendlyError } from '@/lib/errorMessages';
import apiClient from '../lib/apiClient.js';
import { City, State } from 'country-state-city';

// Function to compress images before upload
const compressImage = (base64String, quality = 0.7, maxWidth = 1200, maxHeight = 1200) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64String;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with reduced quality
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };
  });
};

export default function EditVenueForm({ isOpen, onClose, onSubmit, venue }) {

  const [formData, setFormData] = useState({
    venueName: '',
    description: '',
    venueType: '',
    state: '',
    city: '',
    footfall: '',
    googleMapsUrl: '',
    price: '',
    facilities: [''],
    images: []
  });

  const [stateInputValue, setStateInputValue] = useState('');
  const [cityInputValue, setCityInputValue] = useState('');
  const [errors, setErrors] = useState({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get all Indian states
  const allStates = useMemo(() => {
    return State.getStatesOfCountry('IN')
      .map(state => ({ code: state.isoCode, name: state.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Get cities for selected state
  const cities = useMemo(() => {
    if (formData.state) {
      return City.getCitiesOfState('IN', formData.state)
        .map(city => city.name)
        .sort((a, b) => a.localeCompare(b));
    }
    return [];
  }, [formData.state]);

  // Populate form when venue prop changes
  useEffect(() => {
    if (venue) {
      // Parse location to extract state and city
      let stateCode = '', stateName = '', city = '';
      if (venue.location) {
        const parts = venue.location.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          city = parts[0];
          stateName = parts[parts.length - 1];
          // Find the state code from the state name
          const foundState = allStates.find(s => s.name.toLowerCase() === stateName.toLowerCase());
          stateCode = foundState ? foundState.code : '';
        }
      }

      setFormData({
        venueName: venue.name || '',
        description: venue.description || '',
        venueType: venue.type || '',
        state: stateCode,
        city: city,
        footfall: venue.capacity || '',
        googleMapsUrl: venue.googleMapsUrl || '',
        images: venue.images || (venue.image ? [venue.image] : []),
        facilities: venue.facilities || [''],
        price: venue.price || venue.price_per_day || ''
      });

      setStateInputValue(stateName);
      setCityInputValue(city);
    }
  }, [venue, allStates]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Image compression function
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 10) {
      setErrors(prev => ({ ...prev, images: 'Maximum 10 images allowed' }));
      return;
    }

    // Process files one by one for better performance
    for (const file of files) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, images: 'Each image must be less than 10MB' }));
        continue;
      }

      try {
        // Compress image for faster upload
        const compressedFile = await compressImage(file, 800, 0.8);

        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, e.target.result]
          }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error processing image:', error);
        setErrors(prev => ({ ...prev, images: 'Error processing image. Please try again.' }));
      }
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleFacilityChange = (index, value) => {
    const newFacilities = [...formData.facilities];
    newFacilities[index] = value;
    setFormData(prev => ({
      ...prev,
      facilities: newFacilities
    }));
  };

  const addFacility = () => {
    setFormData(prev => ({
      ...prev,
      facilities: [...prev.facilities, '']
    }));
  };

  const removeFacility = (index) => {
    if (formData.facilities.length > 1) {
      setFormData(prev => ({
        ...prev,
        facilities: prev.facilities.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.venueName.trim()) {
      newErrors.venueName = 'Venue name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    const footfall = parseInt(formData.footfall);
    if (!formData.footfall || isNaN(footfall) || footfall <= 0) {
      newErrors.footfall = 'Footfall capacity must be a number greater than 0';
    }

    const price = parseInt(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be a number greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImagesToCloudinary = async (imageDataArray) => {
    // If no images, return empty array
    if (!imageDataArray || imageDataArray.length === 0) {
      return [];
    }

    try {
      setUploadingImages(true);

      // Filter out already uploaded images (URLs) from new base64 images
      const newImages = imageDataArray.filter(img => img.startsWith('data:image/'));
      const existingUrls = imageDataArray.filter(img => !img.startsWith('data:image/'));

      let newImageUrls = [];
      if (newImages.length > 0) {
        // Upload images sequentially for better performance and progress tracking
        for (let i = 0; i < newImages.length; i++) {
          setErrors(prev => ({
            ...prev,
            images: `Compressing and uploading image ${i + 1} of ${newImages.length}...`
          }));

          try {
            // Compress the image before uploading
            let compressedImageData = newImages[i];
            try {
              compressedImageData = await compressImage(newImages[i], 0.65, 1200, 1200);
            } catch (compressionError) {
              console.warn(`Image compression failed for image ${i + 1}, using original:`, compressionError);
              // Continue with original if compression fails
            }

            const data = await apiClient.postJson('/api/upload/image', {
              imageData: compressedImageData,
              folder: 'Planzia/venues'
            });

            if (!data || !data.url) {
              console.error('Image upload failed: invalid response');
              setErrors(prev => ({
                ...prev,
                images: `Warning: Failed to upload image ${i + 1}. Continuing with others...`
              }));
              continue;
            }

            newImageUrls.push(data.url);
          } catch (imageError) {
            console.error(`Error uploading image ${i + 1}:`, imageError);
            // Continue with other images
            setErrors(prev => ({
              ...prev,
              images: `Warning: Failed to upload image ${i + 1}. Continuing with others...`
            }));
          }
        }

        // Clear upload progress message
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }

      return [...existingUrls, ...newImageUrls];
    } catch (error) {
      console.error('Image upload error:', error);

      // Show more specific error message
      let userMessage = 'Image upload failed, but venue can be saved without images';
      if (error.message.includes('Must supply api_key') || error.message.includes('demo')) {
        userMessage = 'Image upload service not configured. Venue will be saved without images.';
      } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
        userMessage = 'Authentication failed. Please sign in again.';
      } else if (error.message.includes('413') || error.message.includes('too large')) {
        userMessage = 'Images are too large. Please use smaller images.';
      }

      setErrors(prev => ({ ...prev, images: userMessage }));
      // Return existing URLs and continue
      return imageDataArray.filter(img => !img.startsWith('data:image/'));
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting || uploadingImages) {
      return;
    }

    if (validateForm()) {
      try {
        setIsSubmitting(true);

        // Upload new images to Cloudinary (optional)
        let imageUrls = await uploadImagesToCloudinary(formData.images);

        // Convert state code back to state name for location string
        const stateObj = allStates.find(s => s.code === formData.state);
        const stateName = stateObj ? stateObj.name : formData.state;

        const venueData = {
          venueName: formData.venueName,
          description: formData.description,
          location: `${formData.city}, ${stateName}`,
          footfall: parseInt(formData.footfall),
          price: parseInt(formData.price),
          images: imageUrls,
          facilities: formData.facilities.filter(f => f.trim()).map(f => f.trim().toUpperCase()),
          googleMapsUrl: formData.googleMapsUrl || ''
        };

        // Add optional fields only if they have values
        if (formData.venueType && formData.venueType.trim()) {
          venueData.venueType = formData.venueType;
        }

        console.log('EditVenueForm submitting:', venueData);
        await onSubmit(venueData);
        setErrors({});
      } catch (error) {
        // Form stays open with data intact if submission fails
        console.error('Form submission failed:', error);
        setErrors(prev => ({ ...prev, general: getUserFriendlyError(error, 'general') }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-5xl sm:rounded-2xl p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Venue</DialogTitle>
          <DialogDescription>
            Update your venue information and details
          </DialogDescription>
        </DialogHeader>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Venue Name, Venue Type, and Google Maps URL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Name *
              </label>
              <Input
                value={formData.venueName}
                onChange={(e) => handleInputChange('venueName', e.target.value)}
                placeholder="Enter venue name"
                className={`h-10 ${errors.venueName ? 'border-red-300' : 'border-gray-300'} focus:border-venue-indigo focus:ring-venue-indigo`}
              />
              {errors.venueName && (
                <p className="text-red-500 text-sm mt-1">{errors.venueName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Type
              </label>
              <AutocompleteInput
                options={VENUE_TYPES}
                value={formData.venueType}
                onChange={(value) => handleInputChange('venueType', value)}
                placeholder="Type to search..."
                className={`w-full h-10 ${errors.venueType ? 'border-red-300' : 'border-gray-300'} focus:border-venue-indigo`}
                data-field="venueType"
                data-value={formData.venueType}
              />
              {errors.venueType && (
                <p className="text-red-500 text-sm mt-1">{errors.venueType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps URL
              </label>
              <Input
                type="url"
                value={formData.googleMapsUrl}
                onChange={(e) => handleInputChange('googleMapsUrl', e.target.value)}
                placeholder="https://maps.google.com/..."
                className={`h-10 ${errors.googleMapsUrl ? 'border-red-300' : 'border-gray-300'} focus:border-venue-indigo focus:ring-venue-indigo`}
              />
              {errors.googleMapsUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.googleMapsUrl}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your venue..."
              rows={4}
              className={`resize-none ${errors.description ? 'border-red-300' : 'border-gray-300'} focus:border-venue-indigo focus:ring-venue-indigo`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* State, City, and Footfall Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <AutocompleteInput
                options={allStates.map(s => s.name)}
                value={stateInputValue}
                onChange={(stateName) => {
                  setStateInputValue(stateName);
                  const selectedState = allStates.find(s => s.name.toLowerCase() === stateName.toLowerCase());
                  if (selectedState) {
                    handleInputChange('state', selectedState.code);
                    handleInputChange('city', '');
                    setCityInputValue('');
                  }
                }}
                placeholder="Type to search..."
                className={`w-full h-10 ${errors.state ? 'border-red-300' : 'border-gray-300'} focus:border-venue-indigo`}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <AutocompleteInput
                options={cities}
                value={cityInputValue}
                onChange={(city) => {
                  setCityInputValue(city);
                  if (cities.includes(city)) {
                    handleInputChange('city', city);
                  }
                }}
                placeholder={!formData.state ? 'Select state first' : 'Type to search...'}
                disabled={!formData.state}
                className={`w-full h-10 ${errors.city ? 'border-red-300' : 'border-gray-300'} ${!formData.state ? 'opacity-50' : ''} focus:border-venue-indigo`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footfall Capacity *
              </label>
              <Input
                type="number"
                value={formData.footfall}
                onChange={(e) => handleInputChange('footfall', e.target.value)}
                placeholder="Maximum guests"
                className={`h-10 ${errors.footfall ? 'border-red-300' : 'border-gray-300'} focus:border-venue-indigo focus:ring-venue-indigo`}
              />
              {errors.footfall && (
                <p className="text-red-500 text-sm mt-1">{errors.footfall}</p>
              )}
            </div>
          </div>

          {/* Price per Day */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Day (₹) *
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Price per day"
                className={`h-10 ${errors.price ? 'border-red-300' : 'border-gray-300'} focus:border-venue-indigo focus:ring-venue-indigo`}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Facilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facilities (Optional)
            </label>
            <div className="space-y-2">
              {formData.facilities.map((facility, index) => (
                <div key={index} className="flex gap-2 items-start min-w-0">
                  <div className="flex-1 min-w-0">
                    <Input
                      value={facility}
                      onChange={(e) => handleFacilityChange(index, e.target.value)}
                      placeholder="Enter facility (e.g., AC, Parking, Catering) - Optional"
                      className="h-10 border-gray-300 focus:border-venue-indigo focus:ring-venue-indigo"
                    />
                  </div>
                  {formData.facilities.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 flex-shrink-0"
                      onClick={() => removeFacility(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addFacility}
                className="h-10 text-sm border-gray-300 hover:bg-gray-50 text-venue-indigo hover:text-venue-indigo focus:text-venue-indigo focus:border-venue-indigo w-fit"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Facility
              </Button>
            </div>
            {errors.facilities && (
              <p className="text-red-500 text-sm mt-1">{errors.facilities}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (Optional - up to 10 allowed)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Click to upload venue images</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
              </label>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {formData.images.length}/10 images uploaded {formData.images.length === 0 && '(Images are optional)'}
            </p>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Venue ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {errors.images && (
              <p className={`text-sm mt-1 ${errors.images.includes('Uploading') ? 'text-blue-600' : 'text-red-500'}`}>
                {errors.images}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploadingImages || isSubmitting}
              className="flex-1 h-10 bg-venue-indigo hover:bg-venue-purple text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImages ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading Images...
                </div>
              ) : isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Venue...
                </div>
              ) : 'Update Venue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
