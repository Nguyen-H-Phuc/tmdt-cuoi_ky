import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Inbox } from 'lucide-react';

const AdminTable = ({
  columns = [],
  data = [],
  isLoading = false,
  pagination = null, // { currentPage, totalPages, onPageChange }
  search = null, // { placeholder, value, onChange }
  filters = [], // [{ key, label, options: [{ value, label }], value, onChange }]
  onSort = null, // (key, direction) => void
  currentSort = null // { key, direction: 'asc' | 'desc' }
}) => {
  const [localSearch, setLocalSearch] = useState(search?.value || '');

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
    if (search?.onChange) {
      search.onChange(e.target.value);
    }
  };

  const handleSortClick = (key) => {
    if (!onSort) return;
    let direction = 'asc';
    if (currentSort?.key === key && currentSort?.direction === 'asc') {
      direction = 'desc';
    }
    onSort(key, direction);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      
      {/* Table Toolbar: Search & Filters */}
      {(search || filters.length > 0) && (
        <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/40">
          
          {/* Search Box */}
          {search && (
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder={search.placeholder || 'Tìm kiếm...'}
                value={localSearch}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white rounded-xl focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all text-gray-800 placeholder-gray-400 shadow-2xs"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 shrink-0" size={14} />
            </div>
          )}

          {/* Filters List */}
          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center gap-1.5 w-full sm:w-auto">
                  {filter.label && (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:inline">
                      {filter.label}:
                    </span>
                  )}
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="w-full sm:w-auto min-w-[130px] bg-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-accent text-gray-700 cursor-pointer shadow-2xs"
                  >
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Table Viewport */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSortClick(col.key)}
                  className={`px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider select-none ${
                    col.sortable ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-800 transition-colors' : ''
                  } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                >
                  <div className={`flex items-center gap-1.5 ${
                    col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''
                  }`}>
                    <span>{col.label}</span>
                    {col.sortable && (
                      <div className="flex flex-col shrink-0">
                        <ChevronUp 
                          size={10} 
                          className={`-mb-0.5 ${
                            currentSort?.key === col.key && currentSort?.direction === 'asc' 
                              ? 'text-brand-accent' 
                              : 'text-gray-300'
                          }`} 
                        />
                        <ChevronDown 
                          size={10} 
                          className={`-mt-0.5 ${
                            currentSort?.key === col.key && currentSort?.direction === 'desc' 
                              ? 'text-brand-accent' 
                              : 'text-gray-300'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, rIndex) => (
                <tr key={rIndex} className="animate-pulse">
                  {columns.map((col, cIndex) => (
                    <td key={cIndex} className="px-6 py-4">
                      <div className={`h-4 bg-gray-100 rounded-md ${
                        cIndex === 0 ? 'w-2/3' : 'w-1/2'
                      }`}></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="max-w-xs mx-auto flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                      <Inbox size={22} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-700">Không tìm thấy dữ liệu</h4>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                        Hệ thống không ghi nhận bản ghi nào khớp với điều kiện lọc hiện tại.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              // Real Data Rows
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col) => {
                    const value = row[col.key];
                    return (
                      <td 
                        key={col.key} 
                        className={`px-6 py-4.5 text-xs text-gray-700 font-medium ${
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                        }`}
                      >
                        {col.render ? col.render(row, rowIndex) : (value ?? '-')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/20">
          <div className="text-[11px] text-gray-450 font-semibold">
            Trang <span className="text-gray-800 font-bold">{pagination.currentPage}</span> trên{' '}
            <span className="text-gray-800 font-bold">{pagination.totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-1.5 border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, idx) => idx + 1)
              .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.currentPage) <= 1)
              .map((page, index, array) => {
                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && <span className="text-gray-300 text-xs px-1">...</span>}
                    <button
                      onClick={() => pagination.onPageChange(page)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        pagination.currentPage === page
                          ? 'bg-brand-primary text-gray-950 shadow-2xs font-extrabold'
                          : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-850'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-1.5 border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-850 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTable;
