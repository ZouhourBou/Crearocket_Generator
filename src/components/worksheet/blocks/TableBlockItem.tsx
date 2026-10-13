import React from 'react';
import { WorksheetBlock, TableRowData, TableCellData } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';
import { Plus, Trash2 } from 'lucide-react';

interface TableBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const TableBlockItem: React.FC<TableBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
}) => {
  const c = block.content;
  const isRtl = block.styles.textDirection === 'rtl' || block.styles.languageMode === 'ar';
  const defaultFont =
    block.styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');

  // Initial 3x3 table if not initialized
  const rows: TableRowData[] =
    c.tableRowsData && c.tableRowsData.length > 0
      ? c.tableRowsData
      : [
          {
            id: 'r_1',
            cells: [
              { id: 'c_1_1', text: isRtl ? '$x$' : '$x$', isHeader: true, align: 'center', backgroundColor: '#f8fafc' },
              { id: 'c_1_2', text: isRtl ? '$-2$' : '$-2$', isHeader: true, align: 'center', backgroundColor: '#f8fafc' },
              { id: 'c_1_3', text: isRtl ? '$0$' : '$0$', isHeader: true, align: 'center', backgroundColor: '#f8fafc' },
              { id: 'c_1_4', text: isRtl ? '$3$' : '$3$', isHeader: true, align: 'center', backgroundColor: '#f8fafc' },
            ],
          },
          {
            id: 'r_2',
            cells: [
              { id: 'c_2_1', text: isRtl ? '$f(x) = 2x + 1$' : '$f(x) = 2x + 1$', isHeader: true, align: 'center', backgroundColor: '#f8fafc' },
              { id: 'c_2_2', text: isRtl ? '$-3$' : '$-3$', align: 'center' },
              { id: 'c_2_3', text: isRtl ? '........' : '........', align: 'center' },
              { id: 'c_2_4', text: isRtl ? '........' : '........', align: 'center' },
            ],
          },
        ];

  const handleUpdateCell = (rIdx: number, cIdx: number, text: string) => {
    const nextRows = rows.map((r, i) => {
      if (i !== rIdx) return r;
      const nextCells = r.cells.map((cell, j) => {
        if (j !== cIdx) return cell;
        return { ...cell, text };
      });
      return { ...r, cells: nextCells };
    });
    onUpdateContent({ tableRowsData: nextRows });
  };

  const handleAddRow = () => {
    const colCount = rows[0]?.cells.length || 3;
    const newCells: TableCellData[] = Array.from({ length: colCount }).map((_, i) => ({
      id: `c_${Date.now()}_${i}`,
      text: '........',
      align: 'center',
    }));
    const newRow: TableRowData = {
      id: `r_${Date.now()}`,
      cells: newCells,
    };
    onUpdateContent({ tableRowsData: [...rows, newRow] });
  };

  const handleRemoveRow = (rIdx: number) => {
    if (rows.length <= 1) return;
    const nextRows = rows.filter((_, i) => i !== rIdx);
    onUpdateContent({ tableRowsData: nextRows });
  };

  const handleAddColumn = () => {
    const nextRows = rows.map((r, i) => {
      const newCell: TableCellData = {
        id: `c_${Date.now()}_${i}`,
        text: i === 0 ? 'Titre' : '........',
        isHeader: i === 0,
        align: 'center',
        backgroundColor: i === 0 ? '#f8fafc' : undefined,
      };
      return {
        ...r,
        cells: [...r.cells, newCell],
      };
    });
    onUpdateContent({ tableRowsData: nextRows });
  };

  const handleRemoveColumn = (cIdx: number) => {
    if ((rows[0]?.cells.length || 0) <= 1) return;
    const nextRows = rows.map((r) => ({
      ...r,
      cells: r.cells.filter((_, j) => j !== cIdx),
    }));
    onUpdateContent({ tableRowsData: nextRows });
  };

  const borderStyle = c.tableBorderStyle || 'all';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full flex flex-col gap-2 py-1 select-none text-slate-800"
      style={{ fontFamily: defaultFont }}
    >
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse border border-slate-400 bg-white shadow-2xs">
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={row.id} className="group/row">
                {row.cells.map((cell, cIdx) => (
                  <td
                    key={cell.id}
                    colSpan={cell.colSpan || 1}
                    rowSpan={cell.rowSpan || 1}
                    className={`p-2 relative border border-slate-300 min-h-[40px] ${
                      cell.isHeader
                        ? 'font-bold bg-slate-50/80 text-slate-800'
                        : 'font-normal bg-white'
                    }`}
                    style={{
                      textAlign: cell.align || 'center',
                      backgroundColor: cell.backgroundColor,
                      borderWidth: borderStyle === 'none' ? '0px' : '1px',
                    }}
                  >
                    <CoreRichTextField
                      value={cell.text}
                      onChange={(text) => handleUpdateCell(rIdx, cIdx, text)}
                      readOnly={readOnly}
                      isSelected={isSelected}
                      isRtl={isRtl}
                      singleLine
                      className={`text-xs ${cell.isHeader ? 'font-bold' : 'font-medium'}`}
                    />
                  </td>
                ))}

                {/* Delete row button on hover */}
                {!readOnly && isSelected && rows.length > 1 && (
                  <td className="w-6 border-none p-1 text-center opacity-0 group-hover/row:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(rIdx)}
                      title="Supprimer cette ligne"
                      className="text-slate-300 hover:text-rose-500 cursor-pointer p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toolbar to add Row or Column */}
      {!readOnly && isSelected && (
        <div className="flex items-center gap-3 pt-1 text-xs">
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إضافة سطر' : '+ Ligne'}</span>
          </button>
          <button
            type="button"
            onClick={handleAddColumn}
            className="flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إضافة عمود' : '+ Colonne'}</span>
          </button>
          {rows[0] && rows[0].cells.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveColumn(rows[0].cells.length - 1)}
              className="text-slate-400 hover:text-rose-600 text-[11px] font-medium transition-colors cursor-pointer"
            >
              {isRtl ? 'حذف آخر عمود' : '- Supprimer dernière colonne'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
