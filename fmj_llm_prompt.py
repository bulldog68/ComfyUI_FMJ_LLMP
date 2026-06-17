import os

TXT_DIR = os.path.join(os.path.dirname(__file__), "txt")

class FMJLLMPrompt:
    @classmethod
    def INPUT_TYPES(cls):
        categories = []
        if os.path.exists(TXT_DIR):
            categories = [d for d in os.listdir(TXT_DIR) if os.path.isdir(os.path.join(TXT_DIR, d))]

        inputs = {"required": {
            "toggle_visibility": ("BOOLEAN", {"default": False, "label": "👁 Masquer disabled"}),
            "reset_all": ("BOOLEAN", {"default": False, "label": "🔄 Reset All"}),
            "extra_prompt": ("STRING", {"multiline": False, "default": ""}),
        }}

        for category in sorted(categories):
            cat_path = os.path.join(TXT_DIR, category)
            txt_files = [f for f in os.listdir(cat_path) if f.endswith('.txt')]
            
            # Afficher uniquement le nom du fichier (sans .txt)
            lines = []
            file_mapping = {}
            
            for filename in sorted(txt_files):
                file_path = os.path.join(cat_path, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read().strip()
                        if content:
                            file_basename = os.path.splitext(filename)[0]
                            lines.append(file_basename)
                            file_mapping[file_basename] = content
                except Exception as e:
                    file_basename = os.path.splitext(filename)[0]
                    lines.append(f"⚠️_{file_basename}")
                    file_mapping[f"⚠️_{file_basename}"] = f"Erreur: {str(e)}"

            if not lines:
                lines = ["(vide)"]

            # 🔹 Plus de random/increment/decrement - juste disabled + fichiers
            choices = ["disabled"] + lines
            default_choice = "disabled"

            inputs["required"][f"txt_{category}"] = (choices, {"default": default_choice})
            setattr(cls, f"_file_mapping_{category}", file_mapping)

        return inputs

    RETURN_TYPES = ("STRING", "STRING")
    RETURN_NAMES = ("prompt", "debug_info")
    FUNCTION = "generate_prompt"
    CATEGORY = "🌀FMJ"
    OUTPUT_NODE = True

    def generate_prompt(self, toggle_visibility, reset_all, extra_prompt, **kwargs):
        selected_prompts = []
        debug_lines = [f"Visibility Toggle: {toggle_visibility}"]

        for key, value in kwargs.items():
            if key in ['toggle_visibility', 'reset_all', 'extra_prompt']:
                continue

            if value == "disabled":
                debug_lines.append(f"{key}: disabled")
                continue

            category = key.replace("txt_", "")
            file_mapping = getattr(self.__class__, f"_file_mapping_{category}", {})

            # 🔹 Sélection manuelle uniquement
            if value in file_mapping:
                selected_prompts.append(file_mapping[value])
                debug_lines.append(f"{key}: {value} [manual]")
            else:
                selected_prompts.append(f"(inconnu: {value})")
                debug_lines.append(f"{key}: inconnu {value}")

        if extra_prompt.strip():
            selected_prompts.append(extra_prompt.strip())

        final_prompt = ", ".join([p for p in selected_prompts if p and not p.startswith("Erreur:")])
        debug_info = "\n".join(debug_lines)

        return (final_prompt, debug_info)