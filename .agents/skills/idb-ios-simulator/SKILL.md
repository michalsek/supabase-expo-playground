---
name: idb-ios-simulator
description: Use idb to inspect and interact with an iOS Simulator app, including accessibility-based click-through checks for changed screens.
license: MIT
metadata:
  author: padadiddle
  version: "1.0.0"
---

# iDB iOS Simulator Workflow

Use this skill when a task requires driving the iOS Simulator UI, checking new navigation flows, or validating that changed screens are reachable.

## Preconditions

- Xcode command line tools are available.
- `idb` is installed and available on PATH.
- A simulator is booted (or can be booted) and the app is installed/running.

## Core Flow

1. List targets and identify the booted iPhone simulator:

```bash
idb list-targets
```

2. Connect to the target by UDID:

```bash
idb connect <UDID>
```

3. Find the app bundle and running status:

```bash
idb list-apps
```

4. Inspect current accessibility tree to discover actionable labels and coordinates:

```bash
idb ui describe-all
```

5. Interact with the UI using tap/swipe/text:

```bash
idb ui tap <x> <y>
idb ui swipe <x_start> <y_start> <x_end> <y_end>
idb ui text "example input"
```

6. Re-run accessibility inspection after each action and confirm expected destination labels:

```bash
idb ui describe-all | rg 'AXLabel'
```

## Recommended Validation Pattern

- Start from a known entry screen (usually home/root).
- Traverse each newly added or changed navigation path.
- Confirm each destination by heading/title label from accessibility output.
- Return to entry screen and repeat for the next path.
- Record failures with exact step and observed label mismatch.

## Useful Commands

```bash
idb ui tap --help
idb ui swipe --help
idb screenshot /tmp/current-screen.png
idb focus
```

## Reporting Format

- Target simulator name + UDID used.
- Paths executed as ordered steps.
- Expected vs observed labels for each step.
- Final screen state after the flow.
- Open issues found during click-through.
