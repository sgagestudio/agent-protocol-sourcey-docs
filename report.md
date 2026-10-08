# Sourcey publication report

## Target

LangChain Agent Protocol, pinned to the exact source revision recorded in `evidence.json`.

The project is a maintained third-party MIT-licensed open-source protocol repository. Its pinned OpenAPI specification exposes 21 paths, 27 HTTP operations and 33 schemas.

## What was generated

Sourcey 3.6.12 built the upstream OpenAPI specification into a static, searchable API reference. The output includes the HTML reference, search index, sitemap, `llms.txt`, `llms-full.txt`, Sourcey assets and Open Graph output.

## Why it is useful

The artifact provides a static Sourcey rendering of the protocol contract that can be downloaded, mirrored and inspected independently of a running application. It is tied to an exact upstream revision rather than an unversioned API snapshot.

## Verification

Rebuild with:

```powershell
npx -y sourcey@3.6.12 build .\upstream\openapi.json --output .\site
```

Then verify `site/index.html`, `site/search-index.json`, `site/sitemap.xml`, `site/llms.txt` and `site/llms-full.txt`.

## Limitation

This is an independent community artifact, not the upstream project's official documentation. It intentionally does not claim endorsement by LangChain.
