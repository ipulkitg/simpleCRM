import PropTypes from 'prop-types';

const EmptyState = ({ title, description }) => (
  <div className="empty-state">
    <h3 className="text-base font-semibold text-slate-600">{title}</h3>
    <p className="max-w-xs text-sm text-slate-500">{description}</p>
  </div>
);

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default EmptyState;
