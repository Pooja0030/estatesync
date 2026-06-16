import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Edit, Trash2, Plus, MapPin, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';

export default function PropertiesTab() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', description: '', price: '', type: '', lat: '', lng: '', region: null, 
    imageUrls: ['', '', '', '', ''] 
  });
  const [regions, setRegions] = useState([]);
  const [mapVisible, setMapVisible] = useState({});
  const [galleryModalImages, setGalleryModalImages] = useState(null);
  const [galleryModalIndex, setGalleryModalIndex] = useState(0);

  const toggleMap = (id) => {
    setMapVisible(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openGallery = (images) => {
    if (images && images.length > 0) {
      setGalleryModalImages(images);
      setGalleryModalIndex(0);
    }
  };

  const closeGallery = () => {
    setGalleryModalImages(null);
  };

  const nextImage = () => setGalleryModalIndex((prev) => (prev + 1) % galleryModalImages.length);
  const prevImage = () => setGalleryModalIndex((prev) => (prev - 1 + galleryModalImages.length) % galleryModalImages.length);

  useEffect(() => {
    fetchProperties();
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const res = await api.get('/admin/regions');
      setRegions(res.data);
    } catch (err) {
      console.error("Failed to fetch regions", err);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await api.get('/admin/properties');
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        imageUrls: formData.imageUrls.filter(url => url && url.trim() !== '')
      };
      
      if (editingId) {
        await api.put(`/admin/properties/${editingId}`, payload);
      } else {
        await api.post('/admin/properties', payload);
      }
      setShowModal(false);
      fetchProperties();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await api.delete(`/admin/properties/${id}`);
        fetchProperties();
      } catch (err) {
        alert("Failed to delete property. It might have associated leads.");
      }
    }
  };

  const openModal = (prop = null) => {
    if (prop) {
      setEditingId(prop.id);
      setFormData({
        ...prop,
        imageUrls: [
          prop.imageUrls?.[0] || '',
          prop.imageUrls?.[1] || '',
          prop.imageUrls?.[2] || '',
          prop.imageUrls?.[3] || '',
          prop.imageUrls?.[4] || ''
        ]
      });
    } else {
      setEditingId(null);
      setFormData({ 
        title: '', description: '', price: '', type: '', lat: '', lng: '', region: null, 
        imageUrls: ['', '', '', '', ''] 
      });
    }
    setShowModal(true);
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...formData.imageUrls];
    newUrls[index] = value;
    setFormData({ ...formData, imageUrls: newUrls });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900">Manage Properties</h2>
        <button onClick={() => openModal()} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition">
          <Plus size={16} className="mr-2" /> Add Property
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading properties...</div>
      ) : (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-gray-50">
          {properties.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-200 flex flex-col">
              
              <div className="h-48 w-full bg-gray-200 relative shrink-0">
                {p.imageUrls && p.imageUrls.length > 0 ? (
                  <img src={p.imageUrls[0]} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm font-medium">No Image Provided</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-gray-50 flex items-center justify-between border-b border-gray-100 px-5">
                <button onClick={() => toggleMap(p.id)} className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition">
                  <MapPin size={16} className="mr-1" />
                  {mapVisible[p.id] ? 'Hide Map' : 'View Map'}
                </button>
                {p.imageUrls && p.imageUrls.length > 1 && (
                  <button onClick={() => openGallery(p.imageUrls)} className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition">
                    <ImageIcon size={16} className="mr-1" />
                    View Gallery
                  </button>
                )}
              </div>

              {mapVisible[p.id] && p.lat && p.lng && (
                <div className="h-48 w-full bg-gray-200 relative shrink-0 border-b border-gray-200">
                  <iframe 
                    title={`map-${p.id}`}
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    src={`https://maps.google.com/maps?q=${p.lat},${p.lng}&hl=en&z=14&output=embed`}
                    className="block"
                  ></iframe>
                </div>
              )}

              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 pr-2" title={p.title}>{p.title}</h3>
                  <div className="flex space-x-2 shrink-0">
                    <button onClick={() => openModal(p)} className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-1.5 rounded transition"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-1.5 rounded transition"><Trash2 size={16}/></button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10" title={p.description}>
                  {p.description || <span className="italic text-gray-400">No description provided.</span>}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {p.type}
                  </span>
                  <span className="text-xl font-extrabold text-gray-900">₹{p.price?.toLocaleString() || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4 mt-2">
                  <span className="flex items-center font-medium">
                    <MapPin size={16} className="mr-1.5 text-gray-400" />
                    {p.region?.name || 'Unassigned Region'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-lg font-medium text-gray-900 mb-1">No properties found</p>
              <p>Click "Add Property" to create your first listing.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Property' : 'Add Property'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input type="text" placeholder="Title" required className="w-full border rounded p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full border rounded p-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <input type="number" placeholder="Price (₹)" required className="w-full border rounded p-2" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <div className="flex space-x-4">
                <select className="w-full border rounded p-2" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="">Select Type</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <select className="w-full border rounded p-2" value={formData.region?.id || ''} onChange={e => setFormData({...formData, region: { id: e.target.value }})}>
                  <option value="">Select Region</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className="flex space-x-4">
                <input type="text" placeholder="Latitude" className="w-full border rounded p-2" value={formData.lat || ''} onChange={e => setFormData({...formData, lat: e.target.value})} />
                <input type="text" placeholder="Longitude" className="w-full border rounded p-2" value={formData.lng || ''} onChange={e => setFormData({...formData, lng: e.target.value})} />
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Images (Up to 5 URLs)</label>
                <div className="space-y-2">
                  {[0, 1, 2, 3, 4].map(idx => (
                    <input 
                      key={idx}
                      type="url" 
                      placeholder={`Image URL ${idx + 1}`} 
                      className="w-full border rounded p-2 text-sm" 
                      value={formData.imageUrls[idx]} 
                      onChange={e => handleImageUrlChange(idx, e.target.value)} 
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {galleryModalImages && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4 sm:p-8 backdrop-blur-sm">
          <button onClick={closeGallery} className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full w-12 h-12 flex items-center justify-center z-10 transition text-2xl">
            &#x2715;
          </button>
          
          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center bg-black bg-opacity-50 rounded-2xl p-4 shadow-2xl overflow-hidden">
            {galleryModalImages.length > 1 && (
              <button onClick={prevImage} className="absolute left-4 bg-black bg-opacity-60 hover:bg-opacity-90 text-white w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full transition z-20 backdrop-blur-md text-2xl sm:text-3xl pb-1 shadow-lg">
                &#x276E;
              </button>
            )}
            
            <img 
              src={galleryModalImages[galleryModalIndex]} 
              alt={`Gallery Image ${galleryModalIndex + 1}`} 
              className="w-full h-full object-contain animate-fade-in"
            />

            {galleryModalImages.length > 1 && (
              <button onClick={nextImage} className="absolute right-4 bg-black bg-opacity-60 hover:bg-opacity-90 text-white w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full transition z-20 backdrop-blur-md text-2xl sm:text-3xl pb-1 shadow-lg">
                &#x276F;
              </button>
            )}
            
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-bold tracking-widest">
              {galleryModalIndex + 1} / {galleryModalImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
