---
name: jev
description: >
  Call TypeSafe's Jev model to turn a prompt-and-parse LLM step into a typed
  judgment: pick one option, rate a probability, score a level. Use when code
  needs semantic understanding but not generated text: routing, ranking,
  extraction, classification, verification, guardrails, relevance checks.
  Triggers on "jev", "typesafe", "system one", or on designing a feature where
  an LLM is asked a closed question and the answer gets parsed back out.
---

# Jev (TypeSafe System One)

One HTTP call takes some `state` plus a map of typed `questions`, and returns one
typed `answer` per question with calibrated probabilities. No prose, no parsing.
Code keeps the workflow, Jev supplies the judgment.

## Endpoint

```http
POST https://api.typesafe.ai/v1/systemone
Authorization: Bearer $TYPESAFE_API_KEY
Content-Type: application/json
```

Body: `{ state, model: "jev-latest", questions }`. `state` is a string or any
JSON (chat log, record, app state). Question ids are yours and are not sent to
the model, so put the whole meaning in `instructions`.

## The three question types

```json
{
  "state": "Help! My payouts have been failing for 3 days.",
  "model": "jev-latest",
  "questions": {
    "is_urgent": {
      "type": "noul",
      "instructions": "Does this convey urgency?",
      "criteria": { "true": "Explicitly time-sensitive", "false": "No urgency expressed" }
    },
    "department": {
      "type": "choice",
      "instructions": "Which team should handle this?",
      "criteria": {
        "billing": "Payments, invoicing, refunds",
        "technical": "Bugs, outages, integrations",
        "none": "Nothing here fits"
      }
    },
    "frustration": {
      "type": "score",
      "instructions": "How frustrated is the customer?",
      "criteria": ["Calm", "Frustrated", "Very angry"]
    }
  }
}
```

`noul` = probability of yes (`criteria` optional). `choice` = one option out of a
map of option to rubric (`null` when the name says it all). `score` = ordered
array of at least two level descriptions, each standing on its own.

## The answers

```json
{
  "model": "jev-latest",
  "answers": {
    "is_urgent":   { "type": "noul", "noul": 0.92 },
    "department":  { "type": "choice", "choice": "technical",
                     "probabilities": { "billing": 0.08, "technical": 0.85, "none": 0.07 },
                     "confidence": 0.82 },
    "frustration": { "type": "score", "score": 1.6,
                     "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
                     "probabilities": { "0": 0.05, "1": 0.3, "2": 0.65 },
                     "confidence": 0.78 }
  },
  "usage": { "input_tokens": 312, "output_tokens": 48 }
}
```

Errors are plain HTTP: 401 bad key, 422 malformed question (body names the
field), 429 rate limit, 529 overloaded. Back off on the last two.

## JS SDK

```sh
npm install @typesafe-ai/sdk   # Node 20+, reads TYPESAFE_API_KEY
```

```ts
import { choice, noul, score, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();
const res = await client.systemOne({
  state: { ticket: text },
  questions: { category: choice("What is this ticket about?", { billing: null, technical: null, other: null }) },
});
res.answers.category.choice; // typed from the question
```

Answer types are inferred from the questions. Python SDK is the same shape.

## Rules that change what you write

- Ask every independent question about the same state in ONE call. They run in
  parallel, cannot see each other, and batching is roughly 10x cheaper and
  faster than one call each. Speculative questions are fine, state their premise
  and let code ignore the branches it does not need. A second call is only
  warranted when an answer decides what evidence to fetch next.
- One narrow judgment per question. Split independent dimensions, but do not cut
  a relationship in half just to make questions smaller.
- Include a no-match option when nothing may fit. For picking a value out of a
  document, find the candidates in code first: the model cannot choose a value
  you did not give it.
- `confidence` measures how concentrated the distribution is, nothing else. It
  is not correctness and not permission to act. A noul near 0.5 means "could go
  either way", not "medium intensity".
- Keep the policy in code: thresholds, weights, exact lookups, calculations.
  Store the raw judgments so changing a weight does not mean re-running
  inference. Thresholds get tuned on your own data, never copied from a demo.
- Key stays server-side.

Deeper material (patterns, cookbooks, confidence math) lives at
https://docs.typesafe.ai/llms.txt, Markdown by appending `.md` to any page path.
