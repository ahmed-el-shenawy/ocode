"use client";

import { useStudioStore } from "@/stores/studio-store";

export function StylePanel() {
  const { selectedWidgetId, widgets, globalStyles, updateWidgetStyles, updateGlobalStyles } =
    useStudioStore();

  const selectedWidget = widgets.find((w) => w.id === selectedWidgetId);

  return (
    <div className="w-80 border-l bg-white p-4 overflow-y-auto">
      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-4">
        Styles
      </h3>

      {!selectedWidget && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <input
              type="color"
              value={String(globalStyles.primary_color || "#1a365d")}
              onChange={(e) =>
                updateGlobalStyles({ primary_color: e.target.value })
              }
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading Font
            </label>
            <select
              value={String(globalStyles.heading_font || "Inter")}
              onChange={(e) =>
                updateGlobalStyles({ heading_font: e.target.value })
              }
              className="w-full rounded border p-1.5 text-sm"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Playfair Display">Playfair Display</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body Font
            </label>
            <select
              value={String(globalStyles.body_font || "Inter")}
              onChange={(e) =>
                updateGlobalStyles({ body_font: e.target.value })
              }
              className="w-full rounded border p-1.5 text-sm"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Open Sans">Open Sans</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Margins (mm)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-gray-500">Top</span>
                <input
                  type="number"
                  value={String(globalStyles.margin_top || 20)}
                  onChange={(e) =>
                    updateGlobalStyles({ margin_top: Number(e.target.value) })
                  }
                  className="w-full rounded border p-1 text-sm"
                />
              </div>
              <div>
                <span className="text-xs text-gray-500">Bottom</span>
                <input
                  type="number"
                  value={String(globalStyles.margin_bottom || 20)}
                  onChange={(e) =>
                    updateGlobalStyles({ margin_bottom: Number(e.target.value) })
                  }
                  className="w-full rounded border p-1 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedWidget && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Padding
            </label>
            <input
              type="range"
              min="0"
              max="40"
              value={Number(selectedWidget.styles.padding || 16)}
              onChange={(e) =>
                updateWidgetStyles(selectedWidget.id, {
                  padding: Number(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background
            </label>
            <input
              type="color"
              value={String(selectedWidget.styles.background || "#ffffff")}
              onChange={(e) =>
                updateWidgetStyles(selectedWidget.id, {
                  background: e.target.value,
                })
              }
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
