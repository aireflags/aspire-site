'use client'

import { useState } from 'react'

export default function OfferMakerPage() {
  const [formData, setFormData] = useState({
    mlsNumber: '',
    propertyAddress: '',
    buyerName: '',
    offerPrice: '',
    closingDate: '',
    loanAgent: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateOffer = () => {
    // TODO: Implement offer creation logic
    console.log('Creating offer with data:', formData)
  }

  return (
    <main className="flex-1 overflow-y-auto pb-20">
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">New Offer</h1>

        <div className="space-y-6">
          {/* Property Info Section */}
          <section className="space-y-4">
            <div className="flex gap-3">
              <div className="w-1/3 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">MLS#</label>
                <input
                  className="w-full h-12 px-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 transition-all"
                  inputMode="numeric"
                  placeholder="123456"
                  type="text"
                  value={formData.mlsNumber}
                  onChange={(e) => handleInputChange('mlsNumber', e.target.value)}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Property Address</label>
                <div className="relative">
                  <input
                    className="w-full h-12 pl-3 pr-10 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 transition-all"
                    placeholder="Optional"
                    type="text"
                    value={formData.propertyAddress}
                    onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">location_on</span>
                </div>
              </div>
            </div>
          </section>

          {/* Term Spec Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-200">
              <span className="material-symbols-outlined text-primary text-[20px]">request_quote</span>
              <h3 className="text-base font-bold uppercase tracking-wider text-gray-500">Term SPEC</h3>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Buyer Name</label>
                <input
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 transition-all"
                  placeholder="Full legal name"
                  type="text"
                  value={formData.buyerName}
                  onChange={(e) => handleInputChange('buyerName', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Offer Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input
                      className="w-full h-12 pl-7 pr-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 transition-all"
                      inputMode="decimal"
                      placeholder="0.00"
                      type="text"
                      value={formData.offerPrice}
                      onChange={(e) => handleInputChange('offerPrice', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Closing Date</label>
                  <div className="relative">
                    <input
                      className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 transition-all"
                      type="date"
                      value={formData.closingDate}
                      onChange={(e) => handleInputChange('closingDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Agent Info Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-200">
              <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
              <h3 className="text-base font-bold uppercase tracking-wider text-gray-500">Agent Info</h3>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Loan Agent</label>
                <input
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 transition-all"
                  placeholder="Name of loan officer"
                  type="text"
                  value={formData.loanAgent}
                  onChange={(e) => handleInputChange('loanAgent', e.target.value)}
                />
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Listing Agent</p>
                  <button className="text-xs font-medium text-primary hover:text-blue-600 transition-colors">
                    Edit Defaults
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Agent Name</label>
                    <input
                      className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-primary"
                      readOnly
                      type="text"
                      value="Sarah Jenkins"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">DRE #</label>
                      <input
                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-primary"
                        readOnly
                        type="text"
                        value="01827364"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Office #</label>
                      <input
                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-primary"
                        readOnly
                        type="text"
                        value="555-0192"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Office Address</label>
                    <input
                      className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-primary"
                      readOnly
                      type="text"
                      value="123 Market St, San Francisco, CA"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Post-Submission State Preview */}
          <section className="pt-4 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-xs font-mono text-gray-500">POST-SUBMISSION STATE PREVIEW</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">Generating Offer...</span>
                <span className="text-xs text-emerald-400 font-bold">COMPLETE</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                <div className="bg-emerald-500 h-2 rounded-full w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg border border-gray-600 hover:bg-gray-800 text-white text-sm font-medium transition-colors">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  Preview
                </button>
                <button className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-medium shadow-lg shadow-blue-900/20 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Download
                </button>
              </div>
            </div>
          </section>

          {/* Create Offer Button */}
          <button
            onClick={handleCreateOffer}
            className="w-full h-14 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            <span>Create Offer</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </main>
  )
}
