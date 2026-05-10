# Feature Specification: Template JSON Definition Format

**Feature Branch**: `003-template-json-format`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: User description: "only phase 3 from the ocode/PLAN.md"

## Clarifications

### Session 2026-05-10

- Q: Can templates be modified after resumes are created from them? → A: New versions supersede old — existing resumes keep the old version snapshot; new resumes use the latest.
- Q: Should content validation be strict (blocking) or lenient (warning)? → A: Strict on structure (block if required fields missing or types mismatch), lenient on extras (warn but allow unknown fields for forward compatibility).
- Q: What is explicitly in scope vs out of scope for the template definition format? → A: Structure + visual defaults only — sections, fields, default layout, fonts/colors are in scope. Dynamic per-resume overrides, PDF config, and AI behavior are separate concerns.
- Q: What are the limits on user-defined custom sections and their field types? → A: Unlimited custom sections, but restricted to text, richtext, and url field types only.
- Q: What are the constraints on section IDs, field names, and labels? → A: Section IDs must be unique per-template; lowercase alphanumeric + hyphens only, max 64 characters. Labels max 255 characters.

## User Scenarios & Testing

### User Story 1 - Define a new resume template (Priority: P1)

A template designer wants to create a new resume template by defining its structure — which sections are available, what fields each section contains, and the visual layout. They use the template JSON format to specify sections like header, experience, education, and skills, along with the color scheme and fonts.

**Why this priority**: This is the foundational capability — without being able to define templates, the resume builder and AI chat features cannot function.

**Independent Test**: Can be fully tested by constructing a valid template definition JSON with at least 3 section types and verifying it conforms to the expected structure.

**Acceptance Scenarios**:

1. **Given** a template designer wants to create a new template, **When** they define sections (header, experience, skills) with their fields and layout, **Then** the definition follows the prescribed JSON format with section IDs, types, labels, field definitions, and layout properties.
2. **Given** a template definition includes a "header" section, **When** it specifies fields for full_name, email, phone, and location, **Then** each field has a type, label, and optional required/constraint attributes.
3. **Given** a template definition includes layout settings, **When** color_scheme and fonts are specified, **Then** they contain primary, secondary, accent, background, text colors and heading/body font names.

---

### User Story 2 - Validate resume content against template structure (Priority: P2)

A user fills in their resume data, and the system needs to verify that the content matches the template's section and field definitions.

**Why this priority**: Content-validation ensures data integrity and prevents rendering errors.

**Independent Test**: Can be tested by providing sample resume content and verifying it matches a template's section definitions.

**Acceptance Scenarios**:

1. **Given** a template defines sections with specific fields, **When** a resume's content JSON is compared against the template definition, **Then** each section in the content maps to a section in the template definition with matching field types.
2. **Given** a template has required fields, **When** a resume is missing required field data, **Then** validation identifies the missing required fields.

---

### User Story 3 - Customize a template layout (Priority: P3)

A user wants to customize the visual appearance of a template by modifying its color scheme and font settings while keeping the section structure unchanged.

**Why this priority**: Layout customization enhances user experience but is not critical for the template format to function.

**Independent Test**: Can be tested by changing the layout's color_scheme and fonts in a template definition and verifying the modified layout is valid.

**Acceptance Scenarios**:

1. **Given** a template with a default layout, **When** a user updates the color_scheme with new hex values, **Then** the layout section accepts the new colors without affecting section definitions.
2. **Given** a template with a single-column layout, **When** the user changes columns to 2, **Then** the layout reflects the new column count.

---

### Edge Cases

- What happens when a template definition has duplicate section IDs?
- How does the system handle section types that are not in the known set (header, summary, experience, education, projects, skills, certifications, languages, custom)?
- What happens when required field constraints conflict (e.g., min_items > max_items)?
- How does the system handle empty sections (sections with no fields defined)?
- What happens when field type is unrecognized (not text, url, date, boolean, richtext, list, tags, or select)?
- How does the system handle extremely long section labels or field descriptions?
- What happens when the layout color_scheme is missing one or more color keys?
- What happens when a template is updated and existing resumes reference the previous definition?
- What happens when a resume contains fields that are not defined in the template definition?

## Requirements

### Functional Requirements

- **FR-001**: The template definition MUST support at least the following section types: header, summary, experience, education, projects, skills, certifications, languages, custom. The "custom" section type MUST be limited to text, richtext, and url field types only.
- **FR-002**: Each section definition MUST include an id (unique per-template, lowercase alphanumeric + hyphens only, max 64 chars), type, label (max 255 chars), and fields map.
- **FR-003**: Each field definition MUST include a type (text, url, date, boolean, richtext, list, tags, select) and a label.
- **FR-004**: Field definitions MAY include optional attributes: required, max_length, min, max, and options (for select type).
- **FR-005**: Section definitions MAY include constraints: required, min_items, max_items.
- **FR-006**: The layout definition MUST support columns count, color_scheme (primary, secondary, accent, background, text), and fonts (heading, body).
- **FR-007**: The resume content format MUST mirror the template definition structure, with section_id, type, and items arrays containing filled data.
- **FR-008**: The system MUST validate that resume content sections correspond to template definition sections by matching section_id and type. Validation MUST block content with missing required fields or field type mismatches, and MUST warn (but allow) content with unknown fields not defined in the template.
- **FR-009**: The template definition MUST support the "header" section as required with at most 1 item.
- **FR-010**: The template definition MUST allow sections with min_items of 0 (optional sections) and max_items to limit the number of entries.
- **FR-011**: When a template definition is updated, a new version snapshot MUST be created — existing resumes MUST retain the template version they were created with, while new resumes use the latest version.

### Key Entities

- **Template Definition**: The JSON schema that defines a resume template's structure, including sections, fields, and layout. Acts as the blueprint for resumes. Templates are versioned — changes create new snapshots without affecting existing linked resumes.
- **Section**: A logical grouping of related fields within a template (e.g., Experience, Education). Each section has a type, label, required flag, and optional item constraints (min_items, max_items).
- **Field**: A single data entry point within a section (e.g., full_name, company, start_date). Each field has a data type and optional validation constraints.
- **Layout**: Visual configuration for a template including column count, color scheme, and font selections. Independent of section structure.
- **Resume Content**: The user's filled data that follows the template definition structure, organized by sections with actual values. Each resume is linked to the specific template version snapshot used at creation time.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Template definitions with all 9 section types can be created and validated against the format specification.
- **SC-002**: Resume content can be validated against a template definition in under 1 second for templates with up to 20 sections.
- **SC-003**: A template definition with all field types (text, url, date, boolean, richtext, list, tags, select) can be constructed and verified.
- **SC-004**: Layout customization (color_scheme and fonts changes) does not affect section structure validation.
- **SC-005**: The format supports at least 5 different template definitions being created and used simultaneously without conflict.

## Assumptions

- Template definitions are consumed by both the frontend (rendering) and backend (validation, AI generation) systems.
- The JSON format will be validated against a schema before being stored.
- Template designers have basic familiarity with JSON structure.
- The format is extensible — new section types and field types can be added in future versions.
- Field type "richtext" will support rich text formatting in the rendering layer.
- Field type "tags" will support multiple tag-style inputs (e.g., skill keywords).
- Field type "select" options are defined as a flat list of string values.
- **Out of scope for this format spec**: Dynamic per-resume layout overrides, PDF rendering configuration, and AI agent behavior customization.
