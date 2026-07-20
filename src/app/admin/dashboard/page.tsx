"use client";

import { useState, useEffect } from "react";

export default function BootstrapAdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mounted, setMounted] = useState(false);

  // --- Coupon, Landing, and Product Data Nodes (Price fixed to English format) ---
  const [coupons, setCoupons] = useState([
    { id: "c1", code: "ONECARTA40", discount: "৳40", type: "Fixed", status: "Active", used: 12 },
    { id: "c2", code: "SUMMERSALE", discount: "15%", type: "Percentage", status: "Active", used: 5 }
  ]);
  const [cpCode, setCpCode] = useState("");
  const [cpDiscount, setCpDiscount] = useState("");

  const [landingPages, setLandingPages] = useState([
    { id: "l1", title: "Flash Sale Landing Page", slug: "flash-sale", status: "Published", views: 245 },
    { id: "l2", title: "Premium Polo Special Showcase", slug: "polo-showcase", status: "Draft", views: 0 }
  ]);
  const [lpTitle, setLpTitle] = useState("");
  const [lpSlug, setLpSlug] = useState("");

  const [slides, setSlides] = useState([
    { id: "1", href: "/products?category=electronics", label: "Electronics Main Banner" },
    { id: "2", href: "/products?category=fashion", label: "Fashion Week Banner" }
  ]);
  const [slideHref, setSlideHref] = useState("");

  const [products, setProducts] = useState([
    { id: "p1", name: "Safari Cooper Green Luggage Bag 55 × 36 × 23 cm for Travel", sku: "LGCPR0010", price: "5,150", qty: 89 },
    { id: "p2", name: "Portable Handheld Turbo Fan (5 Speed | USB Rechargeable Type C)", sku: "URTF0011", price: "690", qty: 49 }
  ]);

  const [categories, setCategories] = useState([
    { id: "cat1", name: "Beauty & Care", subCount: 3 },
    { id: "cat2", name: "Electronics", subCount: 5 },
    { id: "cat3", name: "Fashion", subCount: 2 },
    { id: "cat4", name: "Bags & Luggage", subCount: 5 }
  ]);

  const [orders, setOrders] = useState([
    { id: "2368431", customer: "Tousif Rahman", phone: "+8801625684664", date: "May 24, 2026", status: "On Hold", amount: "৳5,280.00" },
    { id: "2368275", customer: "Tousif Rahman", phone: "+8801759002859", date: "May 24, 2026", status: "Completed", amount: "৳690.00" }
  ]);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="container-fluid g-0 position-fixed top-0 start-0 w-100 h-100 overflow-y-auto bg-light" style={{ zIndex: 999999 }}>
      <div className="row g-0 min-vh-100">
        
        {/* Left-side Bootstrap dark sidebar */}
        <div className="col-12 col-md-3 col-xl-2 bg-dark text-white p-4 d-flex flex-column">
          <div className="d-flex align-items-center pb-3 mb-4 border-bottom border-secondary">
            <i className="bi bi-speedometer2 text-warning fs-4 me-2"></i>
            <div>
              <h5 className="m-0 fw-bold">Onecarta Suite</h5>
              <small className="text-secondary fw-semibold text-uppercase">Bootstrap Admin</small>
            </div>
          </div>

          <p className="text-secondary text-uppercase fw-bold small tracking-wider mb-2">Modules</p>
          <div className="nav flex-column nav-pills">
            {[
              { id: "dashboard", label: "Dashboard Overview", icon: "bi-grid-1x2" },
              { id: "orders", label: "Orders & Pipeline", icon: "bi-box-seam" },
              { id: "products", label: "All Products Matrix", icon: "bi-bag" },
              { id: "categories", label: "Categories Grid", icon: "bi-layers" },
              { id: "slider", label: "Slider Management", icon: "bi-sliders" },
              { id: "landing", label: "Landing Pages Builder", icon: "bi-file-earmark-text" },
              { id: "coupons", label: "Promo & Coupons", icon: "bi-ticket-perforated" },
            ].map((item) => (
              <button
                key={item.id} onClick={() => setActiveTab(item.id)}
                className={`nav-link text-start text-white fw-bold mb-1 border-0 rounded-3 py-2.5 px-3 btn cursor-pointer ${
                  activeTab === item.id ? "bg-primary active text-white shadow-sm" : ""
                }`}
                style={{ background: activeTab === item.id ? "" : "transparent" }}
              >
                <i className={`${item.icon} me-2 ${activeTab === item.id ? 'text-white' : 'text-secondary'}`}></i> {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main data panel window on the right*/}
        <div className="col-12 col-md-9 col-xl-10 p-4 p-md-5">
          
          {/* ================= MOD A: DASHBOARD OVERVIEW ================= */}
          {activeTab === "dashboard" && (
            <div className="row g-3 animate-in fade-in">
              <div className="col-12 col-sm-6 col-lg-2.4 col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-4 d-flex flex-row justify-content-between align-items-center">
                  <div><p className="text-muted text-uppercase small fw-bold mb-1">Revenue Today</p><h5 className="fw-bold m-0">BDT 0</h5></div>
                  <div className="bg-primary-subtle text-primary p-2.5 rounded-3 fs-5"><i className="bi bi-currency-dollar"></i></div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-2.4 col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-4 d-flex flex-row justify-content-between align-items-center">
                  <div><p className="text-muted text-uppercase small fw-bold mb-1">Orders Today</p><h5 className="fw-bold m-0">0</h5></div>
                  <div className="bg-success-subtle text-success p-2.5 rounded-3 fs-5"><i className="bi bi-cart3"></i></div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-2.4 col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-4 d-flex flex-row justify-content-between align-items-center">
                  <div><p className="text-muted text-uppercase small fw-bold mb-1">Active Products</p><h5 className="fw-bold m-0">{products.length}</h5></div>
                  <div className="bg-purple-subtle text-purple p-2.5 rounded-3 fs-5"><i className="bi bi-bag-check"></i></div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-2.4 col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-4 d-flex flex-row justify-content-between align-items-center">
                  <div><p className="text-muted text-uppercase small fw-bold mb-1">Total Customers</p><h5 className="fw-bold m-0">2</h5></div>
                  <div className="bg-warning-subtle text-warning p-2.5 rounded-3 fs-5"><i className="bi bi-people"></i></div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-2.4 col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-4 d-flex flex-row justify-content-between align-items-center">
                  <div><p className="text-muted text-uppercase small fw-bold mb-1">Website Visits</p><h5 className="fw-bold m-0">3</h5></div>
                  <div className="bg-secondary-subtle text-dark p-2.5 rounded-3 fs-5"><i className="bi bi-graph-up"></i></div>
                </div>
              </div>

              {/* Chart Mock Splitting Layout */}
              <div className="col-12 col-lg-8 mt-4">
                <div className="card border-0 shadow-sm p-4 bg-white rounded-4 min-vh-25">
                  <h6 className="fw-bold text-dark text-uppercase small">Revenue Overview</h6>
                  <div className="border border-dashed border-secondary-subtle rounded-3 d-flex align-items-center justify-content-center text-muted small p-5 mt-2 bg-light">Line Chart Analytics Frame Node</div>
                </div>
              </div>
              <div className="col-12 col-lg-4 mt-4">
                <div className="card border-0 shadow-sm p-4 bg-white rounded-4 min-vh-25">
                  <h6 className="fw-bold text-dark text-uppercase small">Orders by Status</h6>
                  <div className="border border-dashed border-secondary-subtle rounded-3 d-flex align-items-center justify-content-center text-muted small p-5 mt-2 bg-light">No data available matrix</div>
                </div>
              </div>

              {/* Recent Orders Block */}
              <div className="col-12 mt-4">
                <div className="card border-0 shadow-sm p-4 bg-white rounded-4">
                  <h6 className="fw-bold mb-3 text-uppercase small text-muted">Recent Orders</h6>
                  {orders.map(o => (
                    <div key={o.id} className="d-flex justify-content-between align-items-center border-bottom border-light py-2.5 last:border-0 last:pb-0">
                      <div><p className="m-0 fw-bold text-dark">#{o.id} - {o.customer}</p><small className="text-muted">{o.phone}</small></div>
                      <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3 py-1.5 fw-bold">{o.status}</span>
                      <strong className="text-dark">{o.amount}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= MOD B: ORDERS LIST WITH FILTERS ================= */}
          {activeTab === "orders" && (
            <div className="card border-0 shadow-sm p-4 bg-white rounded-4 animate-in fade-in">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">Orders Registry Terminal</h5>
                <button className="btn btn-primary btn-sm fw-bold px-3 py-2 rounded-3">+ Create Order</button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle text-nowrap">
                  <thead className="table-light text-uppercase small fw-bold text-secondary">
                    <tr><th>Order</th><th>Customer</th><th>Date</th><th>Status</th><th className="text-end">Amount</th></tr>
                  </thead>
                  <tbody className="fw-semibold">
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td className="fw-bold text-dark">#{o.id} <span className="badge bg-primary-subtle text-primary rounded ms-1">Online</span></td>
                        <td>{o.customer} <br/><small className="text-muted">{o.phone}</small></td>
                        <td className="text-muted">{o.date}</td>
                        <td><span className={`badge ${o.status === 'Completed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} px-2.5 py-1.5 rounded-pill`}>{o.status}</span></td>
                        <td className="text-end fw-bold text-dark">{o.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= MOD C: ALL PRODUCTS MATRIX ================= */}
          {activeTab === "products" && (
            <div className="card border-0 shadow-sm p-4 bg-white rounded-4 animate-in fade-in">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">All Products Inventory Matrix</h5>
                <button className="btn btn-primary btn-sm fw-bold px-3 py-2 rounded-3"><i className="bi bi-plus"></i> Add Product</button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle text-nowrap">
                  <thead className="table-light text-uppercase small fw-bold text-secondary">
                    <tr><th>Product</th><th>Type</th><th>SKU</th><th>Price</th><th className="text-end">Qty</th></tr>
                  </thead>
                  <tbody className="fw-semibold">
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="fw-bold text-dark max-w-xs text-truncate">{p.name}</td>
                        <td className="text-muted uppercase small">Own</td>
                        <td className="font-mono text-muted">{p.sku}</td>
                        <td className="text-dark fw-bold">৳{p.price}</td>
                        <td className="text-end text-muted">{p.qty} items</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= MOD D: CATEGORIES GRID ================= */}
          {activeTab === "categories" && (
            <div className="card border-0 shadow-sm p-4 bg-white rounded-4 animate-in fade-in">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">Product Categories Registry</h5>
                <button className="btn btn-primary btn-sm fw-bold px-3 py-2 rounded-3"><i className="bi bi-plus"></i> Add Categories</button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle text-nowrap">
                  <thead className="table-light text-uppercase small fw-bold text-secondary">
                    <tr><th>Categories</th><th className="text-end">Total Subcategory</th></tr>
                  </thead>
                  <tbody className="fw-semibold">
                    {categories.map(c => (
                      <tr key={c.id}>
                        <td className="fw-bold text-dark d-flex align-items-center gap-2">
                          <div className="bg-light border rounded px-2.5 py-1 text-muted"><i className="bi bi-image"></i></div>
                          <span>{c.name}</span>
                        </td>
                        <td className="text-end text-dark fw-bold">{c.subCount} subcategories</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= MOD E: SLIDER MANAGEMENT ================= */}
          {activeTab === "slider" && (
            <div className="card border-0 shadow-sm p-4 bg-white rounded-4 animate-in fade-in">
              <h5 className="fw-bold mb-4">Upload / Configure Slide Node Link</h5>
              <form onSubmit={(e) => { e.preventDefault(); if(!slideHref) return; setSlides([...slides, { id: `s_${Date.now()}`, href: slideHref, label: "Bootstrap Slide" }]); setSlideHref(""); }} className="row g-3 mb-4">
                <div className="col-12 col-md-8">
                  <input type="text" placeholder="Target Routing Path Link (e.g., /products?category=fashion)" value={slideHref} onChange={(e) => setSlideHref(e.target.value)} required className="form-control py-2.5 fw-bold text-dark bg-white" />
                </div>
                <div className="col-12 col-md-4">
                  <button type="submit" className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm cursor-pointer">Inject Slide Frame</button>
                </div>
              </form>
              <h6 className="fw-bold text-muted text-uppercase small mb-3">Active Slides Array</h6>
              <div className="list-group">
                {slides.map((s, i) => (
                  <div key={s.id} className="list-group-item d-flex justify-content-between align-items-center border-0 bg-light rounded-3 mb-2 p-3">
                    <div><strong className="text-dark">Slide Node #{i+1}</strong><br/><small className="text-muted">{s.href}</small></div>
                    <button onClick={() => setSlides(slides.filter(item => item.id !== s.id))} className="btn btn-sm btn-outline-danger border-0 rounded-3 cursor-pointer"><i className="bi bi-trash3"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= MOD F: LANDING PAGES BUILDER ================= */}
          {activeTab === "landing" && (
            <div className="card border-0 shadow-sm p-4 bg-white rounded-4 animate-in fade-in">
              <h5 className="fw-bold mb-4">Spawn Custom Landing Module Page</h5>
              <form onSubmit={(e) => { e.preventDefault(); if(!lpTitle) return; setLandingPages([...landingPages, { id: `lp_${Date.now()}`, title: lpTitle, slug: lpSlug, status: "Published", views: 0 }]); setLpTitle(""); setLpSlug(""); }} className="row g-3 mb-4">
                <div className="col-12 col-md-5"><input type="text" placeholder="Page Title" value={lpTitle} onChange={(e) => setLpTitle(e.target.value)} required className="form-control py-2.5 fw-bold text-dark bg-white" /></div>
                <div className="col-12 col-md-5"><input type="text" placeholder="Custom URL Slug Path" value={lpSlug} onChange={(e) => setLpSlug(e.target.value)} required className="form-control py-2.5 fw-bold text-dark bg-white" /></div>
                <div className="col-12 col-md-2"><button type="submit" className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm cursor-pointer">Compile</button></div>
              </form>
              <div className="table-responsive">
                <table className="table align-middle text-nowrap">
                  <thead className="table-light text-uppercase small fw-bold text-secondary">
                    <tr><th>Landing Title</th><th>Slug Node</th><th>Status</th><th className="text-end">Tracker</th></tr>
                  </thead>
                  <tbody className="fw-semibold">
                    {landingPages.map(lp => (
                      <tr key={lp.id}>
                        <td className="fw-bold text-dark">{lp.title}</td>
                        <td className="text-primary">/promo/{lp.slug}</td>
                        <td><span className={`badge ${lp.status === 'Published' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-muted'} px-2 py-1`}>{lp.status}</span></td>
                        <td className="text-end text-muted font-mono">{lp.views} views</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= MOD G: COUPON CODES CONFIG ================= */}
          {activeTab === "coupons" && (
            <div className="card border-0 shadow-sm p-4 bg-white rounded-4 animate-in fade-in">
              <h5 className="fw-bold mb-4">Deploy Discount Coupon Engine</h5>
              <form onSubmit={(e) => { e.preventDefault(); if(!cpCode) return; setCoupons([...coupons, { id: `cp_${Date.now()}`, code: cpCode.toUpperCase(), discount: cpDiscount, type: "Fixed", status: "Active", used: 0 }]); setCpCode(""); setCpDiscount(""); }} className="row g-3 mb-4">
                <div className="col-12 col-md-5"><input type="text" placeholder="CODE (e.g. EXTRA50)" value={cpCode} onChange={(e) => setCpCode(e.target.value)} required className="form-control py-2.5 fw-bold text-dark bg-white" /></div>
                <div className="col-12 col-md-5"><input type="text" placeholder="Value (e.g. 50 or 15%)" value={cpDiscount} onChange={(e) => setCpDiscount(e.target.value)} required className="form-control py-2.5 fw-bold text-dark bg-white" /></div>
                <div className="col-12 col-md-2"><button type="submit" className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm cursor-pointer">Activate</button></div>
              </form>
              <div className="table-responsive">
                <table className="table align-middle text-nowrap">
                  <thead className="table-light text-uppercase small fw-bold text-secondary">
                    <tr><th>Access Code</th><th>Deduct Volume</th><th>Status</th><th className="text-end">Used Counter</th></tr>
                  </thead>
                  <tbody className="fw-semibold">
                    {coupons.map(cp => (
                      <tr key={cp.id}>
                        <td className="text-primary fw-bold font-mono">{cp.code}</td>
                        <td className="text-dark fw-bold">{cp.discount}</td>
                        <td><span className="badge bg-success px-2 py-1">{cp.status}</span></td>
                        <td className="text-end text-muted font-mono">{cp.used} times</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}