'use client'

import { useState } from 'react';
import { FileText, RefreshCw, Save, Edit, Eye, EyeOff, Calendar } from 'lucide-react';

interface LegalContent {
  postId: string;
  title?: string;
  content: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LegalContentManagementProps {
  legalContent: LegalContent[];
  loading: boolean;
  onRefresh: () => void;
  onUpdateContent: (postId: string, content: string, title?: string) => Promise<any>;
  onCreateContent: (legalData: { title: string; content: string }) => Promise<any>;
}

export default function LegalContentManagement({
  legalContent,
  loading,
  onRefresh,
  onUpdateContent,
  onCreateContent
}: LegalContentManagementProps) {
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [updatingContent, setUpdatingContent] = useState(false);
  const [creatingContent, setCreatingContent] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [previewMode, setPreviewMode] = useState<{ [key: string]: boolean }>({});
  
  const [editContentData, setEditContentData] = useState({
    title: '',
    content: ''
  });

  const [newContentData, setNewContentData] = useState({
    title: '',
    content: '',
  });

  const handleEditClick = (content: LegalContent) => {
    setEditingContent(content.postId);
    setEditContentData({
      title: content.title || '',
      content: content.content
    });
  };

  const handleUpdateContent = async (postId: string) => {
    if (!editContentData.content.trim()) {
      return;
    }

    try {
      setUpdatingContent(true);
      await onUpdateContent(postId, editContentData.content, editContentData.title.trim() || undefined);
      setEditingContent(null);
    } catch (error) {
      console.error('Error updating content:', error);
    } finally {
      setUpdatingContent(false);
    }
  };

  const handleCreateContent = async () => {
    if (!newContentData.content.trim()) {
      return;
    }

    try {
      setCreatingContent(true);
      await onCreateContent(
        {
          title: newContentData.title,
          content: newContentData.content
        }
      );
      setShowCreateForm(false);
      setNewContentData({ title: '', content: ''});
    } catch (error) {
      console.error('Error creating content:', error);
    } finally {
      setCreatingContent(false);
    }
  };

  const cancelCreate = () => {
    setShowCreateForm(false);
    setNewContentData({ title: '', content: '', });
  };

  const cancelEdit = () => {
    setEditingContent(null);
    setEditContentData({ title: '', content: '' });
  };

  const togglePreview = (postId: string) => {
    setPreviewMode(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const getContentTypeLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'privacy':
        return 'Politique de confidentialité';
      case 'terms':
        return 'Conditions d\'utilisation';
      case 'about':
        return 'À propos';
      case 'faq':
        return 'FAQ';
      default:
        return 'Document légal';
    }
  };

  const getContentTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'privacy':
        return 'bg-blue-100 text-blue-800';
      case 'terms':
        return 'bg-green-100 text-green-800';
      case 'about':
        return 'bg-purple-100 text-purple-800';
      case 'faq':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="h-8 w-8 mr-3 text-blue-600" />
            Gestion du contenu légal
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les documents légaux, politiques et conditions d'utilisation
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            Nouveau document
          </button>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total documents</p>
              <p className="text-2xl font-bold text-gray-900">{legalContent.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Edit className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Modifiés récemment</p>
              <p className="text-2xl font-bold text-gray-900">
                {legalContent.filter(content => {
                  if (!content.updatedAt) return false;
                  const updated = new Date(content.updatedAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return updated > weekAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dernière mise à jour</p>
              <p className="text-sm font-bold text-gray-900">
                {legalContent.length > 0 && legalContent.some(c => c.updatedAt)
                  ? new Date(Math.max(...legalContent
                      .filter(c => c.updatedAt)
                      .map(c => new Date(c.updatedAt!).getTime())
                    )).toLocaleDateString('fr-FR')
                  : 'Aucune'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Créer un nouveau document légal
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={handleCreateContent}
                  disabled={creatingContent || !newContentData.content.trim()}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {creatingContent ? 'Création...' : 'Créer le document'}
                </button>
                <button
                  onClick={cancelCreate}
                  disabled={creatingContent}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </div>

          
           

            {/* Title Input */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Titre du document (optionnel)
                </span>
              </label>
              <input
                type="text"
                value={newContentData.title}
                onChange={(e) => setNewContentData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Ex: Politique de confidentialité, Conditions d'utilisation..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Le titre sera affiché en haut du document
              </p>
            </div>

            {/* Content Input */}
            <div className="bg-white border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Contenu du document *
                </span>
              </label>
              <textarea
                value={newContentData.content}
                onChange={(e) => setNewContentData(prev => ({ ...prev, content: e.target.value }))}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-vertical"
                placeholder="Entrez le contenu du document légal..."
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  {newContentData.content.length} caractères
                </p>
                <p className="text-xs text-gray-500">
                  * Champ obligatoire
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Documents légaux ({legalContent.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Chargement du contenu...</span>
          </div>
        ) : legalContent.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun contenu légal trouvé</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {legalContent.map((content) => (
              <div key={content.postId} className="p-6">
                {editingContent === content.postId ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContentTypeColor(content.type)}`}>
                          {getContentTypeLabel(content.type)}
                        </span>
                        <span className="text-sm text-gray-500">ID: {content.postId}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateContent(content.postId)}
                          disabled={updatingContent}
                          className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          {updatingContent ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                    
                    {/* Title Input */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Titre du document (optionnel)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={editContentData.title}
                        onChange={(e) => setEditContentData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Ex: Politique de confidentialité, Conditions d'utilisation..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Le titre sera affiché en haut du document
                      </p>
                    </div>
                    
                    {/* Content Input */}
                    <div className="bg-white border rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center">
                          <Edit className="h-4 w-4 mr-1" />
                          Contenu du document *
                        </span>
                      </label>
                      <textarea
                        value={editContentData.content}
                        onChange={(e) => setEditContentData(prev => ({ ...prev, content: e.target.value }))}
                        rows={15}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-vertical"
                        placeholder="Entrez le contenu du document légal..."
                        required
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          {editContentData.content.length} caractères
                        </p>
                        <p className="text-xs text-gray-500">
                          * Champ obligatoire
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContentTypeColor(content.type)}`}>
                          {getContentTypeLabel(content.type)}
                        </span>
                        {content.title && (
                          <h4 className="text-lg font-semibold text-gray-900">{content.title}</h4>
                        )}
                        <span className="text-sm text-gray-500">ID: {content.postId}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => togglePreview(content.postId)}
                          className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                        >
                          {previewMode[content.postId] ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-1" />
                              Masquer
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-1" />
                              Aperçu
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleEditClick(content)}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 flex space-x-4">
                      {content.createdAt && (
                        <span>Créé le: {new Date(content.createdAt).toLocaleDateString('fr-FR')}</span>
                      )}
                      {content.updatedAt && (
                        <span>Modifié le: {new Date(content.updatedAt).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      {previewMode[content.postId] ? (
                        <div className="prose max-w-none">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            {content.title && (
                              <h3 className="text-lg font-semibold mb-3 text-gray-900">{content.title}</h3>
                            )}
                            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                              {content.content}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-600">
                          <p className="text-sm">
                            {truncateContent(content.content)}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {content.content.length} caractères au total
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}