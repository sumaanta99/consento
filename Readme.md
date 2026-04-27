# Consento

> Permissioned data sharing workflows for modern apps

![npm version](https://img.shields.io/npm/v/consento)
![license](https://img.shields.io/npm/l/consento)

Consento is a headless TypeScript SDK for building **approval-based, multi-party data sharing flows** with cryptographic guarantees.

Consento helps you implement patterns like:

- “Can I share this contact with someone?”
- “Approve before sending sensitive data”
- “Introduce me to this person”
- “Unlock user details after consent”

---

## ✨ Why Consento?

Many real-world apps need controlled sharing:

- Messaging apps → share contacts
- Marketplaces → unlock buyer/seller info
- Social apps → introductions/referrals
- Privacy-first apps → consent-driven data exchange

These flows are:

- asynchronous  
- multi-party  
- stateful  
- easy to get wrong  
- hard to secure  

Consento gives you a **simple, deterministic protocol** to handle them.

---

## 🧠 Core Concept

Consento models sharing as a **state machine**:
REQUESTED → APPROVED → RELAYED

### Flow

1. A user requests to share something
2. Another user approves the request
3. The data is securely delivered to a destination

---

## 🔐 Security Model

Consento includes built-in security guarantees:

- ✅ **Ed25519 signatures** → ensures authenticity  
- ✅ **Tamper-proof bundles** → payload integrity  
- ✅ **Destination-bound sharing** → cannot be forwarded elsewhere  
- ✅ **Validation guards** → prevents invalid state transitions  

---

## 🚀 Install

```bash
npm install consento



