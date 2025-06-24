'use client'

import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, FileText } from 'lucide-react';

interface LegalPage {
  postId: string;
  title: string;
  content: string;
  pageTitle: string;
  language: string; // Added language field
  createdAt: string;
  updatedAt: string;
}

interface LegalPagesManagementProps {
  legalPages: LegalPage[];
  loading: boolean;
  onRefresh: () => void;
  onCreatePage: (pageData: { title: string; content: string; type: string; language: string }) => Promise<any>;
  onUpdatePage: (id: string, pageData: { title: string; content: string; type: string; language: string }) => Promise<any>;
  onDeletePage: (id: string) => void;
}

const LegalPagesManagement = ({ 
  legalPages, 
  loading, 
  onRefresh, 
  onCreatePage, 
  onUpdatePage, 
  onDeletePage 
}: LegalPagesManagementProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<LegalPage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'terms-of-sale',
    language: 'fr' // Added language to form data
  });
  const [submitting, setSubmitting] = useState(false);

const legalPageTypes = [
  { value: 'terms-of-sale', label: 'Conditions générales de vente' },         
  { value: 'terms-of-use', label: 'Conditions générales d’utilisation' },     
  { value: 'privacy-policy', label: 'Politique de confidentialité' },  
  {value:'legal-notice', label:'Mentions légales'}       
];

const languages = [ // Fixed typo: was 'langauage'
  { value: 'fr', label: 'Français' },         
  { value: 'en', label: 'English' },    
];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      if (editingPage) {
        await onUpdatePage(editingPage.postId, formData);
      } else {
        await onCreatePage(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };



  const resetForm = () => {
    setFormData({ title: '', content: '', type: 'terms-of-sale', language: 'fr' });
    setShowForm(false);
    setEditingPage(null);
  };

  const handleEdit = (page: LegalPage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      content: page.content,
      type: page.pageTitle,
      language: page.language || 'fr' // Default to 'fr' if language is not set
    });
    setShowForm(true);
  };

  const getTypeLabel = (type: string) => {
    const typeObj = legalPageTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const getLanguageLabel = (language: string) => {
    const langObj = languages.find(l => l.value === language);
    return langObj ? langObj.label : language;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Pages Légales</h1>
          <p className="text-gray-600 mt-1">Gérez le contenu des pages légales de votre site</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvelle page
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editingPage ? 'Modifier la page légale' : 'Nouvelle page légale'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de page
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {legalPageTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la page
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Conditions générales d'utilisation"
                    
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu de la page
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Saisissez le contenu de votre page légale..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Vous pouvez utiliser du HTML basique pour la mise en forme.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {submitting ? 'Enregistrement...' : editingPage ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Legal Pages List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement des pages légales...</p>
          </div>
        ) : legalPages?.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune page légale</h3>
            <p className="text-gray-600 mb-4">Commencez par créer votre première page légale.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus className="h-4 w-4" />
              Créer une page
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Langue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {legalPages.map((page) => (
                  <tr key={page.postId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {page.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {page.content.length > 100 
                            ? `${page.content.substring(0, 100)}...` 
                            : page.content
                          }
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getTypeLabel(page.pageTitle)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {getLanguageLabel(page.language || 'fr')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(page)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeletePage(page.postId)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalPagesManagement;