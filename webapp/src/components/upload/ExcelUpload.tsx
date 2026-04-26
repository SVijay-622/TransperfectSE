'use client';

import { useState } from 'react';
import { UploadCloud, X, FileSpreadsheet } from 'lucide-react';

export function ExcelUploadModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploaderId', 'admin-user');

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Upload failed');
            setMessage('Runbook uploaded successfully. Processing in background...');
            setTimeout(onClose, 2000);
        } catch (e) {
            setMessage('Error uploading file.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900"><X className="w-5 h-5" /></button>
                <h2 className="text-xl font-bold flex items-center gap-2"><FileSpreadsheet className="w-6 h-6 text-green-600" /> Upload Runbook</h2>

                <div className="border-2 border-dashed border-zinc-300 rounded-xl p-8 flex flex-col items-center justify-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer relative">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".xlsx" onChange={e => setFile(e.target.files?.[0] || null)} />
                    <UploadCloud className="w-10 h-10 text-zinc-400 mb-2" />
                    <p className="font-medium text-zinc-700">{file ? file.name : 'Select or drag Excel file here'}</p>
                    <p className="text-xs text-zinc-500 mt-1">Supports Custom Pivoted Runbooks (.xlsx)</p>
                </div>

                {message && <div className="text-sm text-center text-blue-600 font-medium">{message}</div>}

                <div className="flex gap-3 justify-end mt-2">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-zinc-50">Cancel</button>
                    <button onClick={handleUpload} disabled={!file || isUploading} className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${!file || isUploading ? 'bg-zinc-400' : 'bg-green-600 hover:bg-green-700'}`}>
                        {isUploading ? 'Uploading...' : 'Process Runbook'}
                    </button>
                </div>
            </div>
        </div>
    );
}
