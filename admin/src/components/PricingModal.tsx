import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { apiRequest } from '../../../config/api.config';

interface PricingPackage {
  _id?: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended: boolean;
  isActive: boolean;
  order: number;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: PricingPackage | null;
  onSave: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, package: pkg, onSave }) => {
  const [formData, setFormData] = useState<PricingPackage>({
    name: '',
    price: '',
    description: '',
    features: [''],
    recommended: false,
    isActive: true,
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pkg) {
      setFormData(pkg);
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        features: [''],
        recommended: false,
        isActive: true,
        order: 0
      });
    }
  }, [pkg, isOpen]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price.trim() || !formData.description.trim()) {
      setError('Name, price, and description are required');
      return;
    }

    const validFeatures = formData.features.filter(f => f.trim() !== '');
    if (validFeatures.length === 0) {
      setError('At least one feature is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dataToSend = {
        ...formData,
        features: validFeatures
      };

      const url = pkg
        ? `/api/admin/pricing/${pkg._id}`
        : '/api/admin/pricing';
      
      const method = pkg ? 'PUT' : 'POST';

      const response = await apiRequest(url, {
        method,
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) throw new Error('Failed to save pricing package');

      onSave();
      onClose();
    } catch (err) {
      setError('Failed to save pricing package. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 1000 }}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${pkg ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {pkg ? <Sparkles size={20} /> : <Plus size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {pkg ? 'Edit Pricing Package' : 'Create New Package'}
              </h2>
              <p className="text-sm text-slate-500">
                {pkg ? 'Modify existing package details' : 'Add a new pricing tier to your offerings'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="pricing-form" onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                <div className="mt-0.5"><X size={16} /></div>
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Package Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. Pro Plan"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <span className="font-bold">$</span>
                  </div>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="99.00"
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description <span className="text-red-500">*</span></label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Briefly describe what this package offers..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Features List</label>
                <button 
                  type="button" 
                  onClick={addFeature}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Add Feature
                </button>
              </div>
              
              <div className="space-y-2 bg-slate-50 rounded-xl p-4 border border-slate-100">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 group">
                    <div className="flex-1 relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500">
                        <Check size={14} />
                      </div>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="e.g. Unlimited Projects"
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm bg-white"
                      />
                    </div>
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove feature"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all flex-1">
                <input
                  type="checkbox"
                  checked={formData.recommended}
                  onChange={(e) => handleChange('recommended', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold text-slate-900 text-sm">Recommended Package</div>
                  <div className="text-xs text-slate-500">Highlight this for better visibility</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all flex-1">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold text-slate-900 text-sm">Active Status</div>
                  <div className="text-xs text-slate-500">Publicly visible to users</div>
                </div>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="pricing-form"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Package
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
