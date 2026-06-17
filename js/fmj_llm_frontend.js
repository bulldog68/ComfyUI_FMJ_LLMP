// ComfyUI_FMJ_LLMP/js/fmj_llm_frontend.js
import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "FMJ.LLMP.DynamicVisibility",

    async setup() {
        console.log("⚡ FMJ-LLM-Prompt Dynamic Visibility loaded");
    },

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // 🔹 Ciblage du nouveau nom de node
        if (nodeData.name !== "✨ FMJ-LLM-Prompt") return;

        console.log("🎯 FMJ-LLM-Prompt: Registering visibility hooks");

        const onNodeCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function() {
            const result = onNodeCreated?.apply(this, arguments);

            this.fmj_txt_widgets = [];
            this.fmj_toggle_widget = null;
            this.fmj_reset_widget = null;

            this.widgets?.forEach(widget => {
                // 🔹 Les widgets TXT ont le préfixe "txt_"
                if (widget.name?.startsWith("txt_")) {
                    this.fmj_txt_widgets.push(widget);
                }
                if (widget.name === "toggle_visibility") {
                    this.fmj_toggle_widget = widget;
                }
                if (widget.name === "reset_all") {
                    this.fmj_reset_widget = widget;
                }
            });

            console.log(`📊 FMJ-LLM-Prompt: Found ${this.fmj_txt_widgets.length} TXT widgets`);

            if (this.fmj_toggle_widget) {
                const node = this;
                const toggleWidget = this.fmj_toggle_widget;

                const originalCallback = toggleWidget.callback;
                toggleWidget.callback = function(value) {
                    originalCallback?.apply(this, arguments);
                    setTimeout(() => {
                        node.updateTXTVisibility(value);
                    }, 50);
                };

                setTimeout(() => {
                    node.updateTXTVisibility(toggleWidget.value);
                }, 200);
            }

            if (this.fmj_reset_widget) {
                const node = this;
                const resetWidget = this.fmj_reset_widget;

                const originalCallback = resetWidget.callback;
                resetWidget.callback = function(value) {
                    originalCallback?.apply(this, arguments);

                    if (value === true) {
                        node.resetAllToDisabled();
                        setTimeout(() => {
                            resetWidget.value = false;
                        }, 100);
                    }
                };
            }

            return result;
        };

        nodeType.prototype.updateTXTVisibility = function(hideDisabled) {
            if (!this.fmj_txt_widgets?.length) return;

            let hiddenCount = 0;
            let needsResize = false;

            this.fmj_txt_widgets.forEach(widget => {
                if (hideDisabled && widget.value === "disabled") {
                    if (!widget.hidden) {
                        widget.hidden = true;
                        hiddenCount++;
                        needsResize = true;
                    }
                } else {
                    if (widget.hidden) {
                        widget.hidden = false;
                        needsResize = true;
                    }
                }
            });

            if (needsResize) {
                this.setSize([this.size[0], this.computeSize()[1]]);
                this.setDirtyCanvas(true, true);
            }

            this.fmj_hidden_count = hiddenCount;
            console.log(`👁 FMJ-LLM-Prompt: ${hiddenCount} widgets hidden`);
        };

        nodeType.prototype.resetAllToDisabled = function() {
            if (!this.fmj_txt_widgets?.length) return;

            let resetCount = 0;

            this.fmj_txt_widgets.forEach(widget => {
                if (widget.value !== "disabled") {
                    widget.value = "disabled";
                    resetCount++;
                }
            });

            if (this.fmj_toggle_widget?.value) {
                this.updateTXTVisibility(true);
            }

            this.setDirtyCanvas(true, true);
            console.log(`🔄 FMJ-LLM-Prompt: Reset ${resetCount} widgets to disabled`);

            this.fmj_reset_message = `✅ ${resetCount} reset!`;
            setTimeout(() => {
                this.fmj_reset_message = null;
                this.setDirtyCanvas(true, true);
            }, 2000);
        };

        const onWidgetsChanged = nodeType.prototype.onWidgetsChanged;
        nodeType.prototype.onWidgetsChanged = function() {
            const result = onWidgetsChanged?.apply(this, arguments);
            if (this.fmj_toggle_widget?.value) {
                this.updateTXTVisibility(true);
            }
            return result;
        };

        const onDrawForeground = nodeType.prototype.onDrawForeground;
        nodeType.prototype.onDrawForeground = function(ctx) {
            onDrawForeground?.apply(this, arguments);

            if (this.fmj_toggle_widget?.value && this.fmj_hidden_count > 0) {
                ctx.fillStyle = "#4CAF50";
                ctx.font = "bold 12px Arial";
                ctx.fillText(`👁 ${this.fmj_hidden_count} masqué(s)`, this.size[0] - 90, -10);
            }

            if (this.fmj_reset_message) {
                ctx.fillStyle = "#2196F3";
                ctx.font = "bold 12px Arial";
                ctx.fillText(this.fmj_reset_message, this.size[0] / 2 - 40, 30);
            }
        };
    },

    async nodeCreated(node) {
        if (node.comfyClass !== "✨ FMJ-LLM-Prompt") return;

        setTimeout(() => {
            const toggleWidget = node.widgets?.find(w => w.name === "toggle_visibility");
            if (toggleWidget && node.updateTXTVisibility) {
                node.updateTXTVisibility(toggleWidget.value);
            }
        }, 300);
    }
});