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
  History
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
const MetricCard = ({ title, value, unit = "", icon: Icon, trend = 0, color = "primary" }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass p-6 glass-hover relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${color}/10 rounded-full blur-3xl group-hover:bg-${color}/20 transition-all duration-500`} />
    
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl bg-${color}/10 text-${color}`}>
        <Icon size={24} />
      </div>
      {trend !== 0 && (
        <div className={`flex items-center text-xs font-medium ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    
    <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">{title}</p>
    <h3 className="text-3xl font-bold tracking-tight">
      {unit}{typeof value === 'number' ? value.toLocaleString() : value}
    </h3>
  </motion.div>
);

const SectionTitle = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
      <Icon size={20} className="text-primary" />
    </div>
    <h2 className="text-xl font-bold tracking-tight text-white/90">{children}</h2>
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
        // 1. Métricas Globales
        const { data: orders } = await supabase.from('pedidos').select('importe_total_usd, estado_pedido');
        const { count: clientsCount } = await supabase.from('clientes').select('*', { count: 'exact', head: true });
        const { count: productsCount } = await supabase.from('productos').select('*', { count: 'exact', head: true });
        
        const totalRev = orders?.filter(o => o.estado_pedido === 'completado').reduce((acc, curr) => acc + curr.importe_total_usd, 0) || 0;
        const avgTicket = totalRev / (orders?.filter(o => o.estado_pedido === 'completado').length || 1);
        const refundRate = (orders?.filter(o => o.estado_pedido === 'reembolsado').length / (orders?.length || 1)) * 100;

        // 2. Ventas Diarias (desde vista)
        const { data: dailySales } = await supabase.from('ventas_diarias').select('*').limit(30);
        
        // 3. Ventas por Categoría (desde vista)
        const { data: catSales } = await supabase.from('ventas_por_categoria').select('*');

        // 4. Métodos de Pago
        const { data: payments } = await supabase.from('pagos').select('metodo_pago, importe_pagado_usd');
        const paymentStats = payments?.reduce((acc, curr) => {
          const existing = acc.find(item => item.name === curr.metodo_pago);
          if (existing) existing.value += curr.importe_pagado_usd;
          else acc.push({ name: curr.metodo_pago, value: curr.importe_pagado_usd });
          return acc;
        }, []);

        // 5. Pedidos Recientes
        const { data: recent } = await supabase.from('pedidos')
          .select('id, id_cliente, fecha_pedido, estado_pedido, importe_total_usd, clientes(nombre)')
          .order('fecha_pedido', { ascending: false })
          .limit(8);

        setData({
          metrics: { totalRev, clientsCount, productsCount, avgTicket, refundRate, ordersTotal: orders?.length },
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

  const COLORS = ['#0ea5e9', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-bg-dark">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mb-4"
      />
      <p className="text-slate-500 animate-pulse tracking-widest uppercase text-xs">Cargando Inteligencia de Negocio...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
             <span className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">Live Insights</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white/90">
            Analytics <span className="text-primary italic">PJ-Dashboard</span>
          </h1>
          <p className="text-slate-400 mt-1 max-w-lg">Visi\u00f3n global de rendimiento del ecommerce en tiempo real.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="glass px-4 py-2 text-sm font-medium glass-hover text-slate-300 flex items-center gap-2">
            <History size={16} /> Úiltimos 90 días
          </button>
          <button className="bg-primary hover:bg-primary/80 transition-colors text-white px-5 py-2 text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20">
            <TrendingUp size={16} /> Exportar Reporte
          </button>
        </div>
      </motion.header>

      {/* Métricas */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard title="Facturación Total" value={data.metrics.totalRev} unit="$" icon={DollarSign} trend={8.4} color="primary" />
        <MetricCard title="Ticket Promedio" value={data.metrics.avgTicket} unit="$" icon={ShoppingCart} trend={2.1} color="secondary" />
        <MetricCard title="Total Clientes" value={data.metrics.clientsCount} icon={Users} trend={12.5} color="accent" />
        <MetricCard title="Tasa Devolución" value={data.metrics.refundRate.toFixed(1)} unit="" icon={Activity} trend={-1.4} color="emerald" />
      </motion.div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evolución Ventas */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass p-6"
        >
          <SectionTitle icon={TrendingUp}>Evolución de Ventas Diarias</SectionTitle>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailySales}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="fecha" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                  itemStyle={{ color: '#0ea5e9' }}
                />
                <Area type="monotone" dataKey="facturacion_total" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Distribución Pagos */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6"
        >
          <SectionTitle icon={CreditCard}>Métodos de Pago ($)</SectionTitle>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.payments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.payments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Gráficos Secundarios y Tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ventas por Categoría */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-1 glass p-6"
        >
          <SectionTitle icon={Package}>Top Categorías</SectionTitle>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categories.slice(0, 8)} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="categoria" type="category" axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="facturacion_total" radius={[0, 4, 4, 0]}>
                  {data.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#0ea5e9" fillOpacity={1 - (index * 0.1)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pedidos Recientes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 glass p-6 overflow-hidden"
        >
          <SectionTitle icon={History}>Últimos Pedidos</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-xs font-bold border-b border-white/5 uppercase tracking-wider">
                  <th className="pb-4">Cliente</th>
                  <th className="pb-4">Fecha</th>
                  <th className="pb-4">Estado</th>
                  <th className="pb-4 text-right">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.recentOrders.map((order, idx) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (idx * 0.05) }}
                    className="group hover:bg-white/5 transition-colors cursor-default"
                  >
                    <td className="py-4">
                      <div className="font-semibold text-slate-200">{order.clientes?.nombre}</div>
                    </td>
                    <td className="py-4 text-slate-400 text-sm">
                      {new Date(order.fecha_pedido).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.estado_pedido === 'completado' ? 'bg-emerald-500/10 text-emerald-400' :
                        order.estado_pedido === 'cancelado' ? 'bg-rose-500/10 text-rose-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {order.estado_pedido}
                      </span>
                    </td>
                    <td className="py-4 text-right font-bold text-slate-200">
                      ${order.importe_total_usd.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <footer className="pt-8 text-center text-slate-500 text-xs tracking-widest uppercase pb-4">
        &copy; 2026 PJ-Analytics Platform &bull; Powered by Supabase & Antigravity
      </footer>
    </div>
  );
}
