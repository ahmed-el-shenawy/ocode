import type { ContentPatch } from "./types";

export interface ConflictResult {
  hasConflict: boolean;
  localSectionId: string;
  incomingFields: Record<string, unknown>;
  currentFields: Record<string, unknown>;
}

export class ConflictResolver {
  private localSnapshots: Map<string, Record<string, unknown>> = new Map();

  snapshotSection(sectionId: string, fields: Record<string, unknown>) {
    this.localSnapshots.set(sectionId, { ...fields });
  }

  checkConflict(patch: ContentPatch): ConflictResult | null {
    const snapshot = this.localSnapshots.get(patch.sectionId);
    if (!snapshot) return null;

    const hasConflict = Object.keys(patch.fields).some(
      (key) =>
        snapshot[key] !== undefined &&
        JSON.stringify(snapshot[key]) !== JSON.stringify(patch.fields[key]),
    );

    if (hasConflict) {
      this.localSnapshots.set(patch.sectionId, { ...patch.fields } as Record<string, unknown>);
      return {
        hasConflict: true,
        localSectionId: patch.sectionId,
        incomingFields: patch.fields,
        currentFields: snapshot,
      };
    }

    this.localSnapshots.set(patch.sectionId, { ...patch.fields } as Record<string, unknown>);
    return {
      hasConflict: false,
      localSectionId: patch.sectionId,
      incomingFields: patch.fields,
      currentFields: snapshot,
    };
  }

  clearSection(sectionId: string) {
    this.localSnapshots.delete(sectionId);
  }

  clearAll() {
    this.localSnapshots.clear();
  }
}
