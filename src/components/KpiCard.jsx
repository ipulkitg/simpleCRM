import PropTypes from 'prop-types';
import KpiSparkline from './KpiSparkline.jsx';

const KpiCard = ({ icon: Icon, label, value, helper, trendData, trendColor, trendFormatter }) => (
  <div className="kpi-card">
    <div className="mb-4 flex items-center justify-between">
      <div className="rounded-full bg-primary/10 p-3 text-primary">
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </div>
      {helper ? <span className="text-sm text-slate-500">{helper}</span> : null}
    </div>
    <h3 className="text-sm font-medium text-slate-500">{label}</h3>
    <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    <div className="mt-5 h-16">
      <KpiSparkline data={trendData} color={trendColor} valueFormatter={trendFormatter} />
    </div>
  </div>
);

KpiCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  helper: PropTypes.string,
  trendData: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, value: PropTypes.number })).isRequired,
  trendColor: PropTypes.string,
  trendFormatter: PropTypes.func,
};

KpiCard.defaultProps = {
  helper: null,
  trendColor: '#3B82F6',
  trendFormatter: (value) => value,
};

export default KpiCard;
