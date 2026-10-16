"use client";

import dynamic from "next/dynamic";

const AdminStudio = dynamic(() => import("@/components/AdminStudio"), {
  ssr: false,
  loading: () => (
    <div className="admin-gate">
      <div className="admin-gate-panel">
        <div className="admin-mark">K<span>.</span></div>
        <p className="admin-eyebrow">KRISHNA / PRIVATE STUDIO</p>
        <h1>Opening your<br /><em>workspace.</em></h1>
        <div className="admin-loading-line"><span /></div>
        <small>LOADING EDITOR</small>
      </div>
    </div>
  ),
});

export default function AdminStudioClient() {
  return <AdminStudio />;
}
