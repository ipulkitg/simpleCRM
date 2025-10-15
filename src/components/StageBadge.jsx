import PropTypes from 'prop-types';

const stageColor = {
  New: 'bg-stage-new/15 text-stage-new',
  Qualified: 'bg-stage-qualified/15 text-stage-qualified',
  Proposal: 'bg-stage-proposal/15 text-stage-proposal',
  Negotiation: 'bg-stage-negotiation/15 text-stage-negotiation',
  Won: 'bg-stage-won/15 text-stage-won',
  Lost: 'bg-stage-lost/15 text-stage-lost',
};

const StageBadge = ({ stage }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${stageColor[stage] ?? 'bg-slate-200 text-slate-700'}`}
  >
    {stage}
  </span>
);

StageBadge.propTypes = {
  stage: PropTypes.string.isRequired,
};

export default StageBadge;
