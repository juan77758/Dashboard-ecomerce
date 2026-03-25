import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  Activity,
  Globe,
  CreditCard,
  History,
  LayoutDashboard,
  Search,
  Bell,
  Settings,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- Supabase Config ---
const SUPABASE_URL = "https://ncbxirahdlwhlzjmogsb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_SPyTtOQnBQ654KoiM4W2yg_EIkp5DE6";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Componentes UI ---
const MetricCard = ({ title, value, unit = "", icon: Icon, trend = 0, color = "indigo" }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="startup-card startup-hover p-7 relative"
  >
    <div className="flex justify-between items-center mb-6">
      <div className={`p-2.5 rounded-2xl bg-${color}-50 text-${color}-600 border border-${color}-100`}>
        <Icon size={20} />
      </div>
      {trend !== 0 && (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold leading-5 ${trend > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {trend > 0 ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    
    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.05em] mb-1">{title}</p>
    <h3 className="text-3xl font-black tracking-tight text-slate-900 flex items-baseline">
      {unit && <span className="text-slate-400 font-medium mr-0.5">{unit}</span>}
      {typeof value === 'number' ? value.toLocaleString() : value}
    </h3>
  </motion.div>
);

const SectionHeader = ({ title, icon: Icon, rightContent }) => (
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
        <Icon size={18} />
      </div>
      <h2 className="text-xl font-black tracking-tight text-slate-900">{title}</h2>
    </div>
    {rightContent}
  </div>
);

// --- App Principal ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ metrics: {}, dailySales: [], categories: [], payments: [], recentOrders: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: orders } = await supabase.from('pedidos').select('importe_total_usd, estado_pedido');
        const { count: clientsCount } = await supabase.from('clientes').select('*', { count: 'exact', head: true });
        
        const totalRev = orders?.filter(o => o.estado_pedido === 'completado').reduce((acc, curr) => acc + curr.importe_total_usd, 0) || 0;
        const avgTicket = totalRev / (orders?.filter(o => o.estado_pedido === 'completado').length || 1);
        const refundRate = (orders?.filter(o => o.estado_pedido === 'reembolsado').length / (orders?.length || 1)) * 100;

        const { data: dailySales } = await supabase.from('ventas_diarias').select('*').limit(30);
        const { data: catSales } = await supabase.from('ventas_por_categoria').select('*');

        const { data: payments } = await supabase.from('pagos').select('metodo_pago, importe_pagado_usd');
        const paymentStats = payments?.reduce((acc, curr) => {
          const name = curr.metodo_pago.toUpperCase();
          const existing = acc.find(item => item.name === name);
          if (existing) {
            existing.value += parseFloat(curr.importe_pagado_usd);
          } else {
            acc.push({ name: name, value: parseFloat(curr.importe_pagado_usd) });
          }
          return acc;
        }, []);

        const { data: recent } = await supabase.from('pedidos')
          .select('id, id_cliente, fecha_pedido, estado_pedido, importe_total_usd, clientes(nombre)')
          .order('fecha_pedido', { ascending: false })
          .limit(6);

        setData({
          metrics: { totalRev, clientsCount, avgTicket, refundRate },
          dailySales: dailySales?.reverse() || [],
          categories: catSales || [],
          payments: paymentStats || [],
          recentOrders: recent || []
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const STARTUP_PALETTE = ['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 relative flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent" />
      </div>
      <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-6">Secure Connection Established</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 lg:p-16 max-w-[1400px] mx-auto space-y-12">
      {/* Top Bar Navigation (Startup Style) */}
      <nav className="flex items-center justify-between pb-10 border-b border-slate-200/60">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black group-hover:scale-105 transition-transform">PJ</div>
            <span className="text-lg font-black tracking-tighter text-slate-800">DASHBOARD</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-400">
            <a href="#" className="text-indigo-600 hover:text-indigo-700 transition">Overview</a>
            <a href="#" className="hover:text-slate-600 transition">Ecommerce</a>
            <a href="#" className="hover:text-slate-600 transition">Inventory</a>
            <a href="#" className="hover:text-slate-600 transition">Settings</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
             <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
             <input type="text" placeholder="Search data..." className="bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none w-64" />
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50" />
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
        </div>
      </nav>

      {/* Header Headline */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-flex border border-indigo-100">
             <Activity size={12} className="animate-pulse" /> Live Economy Monitor
          </div>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[0.95]">
            Business <br /> <span className="text-indigo-600">Intelligence.</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg max-w-lg font-medium">90 day performance overview for your California Marketplace.</p>
        </div>

        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-6 py-3.5 text-sm font-black rounded-2xl hover:bg-slate-50 transition active:scale-95 flex items-center gap-2 shadow-sm">
            <History size={18} /> Last 90D
          </button>
          <button className="bg-slate-900 text-white px-7 py-3.5 text-sm font-black rounded-2xl hover:bg-slate-800 transition active:scale-95 flex items-center gap-2 shadow-xl shadow-slate-200">
             Export Analysis <ChevronRight size={18} />
          </button>
        </div>
      </header>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard title="Gross Revenue" value={data.metrics.totalRev} unit="$" icon={DollarSign} trend={8.4} color="indigo" />
        <MetricCard title="Active Customers" value={data.metrics.clientsCount} icon={Users} trend={12.5} color="indigo" />
        <MetricCard title="Average Order" value={data.metrics.avgTicket} unit="$" icon={ShoppingCart} trend={2.1} color="indigo" />
        <MetricCard title="Refund Rate" value={data.metrics.refundRate.toFixed(1)} unit="" icon={Activity} trend={-1.4} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Chart Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 startup-card p-10 bg-white border border-slate-100">
          <SectionHeader title="Sales Evolution" icon={TrendingUp} rightContent={<div className="text-xs font-black text-slate-400 uppercase tracking-widest">USD ($)</div>} />
          <div className="h-[420px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailySales}>
                <defs>
                  <linearGradient id="startupGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} strokeOpacity={0.05} />
                <XAxis dataKey="fecha" axisLine={false} tickLine={false} dy={20} style={{ fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} dx={-20} style={{ fontWeight: 600 }} />
                <Tooltip 
                   cursor={{ stroke: '#4f46e5', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                   contentStyle={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="facturacion_total" stroke="#4f46e5" strokeWidth={5} dot={{ fill: '#4f46e5', r: 0 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} fillOpacity={1} fill="url(#startupGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Small Analytics Side Section */}
        <div className="lg:col-span-4 space-y-10">
          {/* Payment Methods */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="startup-card p-10 bg-white">
            <SectionHeader title="Payments" icon={CreditCard} />
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.payments} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value">
                    {data.payments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STARTUP_PALETTE[index % STARTUP_PALETTE.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9' }} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center text-xs font-bold text-slate-400">
               <span>STRIPE DOMINANCE</span>
               <span className="text-indigo-600 font-black">74.2%</span>
            </div>
          </motion.div>
          
          <div className="startup-card p-8 bg-indigo-600 text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-20"><Package size={80} /></div>
             <p className="text-indigo-100 font-bold uppercase tracking-widest text-[10px] mb-2">Inventory Status</p>
             <h4 className="text-2xl font-black leading-tight">Your stock is <br /> healthy.</h4>
             <button className="mt-6 bg-white py-2 px-4 rounded-xl text-indigo-700 text-xs font-black uppercase tracking-widest group-hover:bg-indigo-50 transition-colors">Manage Stock</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Categories List Section */}
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-4 startup-card p-10">
          <SectionHeader title="Categories" icon={Package} />
          <div className="space-y-8 mt-6">
            {data.categories.slice(0, 5).map((cat, idx) => {
              const percentage = (cat.facturacion_total / data.categories[0].facturacion_total) * 100;
              return (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black text-slate-900 tracking-tight underline decoration-slate-100 decoration-4 underline-offset-4">{cat.categoria}</span>
                    <span className="text-xs font-bold text-slate-400">${cat.facturacion_total.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-50 h-1.5 rounded-full">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-slate-900 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Transactions Table Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 startup-card p-10 bg-white">
          <SectionHeader title="Transactions" icon={History} rightContent={<button className="text-xs font-black text-indigo-600 hover:underline">View All</button>} />
          <div className="overflow-x-auto mt-6">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em] text-left border-b border-slate-50">
                  <th className="pb-6">Reference Customer</th>
                  <th className="pb-6">Date</th>
                  <th className="pb-6">Status</th>
                  <th className="pb-6 text-right">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors cursor-default">
                    <td className="py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">{order.clientes?.nombre.substring(0,2).toUpperCase()}</div>
                         <div className="font-bold text-slate-900 text-sm tracking-tight">{order.clientes?.nombre}</div>
                      </div>
                    </td>
                    <td className="py-6 text-slate-400 text-xs font-bold tracking-tight">
                      {new Date(order.fecha_pedido).toLocaleDateString()}
                    </td>
                    <td className="py-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.05em] ${
                        order.estado_pedido === 'completado' ? 'bg-emerald-50 text-emerald-700' :
                        order.estado_pedido === 'cancelado' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {order.estado_pedido}
                      </span>
                    </td>
                    <td className="py-6 text-right text-sm">
                      <span className="font-black text-slate-900">${order.importe_total_usd.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <footer className="pt-16 pb-12 flex flex-col md:flex-row items-center justify-between border-t border-slate-200/50 gap-6">
         <div className="flex items-center gap-2">
           <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] font-black text-white">PJ</div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-[0.2em]">&copy; 2026 PJ CLOUD SYSTEMS INC.</span>
         </div>
         <div className="flex gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Support</a>
         </div>
      </footer>
    </div>
  );
}
