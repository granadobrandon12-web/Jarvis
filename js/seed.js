/**
 * Initial mock data for Titan HQ.
 * Replace later when Supabase / GHL is wired up.
 */

const today = new Date();
const offset = (days) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const seed = {
  settings: {
    agencyName: 'Titan Automation',
    appName: 'Titan HQ',
    monthlyGoal: 50000,
    positioning:
      'We install lead capture and follow-up systems for local service businesses so missed calls, website leads, and review opportunities do not slip through the cracks.',
    targetNiches: [
      'Detailers', 'Landscapers', 'Pressure Washing', 'Window Tint',
      'Mobile Mechanics', 'Contractors', 'Roofers', 'Fencing',
      'Concrete', 'Cleaning', 'Pest Control', 'Insurance Agencies', 'Med Spas',
    ],
    offer: {
      core: {
        name: 'Titan Core Package',
        setup: 1200,
        monthly: 400,
        includes: [
          'Professional website',
          'Missed call text back',
          'Google review automation',
          'Lead follow-up system',
          'Monthly performance report',
          'Ongoing management',
        ],
      },
      addon: {
        name: 'AI Voice Agent',
        setup: 500,
        monthly: 200,
        includes: [
          'Answers calls 24/7',
          'Answers questions',
          'Helps quote services',
          'Helps book appointments',
        ],
      },
    },
  },

  prospects: [
    {
      id: 'p_001', createdAt: new Date().toISOString(),
      businessName: 'Crystal Shine Detailing', ownerName: 'Marcus Hall',
      phone: '(555) 213-9087', email: 'marcus@crystalshine.co',
      website: 'crystalshine.co', niche: 'Detailers',
      city: 'Austin', state: 'TX',
      googleReviews: 38, websiteStatus: 'Outdated',
      problemFound: 'No missed call text back, slow form follow-up',
      auditStatus: 'Needed',
      lastContacted: offset(-3), nextFollowUp: offset(1),
      packageRecommended: 'Core + AI Voice',
      stage: 'Audit Needed',
      notes: 'Owner is hands-on, runs solo. Books out 3 weeks.',
    },
    {
      id: 'p_002', createdAt: new Date().toISOString(),
      businessName: 'Greenline Lawn Care', ownerName: 'Tasha Wright',
      phone: '(555) 882-4421', email: 'tasha@greenlinelawn.com',
      website: 'greenlinelawn.com', niche: 'Landscapers',
      city: 'Charlotte', state: 'NC',
      googleReviews: 92, websiteStatus: 'OK',
      problemFound: 'Missing reviews automation, no after-hours capture',
      auditStatus: 'Sent',
      lastContacted: offset(-1), nextFollowUp: offset(2),
      packageRecommended: 'Core',
      stage: 'Audit Sent',
      notes: 'Open to call next Tuesday afternoon.',
    },
    {
      id: 'p_003', createdAt: new Date().toISOString(),
      businessName: 'BlueWave Pressure Washing', ownerName: 'Diego Ramos',
      phone: '(555) 661-7711', email: 'diego@bluewavepw.com',
      website: 'bluewavepw.com', niche: 'Pressure Washing',
      city: 'Tampa', state: 'FL',
      googleReviews: 17, websiteStatus: 'Slow on mobile',
      problemFound: 'Few reviews, missed calls Monday mornings',
      auditStatus: 'Sent',
      lastContacted: offset(-5), nextFollowUp: offset(0),
      packageRecommended: 'Core + AI Voice',
      stage: 'Contacted',
      notes: 'Said budget is tight but interested.',
    },
    {
      id: 'p_004', createdAt: new Date().toISOString(),
      businessName: 'TintMasters', ownerName: 'Aaron Lee',
      phone: '(555) 432-1098', email: 'aaron@tintmasters.io',
      website: 'tintmasters.io', niche: 'Window Tint',
      city: 'Phoenix', state: 'AZ',
      googleReviews: 124, websiteStatus: 'Modern',
      problemFound: 'Slow follow-up on web leads, no review request flow',
      auditStatus: 'Sent',
      lastContacted: offset(-2), nextFollowUp: offset(0),
      packageRecommended: 'Core',
      stage: 'Call Booked',
      notes: 'Demo scheduled — wants to see the GHL workflow.',
    },
    {
      id: 'p_005', createdAt: new Date().toISOString(),
      businessName: 'IronGate Fencing', ownerName: 'Riley Mendez',
      phone: '(555) 220-5544', email: 'riley@irongatefence.com',
      website: 'irongatefence.com', niche: 'Fencing',
      city: 'Dallas', state: 'TX',
      googleReviews: 54, websiteStatus: 'Outdated',
      problemFound: 'No CRM, leads going to gmail, no nurture',
      auditStatus: 'Sent',
      lastContacted: offset(-1), nextFollowUp: offset(3),
      packageRecommended: 'Core + AI Voice',
      stage: 'Proposal Sent',
      notes: 'Sent proposal at $1,200/$400 + $500/$200 AI Voice.',
    },
    {
      id: 'p_006', createdAt: new Date().toISOString(),
      businessName: 'PeakRoof Pros', ownerName: 'Elena Park',
      phone: '(555) 909-3333', email: 'elena@peakroofpros.com',
      website: 'peakroofpros.com', niche: 'Roofers',
      city: 'Denver', state: 'CO',
      googleReviews: 71, websiteStatus: 'OK',
      problemFound: 'Storm season — leads coming in faster than they answer',
      auditStatus: 'Needed',
      lastContacted: '', nextFollowUp: offset(0),
      packageRecommended: 'Core + AI Voice',
      stage: 'New Prospect',
      notes: 'Cold outbound today — referral from Jake.',
    },
    {
      id: 'p_007', createdAt: new Date().toISOString(),
      businessName: 'ClearChoice Pest Control', ownerName: 'Brian Cole',
      phone: '(555) 443-7766', email: 'brian@clearchoicepest.com',
      website: 'clearchoicepest.com', niche: 'Pest Control',
      city: 'Houston', state: 'TX',
      googleReviews: 210, websiteStatus: 'Modern',
      problemFound: 'Manual review requests, low conversion on web form',
      auditStatus: 'Sent',
      lastContacted: offset(-7), nextFollowUp: offset(-1),
      packageRecommended: 'Core',
      stage: 'Onboarding',
      notes: 'Signed last week — kickoff call done.',
    },
  ],

  tasks: [
    {
      id: 't_001', createdAt: new Date().toISOString(),
      title: 'Call BlueWave PW back', description: 'They asked to be called Monday AM.',
      prospectId: 'p_003', dueDate: offset(0), priority: 'High',
      status: 'Open', type: 'Call',
    },
    {
      id: 't_002', createdAt: new Date().toISOString(),
      title: 'Send audit to PeakRoof Pros', description: 'Build website + GBP audit.',
      prospectId: 'p_006', dueDate: offset(0), priority: 'High',
      status: 'Open', type: 'Audit',
    },
    {
      id: 't_003', createdAt: new Date().toISOString(),
      title: 'Follow up with TintMasters', description: 'Confirm demo time.',
      prospectId: 'p_004', dueDate: offset(0), priority: 'Medium',
      status: 'Open', type: 'Follow-Up',
    },
    {
      id: 't_004', createdAt: new Date().toISOString(),
      title: 'Build proposal for IronGate Fencing', description: 'Core + AI Voice quote.',
      prospectId: 'p_005', dueDate: offset(1), priority: 'Medium',
      status: 'In Progress', type: 'Proposal',
    },
    {
      id: 't_005', createdAt: new Date().toISOString(),
      title: 'Onboarding kickoff — ClearChoice', description: 'GHL workflow + website handoff.',
      prospectId: 'p_007', dueDate: offset(2), priority: 'High',
      status: 'In Progress', type: 'Onboarding',
    },
    {
      id: 't_006', createdAt: new Date().toISOString(),
      title: 'Post LinkedIn case study', description: 'Missed call text back ROI.',
      prospectId: '', dueDate: offset(0), priority: 'Low',
      status: 'Open', type: 'Content',
    },
  ],

  clients: [
    {
      id: 'c_001', createdAt: new Date().toISOString(),
      businessName: 'Sunrise Mobile Detailing', ownerName: 'Kara Yoon',
      package: 'Core + AI Voice', monthlyRetainer: 600, setupFee: 1700,
      startDate: offset(-45),
      services: 'Website, MCTB, Reviews Auto, Lead Follow-up, AI Voice',
      websiteStatus: 'Live', ghlStatus: 'Live',
      reviewAutoStatus: 'Live', mctbStatus: 'Live',
      monthlyReportStatus: 'On track',
      notes: 'Loves the AI voice. Asked about retargeting.',
    },
    {
      id: 'c_002', createdAt: new Date().toISOString(),
      businessName: 'GreenAcre Landscaping', ownerName: 'Pete Halloway',
      package: 'Core', monthlyRetainer: 400, setupFee: 1200,
      startDate: offset(-92),
      services: 'Website, MCTB, Reviews Auto, Lead Follow-up',
      websiteStatus: 'Live', ghlStatus: 'Live',
      reviewAutoStatus: 'Live', mctbStatus: 'Live',
      monthlyReportStatus: 'Sent',
      notes: 'Wants to add AI Voice next month.',
    },
    {
      id: 'c_003', createdAt: new Date().toISOString(),
      businessName: 'AlphaTint Studio', ownerName: 'Jordan Reyes',
      package: 'Core', monthlyRetainer: 400, setupFee: 1200,
      startDate: offset(-14),
      services: 'Website, MCTB, Reviews Auto, Lead Follow-up',
      websiteStatus: 'Live', ghlStatus: 'Live',
      reviewAutoStatus: 'Live', mctbStatus: 'In Progress',
      monthlyReportStatus: 'Pending',
      notes: 'Onboarding nearly done.',
    },
  ],

  notes: [
    {
      id: 'n_001', updatedAt: new Date().toISOString(),
      category: 'Offer',
      title: 'Current Offer',
      body:
`Core Package — $1,200 setup / $400/mo
- Professional website
- Missed call text back
- Google review automation
- Lead follow-up system
- Monthly performance report
- Ongoing management

Add-on — AI Voice Agent — $500 setup / $200/mo
- Answers calls 24/7
- Answers questions
- Helps quote services
- Helps book appointments`,
    },
    {
      id: 'n_002', updatedAt: new Date().toISOString(),
      category: 'Pricing',
      title: 'Pricing Notes',
      body:
`Core: $1,200 / $400
AI Voice: $500 / $200
Bundle: $1,700 / $600
Annual prepay: -10% on monthly`,
    },
    {
      id: 'n_003', updatedAt: new Date().toISOString(),
      category: 'Niches',
      title: 'Target Niches',
      body:
`Detailers, Landscapers, Pressure Washing, Window Tint,
Mobile Mechanics, Contractors, Roofers, Fencing,
Concrete, Cleaning, Pest Control, Insurance Agencies, Med Spas.

Best response so far: Detailers, Roofers, Pressure Washing.`,
    },
    {
      id: 'n_004', updatedAt: new Date().toISOString(),
      category: 'Scripts',
      title: 'Universal Cold Call Script',
      body:
`Hey, is this {OWNER}? This is {YOUR_NAME} with Titan Automation —
quick one, not a sales pitch. Reason I called: I help {NICHE} stop losing
missed calls and web leads. I noticed {PROBLEM} on your end —
do you have 60 seconds for me to show you what I'd fix?`,
    },
    {
      id: 'n_005', updatedAt: new Date().toISOString(),
      category: 'Objections',
      title: 'Objection Handling',
      body:
`"Not interested" → Totally fair. Real quick — if I could show you how to
recover the calls you're already missing without changing how you operate,
worth a 10 min look?

"Too expensive" → Most clients recover the monthly cost from one extra
booked job. Want me to send a 1-pager that breaks it down?

"Already have a website" → Perfect — most of our value is the systems
behind it. We'll layer in without rebuilding what works.

"I'll think about it" → Got it. Want me to follow up Friday with the audit
so you have something to think over?`,
    },
    {
      id: 'n_006', updatedAt: new Date().toISOString(),
      category: 'SOPs',
      title: 'GHL Setup SOP',
      body:
`1. Create sub-account, set timezone + business hours.
2. Import contacts CSV. Tag by source.
3. Pipelines: New Lead → Contacted → Booked → Show → Won/Lost.
4. Workflows:
   - Missed Call Text Back (under 60s)
   - New Lead Nurture (Day 0/1/3/7)
   - Review Request after job completion
5. Calendar: connect Google, set service hours.
6. Forms/website widgets connected to pipeline.
7. Test end-to-end with owner's number.`,
    },
    {
      id: 'n_007', updatedAt: new Date().toISOString(),
      category: 'SOPs',
      title: 'Existing Website Integration SOP',
      body:
`If client keeps their site:
- Add chat widget + call tracking number
- Replace contact form with GHL form (preserve fields)
- Add review schema markup
- Verify forms route into pipeline + nurture
- Document what we touched in the client folder`,
    },
    {
      id: 'n_008', updatedAt: new Date().toISOString(),
      category: 'SOPs',
      title: 'Missed Call Text Back SOP',
      body:
`Trigger: missed inbound call
Wait: 30 seconds
Action: Send SMS — "Hey, this is {BUSINESS}. Sorry we missed you —
we'll call right back. What can we help with?"
Owner alert via internal SMS.
Reply routes to inbox + auto-reply with appointment link.`,
    },
    {
      id: 'n_009', updatedAt: new Date().toISOString(),
      category: 'SOPs',
      title: 'Google Review Automation SOP',
      body:
`Trigger: Job marked complete
Wait: 2 hours (let the customer settle)
Step 1: SMS thank-you with review link
Step 2 (if no review in 48h): Email follow-up with star buttons
Step 3 (if 4+): Direct to Google review URL
Step 3 (if 3 or less): Route privately to owner inbox.`,
    },
    {
      id: 'n_010', updatedAt: new Date().toISOString(),
      category: 'Onboarding',
      title: 'Client Onboarding Checklist',
      body:
`[ ] Welcome email + calendar link
[ ] Kickoff call (30 min)
[ ] Brand assets + logins collected
[ ] Domain DNS confirmed
[ ] GHL sub-account live
[ ] Website live or layered in
[ ] MCTB tested with owner
[ ] Review automation tested
[ ] Lead nurture flows tested
[ ] Owner trained (15 min Loom)
[ ] Day 30 check-in scheduled`,
    },
    {
      id: 'n_011', updatedAt: new Date().toISOString(),
      category: 'Reports',
      title: 'Monthly Report Template',
      body:
`This month for {BUSINESS}:
- Missed calls recovered: {X}
- Reviews requested: {Y}, new reviews: {Z}
- New leads captured: {N}
- Estimated jobs assisted: {J}
- Wins: {bullets}
- Next month focus: {bullets}`,
    },
    {
      id: 'n_012', updatedAt: new Date().toISOString(),
      category: 'Content',
      title: 'Content Ideas',
      body:
`- "Your missed calls are leaking $X/mo — here's the fix in 3 mins"
- Before/after: dead website vs. lead-capture website
- Pinned LinkedIn post: case study with numbers
- Reels: AI voice answering a real call
- Carousels: 5 mistakes local service businesses make`,
    },
  ],

  jarvisHistory: [],
};
