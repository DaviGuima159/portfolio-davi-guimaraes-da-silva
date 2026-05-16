# Security Specification - Qr Forge

## Data Invariants
1. A QR Code save cannot exist without a valid User ID in the path.
2. Only the owner of the vault can read, create, update, or delete their history.
3. QR Code IDs must be alphanumeric and sanitized.
4. User profiles are private to the owner.

## The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Attempting to create a QR code in User A's vault with `authorId` set to User B.
2. **Resource Poisoning**: Creating a QR code with a 1MB string in the `data` field.
3. **Ghost Field Injection**: Adding an `isAdmin: true` field to the user profile.
4. **Unauthorized Read**: User B attempting to list User A's QR history.
5. **ID Injection**: Using `../../bad-id` as a `qrId`.
6. **Malicious Update**: User B trying to update User A's `isFavorite` status.
7. **Type Poisoning**: Sending `timestamp` as a string instead of a number.
8. **Shadow Field Creation**: Including extra metadata fields not defined in the schema.
9. **Unverified Auth**: Attempting writes with an unverified email (if email verification is forced).
10. **State Corruption**: Changing the `id` of a QR code during an update.
11. **PII Exposure**: Trying to read another user's profile which contains their email.
12. **Orphaned Write**: Creating a history item without a matching user path (impossible by path structure but checked via auth).

## Verification Strategy
We will use hard-coded rules that verify the `auth.uid` against the path variable `userId`.
All writes will pass through `isValid[Entity]` checks.
