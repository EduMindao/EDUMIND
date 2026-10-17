# EduMind Security Specification

## 1. Data Invariants
- Each user profile document path `/users/{userId}` MUST have `userId == request.auth.uid`.
- Unauthenticated requests have zero read or write access to `/users/{userId}`.
- Authenticated users cannot read or write another user's profile document (`request.auth.uid == userId`).
- A user cannot change their own `uid` once created (`incoming().uid == existing().uid`).
- Required fields for profile creation: `uid`, `name`, `email`, `role`, `studyGoal`, `educationLevel`.
- Text field length constraints:
  - `name`: 2 to 100 characters.
  - `email`: 3 to 150 characters.
  - `role`: one of `['estudante', 'vestibulando', 'universitario', 'concurseiro', 'professor']`.
  - `studyGoal`: 2 to 100 characters.
  - `educationLevel`: 2 to 50 characters.

## 2. The "Dirty Dozen" Attack Payloads (Must be rejected)
1. **Unauthenticated Read**: Anonymous/guest tries to read `/users/user123` -> Rejected (`request.auth == null`).
2. **Unauthenticated Write**: Anonymous/guest tries to write `/users/user123` -> Rejected (`request.auth == null`).
3. **Cross-User Snooping**: Authenticated user `attacker_id` tries to read `/users/victim_id` -> Rejected (`request.auth.uid != victim_id`).
4. **Cross-User Impersonation Write**: Authenticated user `attacker_id` tries to overwrite `/users/victim_id` -> Rejected (`request.auth.uid != victim_id`).
5. **UID Spoofing**: Authenticated user `user123` sets `uid: "admin_super"` in body -> Rejected (`incoming().uid != request.auth.uid`).
6. **UID Tampering on Update**: Authenticated user `user123` tries to change `uid` to `user456` -> Rejected (`incoming().uid == existing().uid`).
7. **Junk Path ID / ID Poisoning**: Trying to access a path with an invalid document ID (e.g. 200+ characters or malicious symbols) -> Rejected (`isValidId(userId)`).
8. **Shadow Field Injection**: Payload contains ghost field like `{ isAdmin: true }` or `{ subscription: "unlimited" }` -> Rejected (`hasOnly(...)`).
9. **Role Escalation**: Setting `role: "system_admin"` -> Rejected (role must be in enum `['estudante', 'vestibulando', 'universitario', 'concurseiro', 'professor']`).
10. **Denial-of-Wallet String Bomb**: Submitting a 1MB string in `name` or `studyGoal` -> Rejected (`size() <= 100`).
11. **Empty Field Bypass**: Submitting empty strings for `name` or `studyGoal` -> Rejected (`size() >= 2`).
12. **Blanket Collection Scraping**: User attempts `users` collection query without matching UID -> Rejected (`allow list` restricted to matching owner).
