import React, { useState } from 'react';

// --------------------------------------------------------
// 1. Tax Configuration Modal (Dynamic Split)
// --------------------------------------------------------
export const TaxSettingsEditor = ({ initialData, onSave, onCancel }) => {
  const [workerType, setWorkerType] = useState(initialData?.workerType || 'W2');
  const [fedTax, setFedTax] = useState(initialData?.fedTax || 10);
  const [stateTax, setStateTax] = useState(initialData?.stateTax || 0);

  // W-2 splits the tax. 1099 pays the full burden.
  const employeeBase = workerType === 'W2' ? 7.65 : 15.30;
  const employerBase = workerType === 'W2' ? 7.65 : 0;

  const handleSave = () => {
    onSave({ workerType, employeeBase, employerBase, fedTax, stateTax });
  };

  return (
    <div className="tax-editor-modal border border-gray-600 rounded-lg p-4 bg-gray-900 text-white shadow-lg">
      <h3 className="text-lg font-bold mb-3 text-blue-400">Tax Withholding Editor</h3>
      
      <div className="mb-4">
        <label className="block text-sm mb-1 text-gray-300">Worker Classification</label>
        <select 
          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          value={workerType} 
          onChange={(e) => setWorkerType(e.target.value)}
        >
          <option value="W2">W-2 Employee (7.65% Split Match)</option>
          <option value="1099">1099 Contractor (15.30% Full Burden)</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1 text-gray-300">Federal Tax (%)</label>
          <input 
            type="number" 
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
            value={fedTax} 
            onChange={(e) => setFedTax(Number(e.target.value))} 
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-300">State Tax (%)</label>
          <input 
            type="number" 
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
            value={stateTax} 
            onChange={(e) => setStateTax(Number(e.target.value))} 
          />
        </div>
      </div>

      <div className="bg-black p-3 rounded border border-gray-700 mb-4 text-sm">
        <p className="text-gray-400 mb-1">Payroll Tax Baseline Preview:</p>
        <p className="text-red-400">Employee Deducts: <span className="font-bold">{employeeBase}%</span></p>
        {workerType === 'W2' && (
          <p className="text-orange-400">Employer Matches: <span className="font-bold">{employerBase}%</span></p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-5">
        <button 
          className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded transition-colors" 
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors font-bold" 
          onClick={handleSave}
        >
          Save Rates
        </button>
      </div>
    </div>
  );
};
