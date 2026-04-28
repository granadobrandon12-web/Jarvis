/**
 * Shared constants — pipeline stages, task types, etc.
 */

export const PIPELINE_STAGES = [
  'New Prospect',
  'Audit Needed',
  'Audit Sent',
  'Contacted',
  'Call Booked',
  'Proposal Sent',
  'Closed Won',
  'Closed Lost',
  'Onboarding',
  'Active Client',
];

export const STAGE_COLOR = {
  'New Prospect':  'blue',
  'Audit Needed':  'amber',
  'Audit Sent':    'cyan',
  'Contacted':     'purple',
  'Call Booked':   'pink',
  'Proposal Sent': 'amber',
  'Closed Won':    'green',
  'Closed Lost':   'red',
  'Onboarding':    'cyan',
  'Active Client': 'green',
};

export const TASK_TYPES = [
  'Call', 'Follow-Up', 'Audit', 'Proposal', 'Onboarding', 'Client Work', 'Content',
];
export const TASK_PRIORITIES = ['High', 'Medium', 'Low'];
export const TASK_STATUSES = ['Open', 'In Progress', 'Done'];

export const AUDIT_STATUSES = ['Needed', 'In Progress', 'Sent', 'Reviewed'];

export const NICHES = [
  'Detailers', 'Landscapers', 'Pressure Washing', 'Window Tint',
  'Mobile Mechanics', 'Contractors', 'Roofers', 'Fencing',
  'Concrete', 'Cleaning', 'Pest Control', 'Insurance Agencies', 'Med Spas', 'Other',
];
