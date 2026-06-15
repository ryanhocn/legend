# Legend Project Guide

## Project Overview

Legend is a synthetic EHR-style training simulator for medical students and early clinical trainees.

Its purpose is to help users practice:
- chart review
- clinical documentation
- ward round notes
- handover-style synthesis
- recognizing unsafe omissions
- linking clinical cases to physiology and revision topics


Copy Epic, NHS systems, WinPath, or other proprietary systems loosely.

The UI may be inspired by common EHR patterns:
- patient sidebar
- chart tabs
- encounter table
- bloods/microbiology sections
- right context rail
- sticky notes
- alerts
- note editor

Use generic terms:
- Chart Review
- Notes
- Bloods
- Microbiology
- Imaging
- Medications
- Orders
- Synthetic Case ID

Preserve disclaimers:
"All patient data are synthetic. For education and simulation only. Not for clinical use."

## Tech Stack

Frontend:
- Vite
- React
- TypeScript
- CSS

Installed packages:
- lucide-react
- react-resizable-panels

Important package note:
The installed `react-resizable-panels` version exports:
- Group
- Panel
- Separator

Use this import style:

```tsx
import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
