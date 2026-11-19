# PocketMoney — Product Requirements Document (MVP)

## 1. Overview

**PocketMoney** is a minimalist web app that helps children ages 10–15 track their own money: income, expenses, and a simple running balance.

Kids often receive allowance or gifts and spend on food, games, or other everyday things without a clear picture of what they have left. PocketMoney gives them one place to log amounts by category and date/time, see their balance, and understand how much they spent (and received) this week — without budgets, charts, or bank connections.

**MVP success:** A signed-in user can add their first transaction (amount, category, date/time) and see an updated balance and weekly summary in under one minute, on a simple English-only UI.

| Area | Decision |
|------|----------|
| Product | PocketMoney |
| Audience | Children 10–15 |
| Platform | Web application |
| Auth | Auth0 (email or social); kid self-signup / login |
| Database | MongoDB |
| Currency | EUR only |
| Language | English UI only |
| Categories | Fixed starter set (see below) |
| UI | Minimalist, super simple, kid-friendly |

---

## 2. Goals and non-goals

### Goals (MVP)

- Let kids sign up, log in, and log out on their own via Auth0 (email or social).
- Let kids add income and expense transactions with amount, category, and date/time.
- Show a clear running balance (total income − total expenses).
- Show a transaction list newest-first, with edit and delete.
- Allow filtering by date range and/or category.
- Show a simple weekly summary (e.g. spent this week; income this week for clarity).
- Keep the UI minimal, plain-language, and easy for ages 10–15.

### Non-goals (explicitly out of MVP)

- Budgets or spending limits
- Savings goals
- Charts or graphs
- Bank sync / real bank accounts
- Sharing with parents or friends
- Multiple wallets or accounts per user
- Custom or user-defined categories
- Multi-currency
- Internationalization (non-English UI)
- Parental dashboards or parental account management

---

## 3. Personas / users

### Primary: Kid user (10–15)

- Has their own Auth0 account (email or social).
- Tracks pocket money, gifts, and everyday spending.
- Needs large, clear controls and everyday words (“Money in”, “Money out”), not finance jargon.

### Not in MVP

- Parents as a separate role or dashboard. Any authenticated user is treated as the kid account owner.

---

## 4. User stories

1. **Sign up / log in** — As a kid, I can create an account or log in with email or social via Auth0 so my money data stays private to me.
2. **Log out** — As a kid, I can log out so others on the same device cannot see my balance.
3. **Add income** — As a kid, I can add money I received (amount, category, date/time) so my balance goes up.
4. **Add expense** — As a kid, I can add money I spent (amount, category, date/time) so my balance goes down.
5. **See balance** — As a kid, I can see my current balance so I know how much I have left.
6. **See weekly summary** — As a kid, I can see how much I spent (and received) this week so I understand recent activity.
7. **Browse transactions** — As a kid, I can see my transactions newest-first so I can find recent entries quickly.
8. **Edit transaction** — As a kid, I can fix a mistake in amount, category, type, or date/time.
9. **Delete transaction** — As a kid, I can remove a wrong entry (with confirmation) so my balance stays correct.
10. **Filter** — As a kid, I can filter by date range and/or category so I can focus on what I care about.

---

## 5. Functional requirements

### Auth

- **FR-1** The app shall require Auth0 authentication for all money data screens.
- **FR-2** The app shall support kid self-signup and login via email and/or social providers configured in Auth0.
- **FR-3** The app shall allow the user to log out and clear the session.
- **FR-4** Unauthenticated users shall only access a login/landing entry point (no transaction data).

### Transactions

- **FR-5** The user shall create a transaction with: type (`income` | `expense`), amount (EUR), category (from fixed set), and occurred date/time.
- **FR-6** On create, date/time shall default to “now” (user’s local time) and be editable before save.
- **FR-7** Amount shall be a positive value greater than zero; the type field determines income vs expense.
- **FR-8** The user shall edit any field of their own transaction and save changes.
- **FR-9** The user shall delete their own transaction after an explicit confirmation step.
- **FR-10** Users shall only create, read, update, or delete their own transactions (scoped by Auth0 user id).

### Balance and summary

- **FR-11** The home view shall show **running balance** = sum(income amounts) − sum(expense amounts) for all of the user’s transactions (unfiltered).
- **FR-12** The home view shall show a **this week** summary:
  - Total spent this week (sum of expenses in the current calendar week)
  - Total received this week (sum of income in the current calendar week)
- **FR-13** “This week” shall mean Monday 00:00:00 through Sunday 23:59:59.999 in the user’s local timezone.

### List and filters

- **FR-14** The transaction list shall sort by `occurredAt` descending (newest first).
- **FR-15** The user shall filter the list by optional date range (from and/or to) and/or category.
- **FR-16** Filters shall not change the running balance (balance remains all-time); the list and (if shown under filters) filtered totals may reflect the filter. Weekly summary remains calendar-week based and independent of list filters unless the product UI places filtered totals only on the list section.
- **FR-17** Empty states shall show a short, friendly message and a clear call-to-action to add the first transaction.

### Categories (fixed)

- **FR-18** Categories shall be exactly this fixed set (no create/edit/delete of categories in MVP):
  - Allowance
  - Gifts
  - Food
  - Games
  - Savings
- **FR-19** Any category may be selected for either income or expense. Typical use (guidance only, not enforced): Allowance and Gifts → income; Food and Games → expense; Savings → either.

### Currency and language

- **FR-20** All amounts shall be EUR only; display with a euro symbol (e.g. `€12.50`).
- **FR-21** All UI copy shall be English only.

---

## 6. Data model (high level)

### User

Identity comes from Auth0. Persist a minimal local user record if needed for references:

| Field | Notes |
|-------|--------|
| `auth0Sub` | Auth0 subject (`sub`); primary link to the account |
| `createdAt` | Account first seen / created |
| `updatedAt` | Last profile sync / update |

Store only what is required to associate transactions; avoid collecting extra PII beyond Auth0.

### Transaction

| Field | Type / notes |
|-------|----------------|
| `_id` | MongoDB ObjectId |
| `userId` | Auth0 `sub` (or local user id referencing `auth0Sub`) |
| `type` | `"income"` \| `"expense"` |
| `amountCents` | Integer ≥ 1 (store cents to avoid float errors; `€12.50` → `1250`) |
| `category` | One of: `Allowance`, `Gifts`, `Food`, `Games`, `Savings` |
| `occurredAt` | DateTime of the transaction (user-facing date + time) |
| `createdAt` | Server timestamp |
| `updatedAt` | Server timestamp |

**Indexes (recommended):** `{ userId: 1, occurredAt: -1 }`; optional `{ userId: 1, category: 1, occurredAt: -1 }` for filtered queries.

---

## 7. UX principles

- **Few screens, one job each** — Home for glance + list; one form for add/edit; filters as a simple overlay or section, not a separate complex tool.
- **Plain language** — Prefer “Money in” / “Money out” (or clear Income / Expense labels) over jargon.
- **Clear money direction** — Income and expense visually distinct (e.g. different label/color treatment) without clutter.
- **Large tap targets** — Suitable for younger users and mobile browsers.
- **Minimal chrome** — No dashboards of widgets; balance + weekly summary + list + primary “Add” action.
- **Safe deletes** — Confirm before delete; no silent removal.
- **Readable amounts** — Always show EUR formatting consistently.

---

## 8. Screen map

```text
[Login / Landing]
       │  Auth0
       ▼
[Home]
  • Balance (all-time)
  • This week: spent / received
  • Transaction list (newest first)
  • Primary CTA: Add transaction
  • Entry to Filters
  • Log out
       │
       ├──► [Add / Edit transaction]
       │      type, amount, category, date + time
       │      Save / Cancel
       │
       └──► [Filters]
              date from / to, category
              Apply / Clear
```

Delete confirmation may be a modal on Home or Edit, not a separate route.

---

## 9. Tech constraints

- **Platform:** Web application
- **Auth:** Auth0 (email and/or social); kid self-serve signup/login
- **Database:** MongoDB
- **Currency:** EUR only; amounts stored as integer cents
- **i18n:** English UI only
- **Categories:** Fixed enum as listed above
- **Frontend framework:** Not pinned in this PRD; choose during implementation

---

## 10. Edge cases and rules

| Case | Expected behavior |
|------|-------------------|
| No transactions yet | Friendly empty state; balance `€0.00`; weekly totals `€0.00`; CTA to add |
| Amount ≤ 0 or non-numeric | Block save; show clear validation message |
| Amount with more than 2 decimal places | Round or reject per implementation; display always 2 decimals |
| Missing category or type | Block save |
| Future date/time | Allowed (e.g. planned allowance); still counts in balance and in “this week” only if it falls in the current week |
| Delete | Require confirmation; then remove and refresh balance/list/summary |
| Filter with no matches | Empty filtered list message; balance unchanged |
| Session expired | Redirect to login; no data leak |
| Timezone for “this week” | Use user’s local timezone; week starts Monday |

---

## 11. Privacy and kids (MVP note)

- Target users are ages **10–15**. Accounts are created and used by the kid via Auth0.
- Collect and store **minimal** personal data (Auth0 identity + transactions only).
- Do not add parental sharing or extra profile fields in MVP.
- **Launch follow-up (out of MVP build scope):** Before a public launch aimed at minors, review applicable age/consent and privacy requirements (e.g. regional rules, Auth0 age/consent settings, terms and privacy policy). This PRD does not provide legal advice.

---

## 12. Success metrics and open questions

### Success metrics (MVP)

- A new user can complete signup/login and first transaction in **under 1 minute**.
- After first transaction, balance and weekly summary update correctly without refresh confusion.
- Users can edit and delete without losing other transactions.
- Filters return the expected subset; clearing filters restores the full list.

### Open questions (implementation / later)

- Exact Auth0 social providers (Google, Apple, etc.)
- Whether weekly summary should stay visible when filters are applied (recommended: yes, keep week summary independent)
- Hosting and framework choice
- Soft-delete vs hard-delete for transactions (default: hard-delete for MVP simplicity)
