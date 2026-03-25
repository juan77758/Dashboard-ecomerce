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
  LayoutDashboard
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

// --- Componentes UX ---
const MetricCard = ({ title, value, unit = "", icon: Icon, trend = 0, color = "emerald" }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass p-6 glass-hover relative overflow-hidden group bg-white border border-slate-200"
  >
    {/* Soft subtle green glow bg */}
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm`}>
        <Icon size={24} />
      </div>
      {trend !== 0 && (
        <div className={`flex items-center text-sm font-bold ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend > 0 ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    
    <p className="text-slate-500 text-sm font-semibold mb-1 tracking-wide uppercase">{title}</p>
    <h3 className="text-4xl font-black tracking-tight text-slate-900">
      {unit}{typeof value === 'number' ? value.toLocaleString() : value}
    </h3>
  </motion.div>
);

const SectionTitle = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
      <Icon size={20} />
    </div>
    <h2 className="text-xl font-extrabold tracking-tight text-slate-800">{children}</h2>
  </div>
);

// --- App Principal ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    metrics: {},
    dailySales: [],
    categories: [],
    payments: [],
    recentOrders: []
  });

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
          const existing = acc.find(item => item.name === curr.metodo_pago);
          if (existing) existing.value += curr.importe_pagado_usd;
          else acc.push({ name: curr.metodo_pago, value: curr.importe_pagado_usd });
          return acc;
        }, []);

        const { data: recent } = await supabase.from('pedidos')
          .select('id, id_cliente, fecha_pedido, estado_pedido, importe_total_usd, clientes(nombre)')
          .order('fecha_pedido', { ascending: false })
          .limit(8);

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

  const GREEN_PALETTE = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-bg-cream">
       <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full mb-6"
      />
      <h2 className="text-emerald-900 font-black tracking-widest text-sm uppercase">Analizando Ecosistema de Datos...</h2>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-10 max-w-7xl mx-auto space-y-10 selection:bg-emerald-200">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10"
      >
        <div className="flex items-center gap-5">
          <div className="p-4 bg-emerald-600 text-white rounded-3xl shadow-xl shadow-emerald-200">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              Dashboard <span className="text-emerald-600">Analytics</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Visualización del rendimiento ecommerce &bull; Proyecto <span className="text-emerald-700 font-bold">PJ-08</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all">
            <History size={18} /> Últimos 90 Días
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-sm font-black rounded-xl shadow-lg shadow-emerald-200/50 flex items-center gap-2 transition-all active:scale-95">
            <TrendingUp size={18} /> Exportar Reporte
          </button>
        </div>
      </motion.header>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Ingresos Totales" value={data.metrics.totalRev} unit="$" icon={DollarSign} trend={8.4} color="emerald" />
        <MetricCard title="Ticket Promedio" value={data.metrics.avgTicket} unit="$" icon={ShoppingCart} trend={2.1} color="emerald" />
        <MetricCard title="Nuevos Clientes" value={data.metrics.clientsCount} icon={Users} trend={12.5} color="emerald" />
        <MetricCard title="Tasa Rembolso" value={data.metrics.refundRate.toFixed(1)} unit="" icon={Activity} trend={-1.4} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ventas Diarias */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 p-8 glass bg-white"
        >
          <SectionTitle icon={TrendingUp}>Crecimiento de Ventas Diarias</SectionTitle>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailySales}>
                <defs>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="fecha" axisLine={false} tickLine={false} dy={10} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} dx={-10} />
                <Tooltip 
                   cursor={{ stroke: '#059669', strokeWidth: 2 }}
                   contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="facturacion_total" stroke="#059669" strokeWidth={4} fillOpacity={1} fill="url(#colorGreen)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Métodos de Pago */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 p-8 glass bg-white flex flex-col"
        >
          <SectionTitle icon={CreditCard}>Métodos de Pago</SectionTitle>
          <div className="h-[400px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.payments}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {data.payments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GREEN_PALETTE[index % GREEN_PALETTE.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Categorías */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-4 p-8 glass bg-white"
        >
          <SectionTitle icon={Package}>Top Categorías ($)</SectionTitle>
          <div className="space-y-6 mt-6">
            {data.categories.slice(0, 6).map((cat, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">{cat.categoria}</span>
                  <span className="text-sm font-extrabold text-emerald-700">${cat.facturacion_total.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.facturacion_total / data.categories[0].facturacion_total) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-emerald-600 group-hover:bg-emerald-500 transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabla Actividad */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-8 p-8 glass bg-white"
        >
          <SectionTitle icon={History}>Última Actividad Económica</SectionTitle>
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-xs font-black uppercase tracking-widest text-left border-b border-slate-100">
                  <th className="pb-4">Cliente</th>
                  <th className="pb-4">Fecha</th>
                  <th className="pb-4">Estado</th>
                  <th className="pb-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.recentOrders.map((order, idx) => (
                  <tr key={order.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-slate-800">{order.clientes?.nombre}</div>
                    </td>
                    <td className="py-4 text-slate-500 text-sm font-medium">
                      {new Date(order.fecha_pedido).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight ${
                        order.estado_pedido === 'completado' ? 'bg-emerald-100 text-emerald-700' :
                        order.estado_pedido === 'cancelado' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {order.estado_pedido}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="font-black text-slate-900">${order.importe_total_usd.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <footer className="pt-10 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">&copy; 2026 PJ-Eco Analytics &bull; Designed by Antigravity</p>
      </footer>
    </div>
  );
}
