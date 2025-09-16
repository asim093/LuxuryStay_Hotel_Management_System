import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Save } from 'lucide-react';
import { toast } from 'react-toastify';

const Settings = () => {
  const token = useSelector(s=>s.user.token);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({ hotelName: '', currency: 'Rs', taxPercent: 0, permissions: {} });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/settings', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSettings(data.settings || settings);
    } catch (e) { toast.error('Failed to load settings'); } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); // eslint-disable-next-line
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Settings saved');
    } catch(e){ toast.error('Failed to save'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
              <input className="w-full border rounded-lg px-3 py-2" value={settings.hotelName} onChange={(e)=>setSettings(p=>({...p,hotelName:e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <input className="w-full border rounded-lg px-3 py-2" value={settings.currency} onChange={(e)=>setSettings(p=>({...p,currency:e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Percent</label>
              <input type="number" min="0" className="w-full border rounded-lg px-3 py-2" value={settings.taxPercent} onChange={(e)=>setSettings(p=>({...p,taxPercent:Number(e.target.value)}))} />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg" disabled={loading}>
              <Save size={16}/> {loading?'Saving...':'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
