---
name: sourcey-artifact-validator
description: Deterministically validate the published Sourcey Agent Protocol documentation artifact and public URL.
runx:
  category: verification
---

# Sourcey artifact validator

Validate the reproducible Sourcey documentation artifact for the pinned LangChain Agent Protocol snapshot.

The validator is deterministic and does not use a model. It checks the expected OpenAPI surface, required generated files, content identity, SHA-256 digests, and the live GitHub Pages publication.
