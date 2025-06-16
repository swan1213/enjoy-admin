'use client'

import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import baseUrl from '../baseurl';



interface LegalContent {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function PublicLegalPage() {
  const [legalContent, setLegalContent] = useState<LegalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLegalContent();
  }, []);

  const fetchLegalContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch legal content without authentication for public access
      const response = await fetch(`${baseUrl}/legal`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setLegalContent(data);
    } catch (err) {
      console.error('Error fetching legal content:', err);
      setError('Unable to load legal content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Chargement du contenu légal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchLegalContent}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo_enjoy.svg" 
              alt="Logo" 
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Informations légales</h1>
              <p className="text-gray-600 mt-1">Conditions d'utilisation et mentions légales</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {legalContent.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun contenu légal disponible</h3>
            <p className="text-gray-600">Le contenu légal sera bientôt disponible.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {legalContent.map((content) => (
              <article key={content.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      {content.title}
                    </h2>
                    {/* <span className="text-sm text-gray-500">
                      Mis à jour le {formatDate(content.updatedAt)}
                    </span> */}
                  </div>
                </div>
                
                <div className="px-6 py-6">
                  <div 
                    className="prose max-w-none text-gray-700 leading-relaxed"
                    style={{ 
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.7'
                    }}
                  >
                    {content.content}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © {new Date().getFullYear()} Enjoy. Tous droits réservés.
            </p>
            <p className="text-xs mt-2">
              Cette page contient les informations légales et conditions d'utilisation de nos services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}