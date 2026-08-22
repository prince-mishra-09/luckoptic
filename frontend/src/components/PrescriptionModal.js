'use client';
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function PrescriptionModal({ isOpen, onClose, onSubmit, product }) {
  const [lensType, setLensType] = useState('Single Vision');
  const [pupilDistance, setPupilDistance] = useState('63');
  
  const [leftEye, setLeftEye] = useState({ sphere: '0.00', cylinder: '0.00', axis: '', add: '' });
  const [rightEye, setRightEye] = useState({ sphere: '0.00', cylinder: '0.00', axis: '', add: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const prescriptionData = {
      lensType,
      pupilDistance,
      leftEye,
      rightEye
    };
    onSubmit(prescriptionData);
    onClose();
  };

  const sphereOptions = ['0.00', '-0.25', '-0.50', '-0.75', '-1.00', '-1.25', '-1.50', '-1.75', '-2.00', '-2.25', '-2.50', '-2.75', '-3.00', '-3.25', '-3.50', '-3.75', '-4.00', '+0.25', '+0.50', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00'];
  const cylinderOptions = ['0.00', '-0.25', '-0.50', '-0.75', '-1.00', '-1.25', '-1.50', '-1.75', '-2.00', '+0.25', '+0.50', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-luckoptics-dark text-white p-5 flex justify-between items-center">
          <div>
            <h3 className="font-display font-bold text-lg">Add Lens & Prescription</h3>
            <p className="text-xs text-gray-300 font-medium">For: {product?.name}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Select Lens Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">1. Select Lens Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Zero Power', desc: 'Anti-Glare / Screen Protect', price: 'Free' },
                { name: 'Single Vision', desc: 'Distance or Reading power', price: '₹500' },
                { name: 'Bifocal/Progressive', desc: 'Dual power prescription', price: '₹1000' }
              ].map((type) => (
                <div
                  key={type.name}
                  onClick={() => setLensType(type.name)}
                  className={`border p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                    lensType === type.name
                      ? 'border-luckoptics-primary bg-luckoptics-primary/5 ring-1 ring-luckoptics-primary'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-display font-bold text-sm text-luckoptics-dark leading-tight">{type.name}</span>
                    {lensType === type.name && (
                      <span className="p-0.5 bg-luckoptics-primary text-white rounded-full">
                        <Check size={10} />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{type.desc}</p>
                  <span className="text-xs font-bold text-luckoptics-primary">{type.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Prescription Powers (Conditional) */}
          {lensType !== 'Zero Power' && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">2. Enter Prescription Details</label>
              
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
                      <th className="p-3">Eye</th>
                      <th className="p-3">Sphere (SPH)</th>
                      <th className="p-3">Cylinder (CYL)</th>
                      <th className="p-3">Axis (AX)</th>
                      {lensType === 'Bifocal/Progressive' && <th className="p-3">Add</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Right Eye */}
                    <tr>
                      <td className="p-3 font-semibold text-gray-800">Right (OD)</td>
                      <td className="p-3">
                        <select
                          className="bg-gray-50 border border-gray-200 rounded-md p-1.5 w-full focus:outline-hidden"
                          value={rightEye.sphere}
                          onChange={(e) => setRightEye({ ...rightEye, sphere: e.target.value })}
                        >
                          {sphereOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </td>
                      <td className="p-3">
                        <select
                          className="bg-gray-50 border border-gray-200 rounded-md p-1.5 w-full focus:outline-hidden"
                          value={rightEye.cylinder}
                          onChange={(e) => setRightEye({ ...rightEye, cylinder: e.target.value })}
                        >
                          {cylinderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          placeholder="0-180"
                          min="0"
                          max="180"
                          className="bg-gray-50 border border-gray-200 rounded-md p-1.5 w-full focus:outline-hidden"
                          value={rightEye.axis}
                          onChange={(e) => setRightEye({ ...rightEye, axis: e.target.value })}
                          required={rightEye.cylinder !== '0.00'}
                        />
                      </td>
                      {lensType === 'Bifocal/Progressive' && (
                        <td className="p-3">
                          <input
                            type="text"
                            placeholder="+1.50"
                            className="bg-gray-50 border border-gray-200 rounded-md p-1.5 w-full focus:outline-hidden"
                            value={rightEye.add}
                            onChange={(e) => setRightEye({ ...rightEye, add: e.target.value })}
                          />
                        </td>
                      )}
                    </tr>

                    {/* Left Eye */}
                    <tr>
                      <td className="p-3 font-semibold text-gray-800">Left (OS)</td>
                      <td className="p-3">
                        <select
                          className="bg-gray-50 border border-gray-200 rounded-md p-1.5 w-full focus:outline-hidden"
                          value={leftEye.sphere}
                          onChange={(e) => setLeftEye({ ...leftEye, sphere: e.target.value })}
                        >
                          {sphereOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </td>
                      <td className="p-3">
                        <select
                          className="bg-gray-50 border border-gray-200 rounded-md p-1.5 w-full focus:outline-hidden"
                          value={leftEye.cylinder}
                          onChange={(e) => setLeftEye({ ...leftEye, cylinder: e.target.value })}
                        >
                          {cylinderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          placeholder="0-180"
                          min="0"
                          max="180"
                          className="bg-gray-50 border border-gray-200 rounded-md p-1.5 w-full focus:outline-hidden"
                          value={leftEye.axis}
                          onChange={(e) => setLeftEye({ ...leftEye, axis: e.target.value })}
                          required={leftEye.cylinder !== '0.00'}
                        />
                      </td>
                      {lensType === 'Bifocal/Progressive' && (
                        <td className="p-3">
                          <input
                            type="text"
                            placeholder="+1.50"
                            className="bg-gray-50 border border-gray-200 rounded-md p-1.5 w-full focus:outline-hidden"
                            value={leftEye.add}
                            onChange={(e) => setLeftEye({ ...leftEye, add: e.target.value })}
                          />
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pupil Distance */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Pupil Distance (PD) mm</label>
                  <input
                    type="number"
                    min="50"
                    max="80"
                    className="bg-gray-50 border border-gray-200 rounded-md p-2 w-full focus:outline-hidden"
                    value={pupilDistance}
                    onChange={(e) => setPupilDistance(e.target.value)}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Average PD is 63mm. Enter if listed on prescription.</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold bg-luckoptics-primary text-white rounded-xl hover:bg-luckoptics-primary/95 transition-all shadow-md cursor-pointer"
            >
              Confirm and Add to Cart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
