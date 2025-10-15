# DemoCRM - Product Requirements Document

**Version:** 1.0  
**Date:** October 15, 2025  
**Status:** Draft

---

## 1. Product Overview

**Product Name:** DemoCRM  
**Purpose:** A simple CRM dashboard that starts empty and can be populated with synthetic data to demonstrate DemoForge's agent workflow.

**Key Principle:** Keep it simple. No backend, no auth, no database. Just a React dashboard.

---

## 2. User Personas

**Primary User:** Demo presenters showing DemoForge capabilities  
**Secondary User:** Prospects evaluating DemoForge

---

## 3. Core Features

### 3.1 Dashboard Layout

Single page with four sections:

1. **KPI Cards Row** - 4 metric cards
2. **Charts Row** - Revenue chart (left) + Pipeline chart (right)
3. **Tables Row** - Recent deals (left) + Top companies (right)
4. **Header** - Simple branding

### 3.2 KPI Cards (4 total)

| Card | Label | Initial Value | Format |
|------|-------|---------------|--------|
| 1 | Total Revenue | $0 | Currency |
| 2 | Active Deals | 0 | Integer |
| 3 | Win Rate | 0% | Percentage |
| 4 | Monthly Growth | 0% | Percentage |

### 3.3 Revenue Trend Chart

- **Type:** Line chart
- **X-Axis:** Last 6 months
- **Y-Axis:** Revenue in dollars
- **Empty State:** "No revenue data yet"

### 3.4 Pipeline Funnel Chart

- **Type:** Funnel or horizontal bar
- **Stages:** New → Qualified → Proposal → Negotiation → Won
- **Shows:** Deal count and total value per stage
- **Empty State:** "No pipeline data"

### 3.5 Recent Deals Table

**Columns:**
- Deal Name
- Company
- Value
- Stage (color-coded badge)
- Close Date

**Limit:** Show 10 most recent  
**Empty State:** "No deals yet"

### 3.6 Top Companies Table

**Columns:**
- Company Name
- Industry
- Total Deal Value
- Number of Deals

**Limit:** Show top 10 by value  
**Empty State:** "No companies yet"

---

## 4. Data Model

### 4.1 Company
```
- id (string)
- name (string)
- industry (string)
- employees (number)
```

### 4.2 Deal
```
- id (string)
- name (string)
- company (string)
- value (number)
- stage (New|Qualified|Proposal|Negotiation|Won|Lost)
- probability (number 0-100)
- closeDate (YYYY-MM-DD)
```

### 4.3 Monthly Revenue Data
```
- month (string: "Jan", "Feb", etc.)
- revenue (number)
- deals (number)
```

---

## 5. Visual Design

### 5.1 Colors

**Stage Colors:**
- New: Gray
- Qualified: Blue
- Proposal: Yellow
- Negotiation: Orange
- Won: Green
- Lost: Red

**UI Colors:**
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Background: Light gray (#F9FAFB)

### 5.2 Layout

- **Width:** Full viewport, max-width 1400px centered
- **Cards:** 4 columns on desktop, stack on mobile
- **Charts:** 2 columns (60/40 split) on desktop, stack on mobile
- **Tables:** 2 columns (50/50) on desktop, stack on mobile

---

## 6. Empty vs Populated States

### 6.1 Empty State
- All KPIs show 0 or $0
- Charts show empty grids with placeholder text
- Tables show "No data" messages
- Everything is visible but empty

### 6.2 Populated State
- KPIs show real numbers
- Charts fill with data
- Tables show 10 rows each
- Dramatic visual transformation

---

## 7. Sample Data Specification

When populated, dashboard should show:
- **5 companies** across different industries
- **35 deals** distributed across all stages
- **6 months** of revenue data (April - September)
- **Total pipeline value:** ~$1,200,000 - $1,500,000

**Distribution:**
- Won: 4 deals
- Negotiation: 3 deals
- Proposal: 6 deals
- Qualified: 8 deals
- New: 12 deals
- Lost: 2 deals

---

## 8. Technical Requirements

### 8.1 Stack
- React
- Tailwind CSS
- Recharts (for charts)
- Lucide React (for icons)

### 8.2 State Management
- React useState only
- All data lives in component state
- No persistence needed

### 8.3 Responsiveness
- Mobile: 320px minimum width
- Tablet: 768px breakpoint
- Desktop: 1024px+ optimal

### 8.4 Performance
- Dashboard loads in < 1 second
- Smooth transitions when data updates

---

## 9. Out of Scope

These are explicitly NOT included in V1:
- User authentication
- Backend/API
- Database
- Data persistence
- Export functionality
- Filters or search
- Edit/delete capabilities
- Multiple dashboards
- Settings or preferences

---

## 10. Success Criteria

✅ Dashboard looks professional when empty  
✅ Dashboard looks impressive when populated  
✅ All charts and tables update instantly  
✅ Responsive on all screen sizes  
✅ Data structure is simple and clear  
✅ Visual transformation is dramatic

---

## 11. Acceptance Criteria

- [ ] All 4 KPI cards display correctly
- [ ] Revenue chart shows 6-month trend
- [ ] Pipeline chart shows 5 stages
- [ ] Deals table shows 10 rows max
- [ ] Companies table shows 10 rows max
- [ ] Empty states are clear and friendly
- [ ] All numbers calculate correctly
- [ ] Charts animate smoothly
- [ ] Works on mobile, tablet, desktop
- [ ] No console errors

---

**END OF DOCUMENT**