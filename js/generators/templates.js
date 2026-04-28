/**
 * Studio generators — template-based, no external API.
 * Each generator: { id, label, icon, fields: [...], render: (values) => string }
 */

const v = (val, fallback = '—') => (val && String(val).trim() ? val : fallback);

export const GENERATORS = [
  // ---------------- Cold Call Script ----------------
  {
    id: 'cold-call',
    label: 'Cold Call Script',
    description: 'Direct, no-pitch opener built around a real problem you found.',
    fields: [
      { key: 'businessName', label: 'Business name', placeholder: 'Crystal Shine Detailing' },
      { key: 'ownerName',    label: 'Owner name',    placeholder: 'Marcus' },
      { key: 'niche',        label: 'Niche',         placeholder: 'Detailers' },
      { key: 'problem',      label: 'Problem found', placeholder: 'No missed call text back' },
      { key: 'website',      label: 'Website status',placeholder: 'Outdated' },
      { key: 'reviews',      label: 'Google reviews',placeholder: '38' },
      { key: 'goal',         label: 'Goal of call',  placeholder: 'Book a 10-min audit walkthrough' },
    ],
    render: (x) => `COLD CALL SCRIPT — ${v(x.businessName)}
================================================

OPENER (do not pitch — earn 30 seconds)
"Hey, is this ${v(x.ownerName, 'the owner')}? This is [Your Name] with Titan Automation.
Quick one — not a sales call. I work with ${v(x.niche, 'local service businesses')} in your area
and I noticed something on your end I think is costing you booked jobs.
Got 60 seconds for me to tell you what I saw?"

(if YES, continue)

PROBLEM CALLOUT
"So I looked at ${v(x.businessName)} — your Google has ${v(x.reviews, 'a handful of')} reviews,
your website looks ${v(x.website, 'fine')}, and the thing that jumped out at me is this:
${v(x.problem, 'leads going unanswered after-hours')}.

That one issue alone is usually worth 3 to 8 missed jobs a month for a ${v(x.niche, 'shop')} your size."

THE PIVOT
"What we install for guys like you is pretty simple:
 — A missed-call text-back so leads never sit cold
 — A review-request flow that runs on autopilot after every job
 — A follow-up system so web leads actually get worked
You don't change how you operate. We bolt this on around what you already do."

THE ASK
"${v(x.goal, 'I want to put together a quick audit')} — 10 minutes, on screen,
I show you exactly what's slipping and what I'd fix. No commitment.
Worth a look on Tuesday or Thursday afternoon?"

IF NOT INTERESTED
"Totally fair. Last thing — want me to text you the audit anyway so you've got it?
If it's useful you call me. If not, no harm done."

CLOSE
"Cool — sending the calendar link to ${v(x.businessName)} now. Talk soon."`,
  },

  // ---------------- Follow-Up Text ----------------
  {
    id: 'follow-up-text',
    label: 'Follow-Up Text',
    description: 'Short SMS that re-opens the loop without sounding desperate.',
    fields: [
      { key: 'ownerName',    label: 'Owner first name', placeholder: 'Marcus' },
      { key: 'businessName', label: 'Business',         placeholder: 'Crystal Shine Detailing' },
      { key: 'context',      label: 'Context / last touch', placeholder: 'Sent audit Tuesday' },
    ],
    render: (x) => `OPTION A — Soft check-in
Hey ${v(x.ownerName, 'there')}, [Your Name] with Titan Automation.
Following up on the audit I sent for ${v(x.businessName, 'your shop')} —
any questions or want me to walk you through it on a quick 10 min call?

OPTION B — Value-add
${v(x.ownerName, 'Hey')} — one quick thing. Just had another ${v(x.businessName, 'shop')}-style client recover
4 missed jobs in their first 2 weeks running our text-back system.
Still want me to set yours up the same way?

OPTION C — Final close
${v(x.ownerName, 'Hey')}, I'll stop bugging you after this 🙂
Are we doing this or should I close the file? Either way is good with me.`,
  },

  // ---------------- Follow-Up Email ----------------
  {
    id: 'follow-up-email',
    label: 'Follow-Up Email',
    description: 'Direct, scannable email with one clear CTA.',
    fields: [
      { key: 'ownerName',    label: 'Owner name', placeholder: 'Marcus' },
      { key: 'businessName', label: 'Business',   placeholder: 'Crystal Shine Detailing' },
      { key: 'problem',      label: 'Problem found', placeholder: 'Missed calls after-hours' },
      { key: 'package',      label: 'Recommended package', placeholder: 'Core + AI Voice' },
    ],
    render: (x) => `Subject: Quick fix for ${v(x.businessName, 'your shop')}

Hey ${v(x.ownerName, 'there')},

Following up on the audit I sent for ${v(x.businessName, 'your business')}.

The one thing I'd fix this week: ${v(x.problem, 'leads slipping through the cracks')}.
Most ${v(x.businessName, 'shops')} we work with recover the cost of the system in the first
2-3 weeks just from calls they used to miss.

Recommendation: ${v(x.package, 'Core Package')}.
Setup, dialed in, fully managed. You don't change how you run your day.

Want me to put 15 minutes on the calendar to walk through it?
[BOOKING LINK]

— [Your Name]
Titan Automation
We install lead capture and follow-up systems for local service businesses
so missed calls and web leads don't slip through the cracks.`,
  },

  // ---------------- Website Audit Script ----------------
  {
    id: 'audit-script',
    label: 'Website Audit Script',
    description: 'Loom-ready walkthrough script that converts the audit into a call.',
    fields: [
      { key: 'businessName', label: 'Business',  placeholder: 'BlueWave Pressure Washing' },
      { key: 'niche',        label: 'Niche',     placeholder: 'Pressure Washing' },
      { key: 'website',      label: 'Website',   placeholder: 'bluewavepw.com' },
      { key: 'problems',     label: 'Problems found', placeholder: 'No MCTB, slow mobile, few reviews' },
      { key: 'package',      label: 'Recommended package', placeholder: 'Core + AI Voice' },
    ],
    render: (x) => `AUDIT WALKTHROUGH — ${v(x.businessName)}
================================================
(Record as Loom — keep it under 4 minutes)

INTRO (15 sec)
"Hey ${v(x.businessName)} team — quick personalized audit.
I'm [Your Name] with Titan Automation. We help ${v(x.niche, 'local service')}
businesses stop losing missed calls, web leads, and review opportunities."

WHAT I LOOKED AT (45 sec)
"I went through ${v(x.website, 'your website')}, your Google profile, and your
contact form to see how a real lead would experience reaching you."

WHAT I FOUND (90 sec — be specific)
${v(x.problems, '— Missed call text back is not running\n— No review automation\n— Form leads are not getting nurtured')
  .split(/\n|,/).map(s => '— ' + s.trim()).join('\n')}

WHY IT MATTERS (30 sec)
"For a ${v(x.niche, 'shop')} your size, each one of these is usually worth
2-5 booked jobs a month. Combined, this is real revenue leaking out the back."

WHAT I'D FIX (45 sec)
"My recommendation is ${v(x.package, 'our Core Package')}.
We install missed-call text back, review automation, and a lead follow-up
system. We handle setup, you keep running your day."

CTA (20 sec)
"If this audit is useful, book a 15-min call at the link below.
I'll walk through exactly what your build would look like and what it costs."`,
  },

  // ---------------- Sales Proposal ----------------
  {
    id: 'proposal',
    label: 'Sales Proposal',
    description: 'Clean one-page proposal with package, scope, and price.',
    fields: [
      { key: 'businessName', label: 'Business',  placeholder: 'IronGate Fencing' },
      { key: 'niche',        label: 'Niche',     placeholder: 'Fencing' },
      { key: 'problems',     label: 'Problems', placeholder: 'No CRM, leads in gmail, no nurture' },
      { key: 'package',      label: 'Recommended package', placeholder: 'Core + AI Voice' },
      { key: 'price',        label: 'Price',     placeholder: '$1,700 setup / $600 monthly' },
      { key: 'timeline',     label: 'Timeline',  placeholder: '14 days to launch' },
    ],
    render: (x) => `PROPOSAL — ${v(x.businessName)}
Prepared by Titan Automation
================================================

THE SITUATION
${v(x.businessName)} is a ${v(x.niche, 'local service')} business with
real demand but lead-side leaks: ${v(x.problems, 'missed calls, slow follow-up, no review system')}.

THE FIX — ${v(x.package, 'Titan Core Package')}
We install a complete lead capture + follow-up system around your existing
operation. You keep running the business. We make sure no opportunity slips.

INCLUDED
• Professional website (or layered into existing site)
• Missed Call Text Back — replies in under 60 seconds
• Google Review automation — runs after every completed job
• Lead Follow-Up system — Day 0 / 1 / 3 / 7 nurture
• Monthly performance report
• Ongoing management & optimization
${(x.package || '').toLowerCase().includes('voice') ? `
• AI Voice Agent — answers calls 24/7, quotes services, books appointments` : ''}

INVESTMENT
${v(x.price, '$1,200 setup / $400 monthly')}
No long-term contract. Cancel any time after month 3.

TIMELINE
${v(x.timeline, '14 days from kickoff to live')}.
Week 1: setup + integrations.
Week 2: testing + owner training.

NEXT STEP
Reply "GO" or sign at the link below and we'll book the kickoff call.

— Titan Automation
We install lead capture and follow-up systems for local service businesses
so missed calls, website leads, and review opportunities do not slip through the cracks.`,
  },

  // ---------------- Facebook Post ----------------
  {
    id: 'fb-post',
    label: 'Facebook Post',
    description: 'Short post written to stop the scroll and book a call.',
    fields: [
      { key: 'topic',  label: 'Topic / hook', placeholder: 'Missed calls = lost jobs' },
      { key: 'niche',  label: 'Niche to target', placeholder: 'Detailers' },
    ],
    render: (x) => `${v(x.topic, 'Your missed calls are costing you jobs.').toUpperCase()}

Most ${v(x.niche, 'local service')} businesses are losing 4-8 booked jobs a month
to one thing: nobody answers, nobody texts back, and the lead moves on.

We fix that.

→ Missed Call Text Back (under 60 seconds)
→ Google review automation
→ Lead follow-up that actually runs

You keep doing the work. We make sure no opportunity slips through.

DM "AUDIT" and I'll show you exactly where you're leaking — free.

— Titan Automation`,
  },

  // ---------------- LinkedIn Post ----------------
  {
    id: 'li-post',
    label: 'LinkedIn Post',
    description: 'Authority-building LinkedIn post with a story arc.',
    fields: [
      { key: 'topic', label: 'Topic / angle', placeholder: 'How one detailer recovered 6 jobs in 30 days' },
    ],
    render: (x) => `${v(x.topic, 'How one local service business recovered 6 booked jobs in 30 days')}

Last month a client told me something I keep thinking about:

"I didn't know how many calls I was missing until you turned the system on."

Here's what we installed (it's not complicated):

1. Missed Call Text Back
   Every missed call gets a reply within 60 seconds.
   Most leads stop calling competitors right there.

2. Lead follow-up system
   Day 0, 1, 3, 7 — automatic.
   No more "I forgot to call them back."

3. Review automation
   Every completed job → review request.
   Their Google score went up. So did their inbound.

The result wasn't magic. It was math.
Stop leaking leads, and the same marketing budget produces more booked jobs.

If you run a local service business, you don't need more leads.
You need a system that doesn't drop the ones you already have.

— Titan Automation`,
  },

  // ---------------- GHL Workflow Map ----------------
  {
    id: 'ghl-map',
    label: 'GHL Workflow Map',
    description: 'Diagram-style map of GHL automations to build for a client.',
    fields: [
      { key: 'businessName', label: 'Business', placeholder: 'Crystal Shine Detailing' },
      { key: 'package',      label: 'Package',  placeholder: 'Core + AI Voice' },
    ],
    render: (x) => `GHL WORKFLOW MAP — ${v(x.businessName)} (${v(x.package, 'Core')})
================================================

PIPELINE
  New Lead → Contacted → Booked → Show → Won / Lost

WORKFLOWS

[1] MISSED CALL TEXT BACK
    Trigger: Missed inbound call
    Wait:    30s
    Action:  SMS — "Hey, this is ${v(x.businessName, 'us')}. Sorry we missed you —
             we'll call right back. What can we help with?"
    Then:    Internal SMS to owner + create lead in pipeline

[2] NEW LEAD NURTURE (Day 0 / 1 / 3 / 7)
    Trigger: New form submission OR pipeline = New Lead
    D0:      Auto-reply email + SMS w/ booking link
    D1:      SMS check-in
    D3:      Email value-add (case study or 1-pager)
    D7:      Final SMS — "Should I close the file or are we doing this?"

[3] REVIEW REQUEST
    Trigger: Pipeline = Won (job complete)
    Wait:    2h
    SMS:     "Thanks for choosing ${v(x.businessName, 'us')}!
              How'd we do? Tap below to leave a quick review."
    If 4★+:  Send Google review link
    If 3★-:  Route privately to owner inbox

[4] FORM ROUTING
    All website forms → pipeline = New Lead
    Tag with source (Web, FB, Google, Referral)

${(x.package || '').toLowerCase().includes('voice') ? `
[5] AI VOICE AGENT
    Trigger: Inbound call after-hours OR no answer in 4 rings
    AI answers, qualifies, quotes, books on calendar
    Hand-off: human takeover available via SMS keyword
` : ''}

CALENDARS
  Service appointments — link to GHL calendar
  Sales/discovery — separate calendar for owner

TAGS
  source-web, source-fb, source-google, source-referral
  status-quoted, status-booked, status-won, status-lost`,
  },

  // ---------------- Client Monthly Report ----------------
  {
    id: 'monthly-report',
    label: 'Client Monthly Report',
    description: 'Plain-English monthly report a client can actually read.',
    fields: [
      { key: 'businessName', label: 'Business',  placeholder: 'Sunrise Mobile Detailing' },
      { key: 'month',        label: 'Month',     placeholder: 'April 2026' },
      { key: 'missedCalls',  label: 'Missed calls recovered', placeholder: '14' },
      { key: 'reviews',      label: 'New reviews', placeholder: '11' },
      { key: 'leads',        label: 'New leads captured', placeholder: '47' },
      { key: 'wins',         label: 'Wins this month', placeholder: 'AI Voice booked 6 jobs after-hours' },
      { key: 'next',         label: 'Focus for next month', placeholder: 'Add retargeting on web visitors' },
    ],
    render: (x) => `MONTHLY REPORT — ${v(x.businessName)}
${v(x.month, 'This Month')}
================================================

THE HEADLINE
This month your system recovered ${v(x.missedCalls, 'X')} missed calls,
captured ${v(x.leads, 'Y')} new leads, and generated ${v(x.reviews, 'Z')} new reviews.

WHAT THE NUMBERS LOOK LIKE
• Missed calls recovered:  ${v(x.missedCalls, 'X')}
• New leads captured:      ${v(x.leads, 'Y')}
• Reviews generated:       ${v(x.reviews, 'Z')}
• Pipeline movement:       healthy

WINS
${v(x.wins, '— Strong response on the new follow-up flow').split(/\n|,/).map(s => '— ' + s.trim()).join('\n')}

WHAT WE'RE WORKING ON NEXT
${v(x.next, '— Tightening the review request copy').split(/\n|,/).map(s => '— ' + s.trim()).join('\n')}

QUESTIONS?
Reply to this email or text us back — we'll get on it.

— Titan Automation`,
  },

  // ---------------- Objection Handling ----------------
  {
    id: 'objection',
    label: 'Objection Handling',
    description: 'Reframe + close response for any common objection.',
    fields: [
      { key: 'objection', label: 'The objection', placeholder: 'Too expensive' },
      { key: 'businessName', label: 'Business', placeholder: 'Crystal Shine Detailing' },
    ],
    render: (x) => `OBJECTION: "${v(x.objection, 'Too expensive')}"
Business: ${v(x.businessName, 'Prospect')}
================================================

ACKNOWLEDGE (don't fight it)
"Totally fair — that's an honest reaction and I respect it."

REFRAME
"Here's how I think about it for a business like ${v(x.businessName, 'yours')}:
the system pays for itself the moment it recovers ONE missed job that
would have slipped. Most of our clients clear that in the first 2-3 weeks."

EVIDENCE
"Last client in your space recovered 4 missed jobs in their first 14 days
just from the text-back system. The math worked itself out."

REDIRECT TO ACTION
"So the real question isn't price — it's whether the leak is real.
Want me to show you, on screen, exactly what's slipping right now?
If the answer is 'not much' you walk. If it's a lot, we have a clear
conversation about what's worth fixing."

CLOSE
"Tuesday or Thursday afternoon for a 10-min look?"`,
  },
];

export function getGenerator(id) {
  return GENERATORS.find(g => g.id === id);
}
