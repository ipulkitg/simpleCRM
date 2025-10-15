import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  Handshake,
  Percent,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import KpiCard from './components/KpiCard.jsx';
import StageBadge from './components/StageBadge.jsx';
import EmptyState from './components/EmptyState.jsx';
import { companies, deals, pipelineStages, revenueByMonth } from './data/sampleData.js';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

const defaultFormatter = new Intl.NumberFormat('en-US');

const RevenueTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const [{ payload: entry }] = payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-slate-800">{entry.month}</p>
      <p className="mt-1 text-xs text-slate-500">Revenue: {currencyFormatter.format(entry.revenue)}</p>
      <p className="text-xs text-slate-500">Deals: {entry.deals}</p>
    </div>
  );
};

const PipelineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const valueEntry = payload.find((item) => item.dataKey === 'value');
  const countEntry = payload.find((item) => item.dataKey === 'count');

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <p className="mt-1 text-xs text-slate-500">
        Pipeline Value: {currencyFormatter.format(valueEntry?.value ?? 0)}
      </p>
      <p className="text-xs text-slate-500">Deals: {countEntry?.value ?? 0}</p>
    </div>
  );
};

RevenueTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({ payload: PropTypes.object })),
};

RevenueTooltip.defaultProps = {
  active: false,
  payload: [],
};

PipelineTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({ dataKey: PropTypes.string, value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) })),
  label: PropTypes.string,
};

PipelineTooltip.defaultProps = {
  active: false,
  payload: [],
  label: '',
};

const App = () => {
  const [isPopulated, setIsPopulated] = useState(false);

  const currentDeals = isPopulated ? deals : [];
  const currentRevenue = isPopulated ? revenueByMonth : [];
  const currentCompanies = isPopulated ? companies : [];

  const metrics = useMemo(() => {
    if (!isPopulated) {
      return {
        totalRevenue: { value: '$0', trend: [] },
        activeDeals: { value: '0', trend: [] },
        winRate: { value: '0%', trend: [] },
        monthlyGrowth: { value: '0%', trend: [] },
      };
    }

    const wonDeals = currentDeals.filter((deal) => deal.stage === 'Won');
    const lostDeals = currentDeals.filter((deal) => deal.stage === 'Lost');
    const activeDealsCount = currentDeals.filter(
      (deal) => ['New', 'Qualified', 'Proposal', 'Negotiation'].includes(deal.stage),
    ).length;

    const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);

    const winRate = wonDeals.length + lostDeals.length > 0
      ? wonDeals.length / (wonDeals.length + lostDeals.length)
      : 0;

    const totalRevenueTrend = currentRevenue.map((entry) => ({
      name: entry.month,
      value: entry.revenue,
    }));

    const activeDealsTrend = currentRevenue.map((entry) => ({
      name: entry.month,
      value: entry.deals,
    }));

    const winLossByMonth = currentRevenue.map((entry) => {
      const monthDeals = currentDeals.filter((deal) => {
        const date = new Date(deal.closeDate);
        return date.toLocaleString('en-US', { month: 'short' }) === entry.month;
      });
      const wonCount = monthDeals.filter((deal) => deal.stage === 'Won').length;
      const lostCount = monthDeals.filter((deal) => deal.stage === 'Lost').length;
      const ratio = wonCount + lostCount > 0 ? wonCount / (wonCount + lostCount) : 0;
      return {
        name: entry.month,
        value: Number((ratio * 100).toFixed(1)),
      };
    });

    const monthlyGrowthTrend = currentRevenue.map((entry, index) => {
      if (index === 0) {
        return { name: entry.month, value: 0 };
      }
      const prev = currentRevenue[index - 1];
      const growth = prev.revenue ? ((entry.revenue - prev.revenue) / prev.revenue) * 100 : 0;
      return {
        name: entry.month,
        value: Number(growth.toFixed(1)),
      };
    });

    const latestGrowth = monthlyGrowthTrend[monthlyGrowthTrend.length - 1]?.value ?? 0;

    return {
      totalRevenue: {
        value: currencyFormatter.format(totalRevenue),
        trend: totalRevenueTrend,
      },
      activeDeals: {
        value: defaultFormatter.format(activeDealsCount),
        trend: activeDealsTrend,
      },
      winRate: {
        value: percentFormatter.format(winRate),
        trend: winLossByMonth,
      },
      monthlyGrowth: {
        value: percentFormatter.format(latestGrowth / 100),
        trend: monthlyGrowthTrend,
      },
    };
  }, [currentDeals, currentRevenue, isPopulated]);

  const kpiCards = useMemo(() => [
    {
      key: 'totalRevenue',
      icon: TrendingUp,
      label: 'Total Revenue',
      helper: 'Won this year',
      value: metrics.totalRevenue.value,
      trendData: metrics.totalRevenue.trend,
      color: '#3B82F6',
      formatter: (val) => currencyFormatter.format(val),
    },
    {
      key: 'activeDeals',
      icon: Handshake,
      label: 'Active Deals',
      helper: 'Pipeline in motion',
      value: metrics.activeDeals.value,
      trendData: metrics.activeDeals.trend,
      color: '#6366F1',
      formatter: (val) => defaultFormatter.format(val),
    },
    {
      key: 'winRate',
      icon: Percent,
      label: 'Win Rate',
      helper: 'Won vs. lost',
      value: metrics.winRate.value,
      trendData: metrics.winRate.trend,
      color: '#10B981',
      formatter: (val) => `${val}%`,
    },
    {
      key: 'monthlyGrowth',
      icon: ArrowUpRight,
      label: 'Monthly Growth',
      helper: 'vs. last month',
      value: metrics.monthlyGrowth.value,
      trendData: metrics.monthlyGrowth.trend,
      color: '#F97316',
      formatter: (val) => `${val}%`,
    },
  ], [metrics]);

  const pipelineData = useMemo(() => {
    if (!isPopulated) {
      return [];
    }

    return pipelineStages.map((stage) => {
      const dealsInStage = currentDeals.filter((deal) => deal.stage === stage);
      const totalValue = dealsInStage.reduce((sum, deal) => sum + deal.value, 0);
      return {
        stage,
        value: totalValue,
        count: dealsInStage.length,
      };
    });
  }, [currentDeals, isPopulated]);

  const recentDeals = useMemo(() => {
    if (!isPopulated) {
      return [];
    }

    return [...currentDeals]
      .sort((a, b) => new Date(b.closeDate) - new Date(a.closeDate))
      .slice(0, 10);
  }, [currentDeals, isPopulated]);

  const topCompanies = useMemo(() => {
    if (!isPopulated) {
      return [];
    }

    const aggregates = currentDeals.reduce((acc, deal) => {
      if (!acc.has(deal.company)) {
        acc.set(deal.company, { totalValue: 0, dealCount: 0 });
      }

      const entry = acc.get(deal.company);
      if (deal.stage !== 'Lost') {
        entry.totalValue += deal.value;
      }
      entry.dealCount += 1;
      return acc;
    }, new Map());

    return currentCompanies
      .map((company) => ({
        ...company,
        totalValue: aggregates.get(company.name)?.totalValue ?? 0,
        dealCount: aggregates.get(company.name)?.dealCount ?? 0,
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10);
  }, [currentCompanies, currentDeals, isPopulated]);

  const handlePopulate = () => setIsPopulated(true);
  const handleReset = () => setIsPopulated(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-background to-white pb-16">
      <header className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
          <div className="absolute right-0 top-16 h-56 w-56 rounded-full bg-success/30 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary-100">
              <Sparkles className="h-4 w-4" strokeWidth={1.6} />
              DemoCRM
            </span>
            <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
              A crisp, zero-lift CRM showcase for DemoForge
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300">
              Start with a clean slate, then ignite the dashboard with a single click.
              Perfect for illustrating how your agent workflows can breathe life into raw data.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:border-white hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/40"
              disabled={!isPopulated}
            >
              Reset to Empty
            </button>
            <button
              type="button"
              onClick={handlePopulate}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:bg-white/70 disabled:text-slate-500"
              disabled={isPopulated}
            >
              Populate Dashboard
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-12 grid max-w-6xl gap-10 px-6">
        <section>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((card) => (
              <KpiCard
                key={card.key}
                icon={card.icon}
                label={card.label}
                value={card.value}
                helper={card.helper}
                trendData={card.trendData}
                trendColor={card.color}
                trendFormatter={card.formatter}
              />
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="section-card">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Revenue Trend</h2>
              <span className="text-xs font-medium uppercase tracking-wide text-primary">Last 6 months</span>
            </div>
            <div className="mt-6 h-72">
              {currentRevenue.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentRevenue} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip content={<RevenueTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  title="No revenue data yet"
                  description="Revenue trendlines appear here once deals start closing."
                />
              )}
            </div>
          </div>

          <div className="section-card">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Pipeline Overview</h2>
              <span className="text-xs font-medium uppercase tracking-wide text-success">Live funnel</span>
            </div>
            <div className="mt-6 h-72">
              {pipelineData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={pipelineData} layout="vertical" margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                    />
                    <YAxis
                      type="category"
                      dataKey="stage"
                      tickLine={false}
                      axisLine={false}
                      width={110}
                      tickFormatter={(value) => value}
                    />
                    <Tooltip content={<PipelineTooltip />} />
                    <Legend iconType="circle" verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12, paddingBottom: 12 }} />
                    <Bar
                      dataKey="value"
                      barSize={16}
                      radius={[0, 8, 8, 0]}
                      fill="#3B82F6"
                      name="Pipeline Value"
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
                      name="Deal Count"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  title="No pipeline data"
                  description="The funnel comes to life after your first set of deals enter the pipeline."
                />
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="section-card">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Recent Deals</h2>
              <span className="text-xs font-medium uppercase tracking-wide text-primary">10 latest</span>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
              {recentDeals.length ? (
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">Deal</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Value</th>
                      <th className="px-4 py-3">Stage</th>
                      <th className="px-4 py-3">Close Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-sm">
                    {recentDeals.map((deal) => (
                      <tr key={deal.id} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3 font-medium text-slate-800">{deal.name}</td>
                        <td className="px-4 py-3 text-slate-600">{deal.company}</td>
                        <td className="px-4 py-3 text-slate-800">{currencyFormatter.format(deal.value)}</td>
                        <td className="px-4 py-3">
                          <StageBadge stage={deal.stage} />
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(deal.closeDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState
                  title="No deals yet"
                  description="Keep an eye here as soon as you start logging opportunities."
                />
              )}
            </div>
          </div>

          <div className="section-card">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Top Companies</h2>
              <span className="text-xs font-medium uppercase tracking-wide text-success">By value</span>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
              {topCompanies.length ? (
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Industry</th>
                      <th className="px-4 py-3">Total Value</th>
                      <th className="px-4 py-3">Deals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-sm">
                    {topCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3 font-medium text-slate-800">{company.name}</td>
                        <td className="px-4 py-3 text-slate-600">{company.industry}</td>
                        <td className="px-4 py-3 text-slate-800">
                          {currencyFormatter.format(company.totalValue)}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{company.dealCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState
                  title="No companies yet"
                  description="Company leaderboards surface after your opportunities start flowing."
                />
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>DemoCRM • Crafted for immersive DemoForge walkthroughs</p>
          <p>React • Tailwind • Recharts • Lucide</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
