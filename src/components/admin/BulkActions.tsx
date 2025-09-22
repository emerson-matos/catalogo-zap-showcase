import React from 'react';
import { Download, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  isBulkDeleting: boolean;
  onSelectAll: () => void;
  onExport: () => void;
  onBulkDelete: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = React.memo(({
  selectedCount,
  totalCount,
  isBulkDeleting,
  onSelectAll,
  onExport,
  onBulkDelete,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-blue-900">
          {selectedCount} produto(s) selecionado(s)
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
        >
          {selectedCount === totalCount ? 'Desmarcar Todos' : 'Selecionar Todos'}
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={selectedCount === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          disabled={selectedCount === 0 || isBulkDeleting}
        >
          {isBulkDeleting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          {isBulkDeleting ? 'Deletando...' : 'Deletar'}
        </Button>
      </div>
    </div>
  );
});