// app/dashboard/clientes/pipc-bc/[projectId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Loader2, Save, Check } from 'lucide-react';
import { getPIPCProject, generateAndDownloadPDF, addLegalFramework, addResourceInventory, addSignageList, addDrillRecord } from '../actions';
import CompanyInfoSection from './sections/CompanyInfo';
import OccupancySection from './sections/Occupancy';
import UIFCSection from './sections/UIPC';
import RisksSection from './sections/Risks';
import TrainingSection from './sections/Training';

export default function PIPCEditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    loadProject();
  }, []);

  async function loadProject() {
    try {
      const projectData = await getPIPCProject(projectId);
      setData(projectData);
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Error al cargar el proyecto');
    } finally {
      setLoading(false);
    }
  }

  async function handleGeneratePDF() {
    if (!confirm('¿Generar el PDF del PIPC? Se guardará y descargará automáticamente.')) {
      return;
    }

    setGenerating(true);
    try {
      const { pdfUrl } = await generateAndDownloadPDF(projectId);
      
      // Open PDF in new tab (browser will handle download)
      window.open(pdfUrl, '_blank');

      alert('PDF generado exitosamente');
      await loadProject(); // Reload to show updated status
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Revisa que todos los campos estén completos.');
    } finally {
      setGenerating(false);
    }
  }

  function showSaveIndicator() {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  }

  async function handleDataChange() {
    showSaveIndicator();
    await loadProject(); // Reload to show new items
  }

  async function handleLegalFramework() {
    try {
      await addLegalFramework(projectId);
      showSaveIndicator();
      await loadProject();
    } catch (error) {
      console.error('Error adding legal framework:', error);
    }
  }

  async function handleInventory() {
    try {
      await addResourceInventory(projectId);
      showSaveIndicator();
      await loadProject();
    } catch (error) {
      console.error('Error adding inventory:', error);
    }
  }

  async function handleSignage() {
    try {
      await addSignageList(projectId);
      showSaveIndicator();
      await loadProject();
    } catch (error) {
      console.error('Error adding signage:', error);
    }
  }

  async function handleSimulacro() {
    try {
      await addDrillRecord(projectId);
      showSaveIndicator();
      await loadProject();
    } catch (error) {
      console.error('Error adding drill record:', error);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando editor...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">No se pudo cargar el proyecto</p>
          <button
            onClick={() => router.push('/dashboard/clientes/pipc-bc')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/clientes/pipc-bc')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {data.project.pipc_clients.razon_social}
                </h1>
                <p className="text-sm text-gray-600">
                  RFC: {data.project.pipc_clients.rfc || 'No especificado'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Save Status Indicator */}
              {saveStatus !== 'idle' && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {saveStatus === 'saving' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check size={16} className="text-green-600" />
                      Guardado
                    </>
                  )}
                </div>
              )}

              {/* Status Badge */}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                data.project.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                data.project.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {data.project.status === 'draft' ? 'Borrador' :
                 data.project.status === 'ready' ? 'Listo' : 'Generado'}
              </span>

              {/* Generate PDF Button */}
              <button
                onClick={handleGeneratePDF}
                disabled={generating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {generating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Generar PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="space-y-6">
          {/* Company Info */}
          <CompanyInfoSection
            projectId={projectId}
            data={data.company_info}
            onSave={showSaveIndicator}
          />

          {/* Occupancy */}
          <OccupancySection
            projectId={projectId}
            data={data.occupancy}
            onSave={showSaveIndicator}
          />

          {/* UIPC */}
          <UIFCSection
            projectId={projectId}
            data={data.uipc}
            onSave={showSaveIndicator}
          />

          {/* Risks */}
          <RisksSection
            projectId={projectId}
            risks={data.risks}
            onSave={handleDataChange}
          />

          {/* Training */}
          <TrainingSection
            projectId={projectId}
            training={data.training}
            onSave={handleDataChange}
          />

          {/* PDF Preview Info */}
          {data.file?.pdf_url && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-2">PDF Generado</h3>
              <p className="text-sm text-green-700 mb-4">
                Última generación: {new Date(data.file.generated_at).toLocaleString('es-MX')}
              </p>
              <a
                href={data.file.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={16} />
                Ver PDF anterior
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}