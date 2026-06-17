# ComfyUI_FMJ_LLMP/__init__.py
from .fmj_llm_prompt import FMJLLMPrompt

NODE_CLASS_MAPPINGS = {
    "✨ FMJ-LLM-Prompt": FMJLLMPrompt
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "✨ FMJ-LLM-Prompt": "⚡ FMJ-LLM-Prompt"
}

WEB_DIRECTORY = "./js"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]