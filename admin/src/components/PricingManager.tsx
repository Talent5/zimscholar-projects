import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, Plus, Edit, Trash2, Eye, EyeOff, Star, DollarSign, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import PricingModal from './PricingModal';
import { fetchPricingPackages, deletePricingPackage, patchPricingPackage } from '../utils/api';

interface PricingPackage {
  _id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended: boolean;
  isActive: boolean;
  order: number;
}

const PricingManager: React.FC = () => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPricingPackages();
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching pricing packages:', error);
      setError('Failed to load pricing packages. Please try again.');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing package?')) return;
    
    try {
      await deletePricingPackage(id);
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Failed to delete package. Please try again.');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await patchPricingPackage(id, { isActive: !isActive });
      fetchPackages();
    } catch (error) {
      console.error('Error toggling package:', error);
      alert('Failed to update package status. Please try again.');
    }
  };

  const toggleRecommended = async (id: string, recommended: boolean) => {
    try {
      if (!recommended) {
        // If we are setting this to recommended, we might want to unset others visually or handle it in backend
        // For now just toggle
      }
      await patchPricingPackage(id, { recommended: !recommended });
      fetchPackages();
    } catch (error) {
      console.error('Error toggling recommended:', error);
      alert('Failed to update recommended status. Please try again.');
    }
  };

  const handleEdit = (pkg: PricingPackage) => {
    setEditingPackage(pkg);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPackage(null);
    setModalOpen(true);
  };

  const filteredPackages = Array.isArray(packages) ? packages.filter(pkg => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pricing Packages</h1>
          <p className="mt-1 text-slate-500">Manage your subscription plans and feature sets.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          <Plus size={18} />
          Create New Package
        </button>
      </div>

      {/* Controls Section */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          />
        </div>
        <button 
          onClick={fetchPackages}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-200"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPackages.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Package size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No packages found</h3>
            <p className="text-slate-500 mt-1 mb-6 text-center max-w-sm">
              Get started by creating your first pricing package.
            </p>
            <button 
              onClick={handleAdd}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <Plus size={18} />
              Add Package
            </button>
          </div>
        ) : (
          filteredPackages.map((pkg) => (
            <div 
              key={pkg._id} 
              className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 flex flex-col relative overflow-hidden group
                ${pkg.recommended 
                  ? 'border-blue-200 ring-2 ring-blue-500/20 shadow-blue-900/5' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xl'
                }
                ${!pkg.isActive ? 'opacity-75 grayscale-[0.5]' : ''}
              `}
            >
              {/* Card Header Background Pattern */}
              <div className={`absolute top-0 inset-x-0 h-2 ${pkg.recommended ? 'bg-blue-500' : 'bg-slate-200 group-hover:bg-slate-300'}`}></div>

              <div className="p-6 pb-4 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {pkg.recommended && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-2">
                        <Star size={12} fill="currentColor" />
                        Recommended
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{pkg.name}</h3>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    pkg.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-sm text-slate-500 font-medium">$</span>
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{pkg.price}</span>
                </div>
                
                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">
                  {pkg.description}
                </p>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">What's Included</h4>
                  <ul className="space-y-3">
                    {pkg.features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${pkg.recommended ? 'text-blue-500' : 'text-slate-400'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {pkg.features.length > 5 && (
                      <li className="text-xs text-slate-400 font-medium pl-7">
                        +{pkg.features.length - 5} more features
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 border border-transparent transition-colors shadow-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

                <div className="col-span-2 flex items-center justify-between pt-2 px-2">
                   <button
                    onClick={() => toggleActive(pkg._id, pkg.isActive)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
                    title={pkg.isActive ? "Deactivate Package" : "Activate Package"}
                  >
                    {pkg.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                    {pkg.isActive ? 'Visible' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => toggleRecommended(pkg._id, pkg.recommended)}
                    className={`text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      pkg.recommended ? 'text-blue-600 hover:text-blue-700' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Toggle Recommended"
                  >
                    <Star size={14} fill={pkg.recommended ? "currentColor" : "none"} />
                    {pkg.recommended ? 'Featured' : 'Feature'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <PricingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        package={editingPackage as any}
        onSave={() => {
          fetchPackages();
        }}
      />
    </div>
  );
};

export default PricingManager;
