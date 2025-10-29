import apiClient from '../lib/apiClient.js';
import { getUserFriendlyError } from '../lib/errorMessages.js';

const API_BASE = '/api/venues';

class VenueService {
  async createVenue(venueData, images) {
    try {
      // First upload images if any
      let uploadedImageUrls = [];
      if (images.length > 0) {
        uploadedImageUrls = await this.uploadImages(images);
      }

      // Prepare venue data for API (matching the expected format)
      const apiData = {
        venueName: venueData.venueName,
        description: venueData.description,
        location: venueData.area, // API expects 'location' field
        footfall: parseInt(venueData.capacity),
        priceMin: parseInt(venueData.price),
        priceMax: parseInt(venueData.price), // Using same price for both min/max for now
        images: uploadedImageUrls,
        facilities: venueData.amenities
      };

      return await apiClient.postJson(API_BASE, apiData);
    } catch (error) {
      console.error('Error creating venue:', error);
      const userFriendlyMessage = getUserFriendlyError(error.message || error, 'general');
      throw new Error(userFriendlyMessage);
    }
  }

  async uploadImages(images) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      const userFriendlyMessage = getUserFriendlyError('Authentication required', 'general');
      throw new Error(userFriendlyMessage);
    }

    try {
      const toDataUrl = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Images = [];
      for (const img of images) {
        if (!img) continue;
        if (typeof img === 'string' && img.startsWith('data:image/')) {
          base64Images.push(img);
        } else if (img.preview && typeof img.preview === 'string' && img.preview.startsWith('data:image/')) {
          base64Images.push(img.preview);
        } else if (img.file instanceof Blob) {
          const dataUrl = await toDataUrl(img.file);
          base64Images.push(dataUrl);
        } else if (img instanceof Blob) {
          const dataUrl = await toDataUrl(img);
          base64Images.push(dataUrl);
        }
      }

      if (base64Images.length === 0) {
        return [];
      }

      if (base64Images.length === 1) {
        const data = await apiClient.postJson('/api/upload/image', {
          imageData: base64Images[0],
          folder: 'Planzia/venues'
        });

        if (!data || !data.url) {
          const originalError = (data && (data.error || data.message)) || 'Failed to upload image';
          const userFriendlyMessage = getUserFriendlyError(originalError, 'general');
          throw new Error(userFriendlyMessage);
        }

        return [data.url];
      }

      const data = await apiClient.postJson('/api/upload/images', {
        images: base64Images,
        folder: 'Planzia/venues'
      });

      if (!data || !Array.isArray(data.images)) {
        const originalError = (data && (data.error || data.message)) || 'Failed to upload images';
        const userFriendlyMessage = getUserFriendlyError(originalError, 'general');
        throw new Error(userFriendlyMessage);
      }

      return data.images.map((i) => i.url).filter(Boolean);
    } catch (error) {
      console.error('Error uploading image:', error);
      const userFriendlyMessage = getUserFriendlyError(error.message || error, 'general');
      throw new Error(userFriendlyMessage);
    }
  }

  async getVenues(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Pagination parameters
      if (filters.page) {
        queryParams.append('page', filters.page);
      }

      if (filters.limit) {
        queryParams.append('limit', filters.limit);
      }

      // Search and filter parameters
      if (filters.location) {
        queryParams.append('location', filters.location);
      }

      if (filters.type) {
        queryParams.append('type', filters.type);
      }

      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      // Legacy support for offset-based pagination
      if (filters.offset && !filters.page) {
        queryParams.append('offset', filters.offset);
      }

      const url = `${API_BASE}?${queryParams.toString()}`;
      const data = await apiClient.getJson(url);

      // Handle both old and new API response formats
      if (data && data.venues && data.pagination) {
        // New paginated response format
        return {
          venues: data.venues,
          pagination: data.pagination
        };
      } else if (data && Array.isArray(data)) {
        // Old response format (array of venues) - convert to new format for backward compatibility
        return {
          venues: data,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: data.length,
            limit: data.length,
            hasNextPage: false,
            hasPrevPage: false
          }
        };
      } else if (data && typeof data === 'object') {
        // If data exists but doesn't match expected format, return empty venues with default pagination
        return {
          venues: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            limit: 0,
            hasNextPage: false,
            hasPrevPage: false
          }
        };
      } else {
        // Unexpected format or null response
        throw new Error('Invalid API response: ' + (data === null ? 'null' : 'unexpected format'));
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      const userFriendlyMessage = getUserFriendlyError(error.message || error, 'general');
      throw new Error(userFriendlyMessage);
    }
  }

  async getVenueById(id) {
    try {
      return await apiClient.getJson(`${API_BASE}/${id}`);
    } catch (error) {
      console.error('Error fetching venue:', error);
      const userFriendlyMessage = getUserFriendlyError(error.message || error, 'general');
      throw new Error(userFriendlyMessage);
    }
  }

  async getMyVenues() {
    try {
      return await apiClient.getJson(`${API_BASE}/owner/my-venues`);
    } catch (error) {
      console.error('Error fetching my venues:', error);
      const userFriendlyMessage = getUserFriendlyError(error.message || error, 'general');
      throw new Error(userFriendlyMessage);
    }
  }

  async updateVenue(id, venueData, images) {
    try {
      // Upload new images if any
      let uploadedImageUrls = [];
      if (images.length > 0) {
        uploadedImageUrls = await this.uploadImages(images);
      }

      // Prepare venue data for API
      const apiData = {
        venueName: venueData.venueName,
        description: venueData.description,
        location: venueData.area,
        footfall: parseInt(venueData.capacity),
        priceMin: parseInt(venueData.price),
        priceMax: parseInt(venueData.price),
        images: uploadedImageUrls,
        facilities: venueData.amenities
      };

      return await apiClient.putJson(`${API_BASE}/${id}`, apiData);
    } catch (error) {
      console.error('Error updating venue:', error);
      const userFriendlyMessage = getUserFriendlyError(error.message || error, 'general');
      throw new Error(userFriendlyMessage);
    }
  }

  async deleteVenue(id) {
    try {
      await apiClient.deleteJson(`${API_BASE}/${id}`);
      return { message: 'Venue deleted successfully' };
    } catch (error) {
      console.error('Error deleting venue:', error);
      const userFriendlyMessage = getUserFriendlyError(error.message || error, 'general');
      throw new Error(userFriendlyMessage);
    }
  }

  async toggleVenueActive(id) {
    try {
      return await apiClient.putJson(`${API_BASE}/${id}/toggle-active`, {});
    } catch (error) {
      console.error('Error toggling venue active status:', error);
      const userFriendlyMessage = getUserFriendlyError(error.message || error, 'general');
      throw new Error(userFriendlyMessage);
    }
  }

  async getFilterOptions() {
    try {
      // Use apiClient so production honors VITE_BACKEND_URL and dev uses same-origin proxy
      const data = await apiClient.getJson(`${API_BASE}/filter-options`);

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid filter options response');
      }

      return {
        venueTypes: data.venueTypes || [],
        locations: data.locations || [],
        priceRange: data.priceRange || { min: 0, max: 500000 },
        capacityRange: data.capacityRange || { min: 0, max: 5000 }
      };
    } catch (error) {
      console.error('Error fetching filter options:', error);
      const userFriendlyMessage = getUserFriendlyError(error.message || error, 'general');
      throw new Error(userFriendlyMessage);
    }
  }
}

export default new VenueService();
