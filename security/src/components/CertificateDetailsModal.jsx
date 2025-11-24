import React from "react";
import {
  X,
  ShieldCheck,
  Calendar,
  Clock,
  Wallet,
  Hash,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { shortenAddress } from "../utils/helperFunctions";
import { changeStatus } from "../services/apiCertificate";
// status: 0 = Pending, 1 = Active, 2 = Suspended, 3 = Revoked
const STATUS_LABELS = {
  0: "Pending",
  1: "Active",
  2: "Suspended",
  3: "Revoked",
};

const STATUS_COLORS = {
  0: "bg-amber-100 text-amber-800 border-amber-200",
  1: "bg-emerald-100 text-emerald-800 border-emerald-200",
  2: "bg-sky-100 text-sky-800 border-sky-200",
  3: "bg-red-100 text-red-800 border-red-200",
};

export default function CertificateDetailsModal({
  isOpen,
  onClose,
  cert,
}) {
  if (!isOpen || !cert) return null;
  const statusLabel = STATUS_LABELS[cert.status] ?? "Unknown";
  const statusClass =
    STATUS_COLORS[cert.status] ?? "bg-gray-100 text-gray-700 border-gray-200";

  const payload = cert.payload || {};
  const issuedDate = cert.issuedAt
    ? new Date(Number(cert.issuedAt) * 1000).toLocaleString()
    : "—";
  const expiresDate =
    cert.expiresAt && Number(cert.expiresAt) !== 0
      ? new Date(Number(cert.expiresAt) * 1000).toLocaleString()
      : "No expiry";

  const canApprove = cert.status === 0; // Pending

  function handleApprove(){
    changeStatus({ certHash: cert.certHash, newStatus: 1 })
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-full bg-red-50 text-red-600">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Certificate Details
              </h2>
              <p className="text-sm text-slate-500">
                Review the credential metadata and payload.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          {/* Status + hashes */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </h3>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${statusClass}`}
              >
                <span className="w-2 h-2 rounded-full bg-current/60" />
                {statusLabel}
              </span>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                Only publishers can change certificate status.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Certificate Hash
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-700 break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                <Hash size={14} className="text-slate-400 shrink-0" />
                {cert.certHash}
              </div>

              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-3">
                Schema Hash
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-700 break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                <Hash size={14} className="text-slate-400 shrink-0" />
                {cert.schemaHash}
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Issued At
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Calendar size={16} className="text-slate-400" />
                {issuedDate}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Expires At
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Clock size={16} className="text-slate-400" />
                {expiresDate}
              </div>
            </div>
          </section>

          {/* Subject / Personal info */}
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Subject Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Full Name</p>
                <p className="text-sm font-semibold text-slate-900">
                  {payload.fullName || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Date of Birth</p>
                <p className="text-sm text-slate-800">
                  {payload.birthDate || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">ID Number</p>
                <p className="text-sm text-slate-800">
                  {payload.idNumber || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Wallet Address</p>
                <div className="flex items-center gap-2 text-sm text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 w-fit">
                  <Wallet size={14} className="text-slate-400" />
                  {payload.walletAddress
                    ? shortenAddress(payload.walletAddress)
                    : "—"}
                </div>
              </div>
            </div>
          </section>

          {/* Type-specific info (simple example) */}
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Certificate Payload
            </h3>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-xs font-mono text-slate-700 overflow-x-auto">
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>
          </section>
        </div>

        {/* Footer / Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <AlertCircle size={14} className="text-slate-400" />
            Status changes are anchored on the private Fabric network.
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>

            {canApprove && (
              <button
                type="button"
                onClick={handleApprove}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                  <>
                    <CheckCircle2 size={18} />
                    Approve Certificate
                  </>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}