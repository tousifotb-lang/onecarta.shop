// src/app/admin/layout.tsx
import React from "react";

export const metadata = {
  title: "Onecarta - Bootstrap Admin Terminal",
  description: "Merchant Backoffice Bootstrap Powered Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* ⚡ বুটস্ট্র্যাপ সিডিএন ইনজেকশন (<html> বা <body> ট্যাগ ছাড়া) */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        crossOrigin="anonymous"
      />
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" 
        rel="stylesheet" 
      />

      {/* 👑 কাস্টমার নেভবার ছাড়া সম্পূর্ণ স্বাধীন বুটস্ট্র্যাপ র‍্যাপার */}
      <div className="bg-light w-100 min-vh-100 text-dark" style={{ position: "relative", zIndex: 99999 }}>
        {children}
      </div>
    </>
  );
}