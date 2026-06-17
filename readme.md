# 📚 Documentation - ComfyUI_FMJ_LLMP

## ⚡ FMJ-LLM-Prompt

Node ComfyUI pour séléctionner des prompts à partir de fichiers texte organisés par catégories.

---

## 📦 Installation

### 1. **Via Git** (Recommandé)
```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/bulldog68/ComfyUI_FMJ_LLMP.git
```

### 2. **Manuellement**
- Téléchargez le dossier `ComfyUI_FMJ_LLMP`
- Placez-le dans `ComfyUI/custom_nodes/`
- Redémarrez ComfyUI

---

## 📁 Structure des fichiers

```
ComfyUI_FMJ_LLMP/
├── txt/                           # Dossier des prompts
│   ├── Composition/               # Catégorie 1
│   │   ├── rule_of_thirds.txt
│   │   ├── symmetrical.txt
│   │   └── leading_lines.txt
│   ├── Lighting/                  # Catégorie 2
│   │   ├── golden_hour.txt
│   │   ├── cinematic.txt
│   │   └── noir.txt
│   └── Style/                     # Catégorie 3
│       ├── photorealistic.txt
│       └── anime.txt
├── js/
│   └── fmj_llm_frontend.js        # Interface dynamique
├── __init__.py                     # Enregistrement du node
├── fmj_llm_prompt.py              # Logique principale
└── pyproject.toml                 # Métadonnées
```

### 📝 Format des fichiers TXT

Chaque fichier `.txt` contient **un seul prompt** :

**Exemple : `txt/Lighting/golden_hour.txt`**
```
warm golden hour lighting, soft orange glow, long shadows, sunset ambiance
```

**Exemple : `txt/Composition/rule_of_thirds.txt`**
```
rule of thirds composition, subject off-center, balanced negative space
```

---

## 🎮 Utilisation du Node

### **Ajout dans le workflow**
1. Clic droit dans le canvas → `🌀FMJ` → `⚡ FMJ-LLM-Prompt`
2. Ou double-clic → cherchez `FMJ-LLM-Prompt`

### **Sorties**
- **`prompt`** (STRING) : Le prompt généré combinant toutes les catégories sélectionnées
- **`debug_info`** (STRING) : Informations de débogage pour voir ce qui a été sélectionné

---

## ⚙️ Paramètres

### **Paramètres globaux**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `toggle_visibility` | BOOLEAN | Masque les catégories sur "disabled" pour nettoyer l'interface |
| `reset_all` | BOOLEAN | Remet toutes les catégories sur "disabled" (se reset automatiquement) |
| `extra_prompt` | STRING | Texte additionnel à ajouter au prompt final |

### **Paramètres par catégorie**

Chaque sous-dossier dans `txt/` devient un paramètre dropdown.

**Options disponibles :**
- `disabled` : La catégorie est ignorée
- `[nom_fichier]` : Utilise le contenu du fichier `.txt` correspondant

**Exemple :**
Si vous avez `txt/Lighting/golden_hour.txt`, vous verrez l'option `golden_hour` dans le dropdown `txt_Lighting`.

---

## 🔧 Configuration

### **Créer une nouvelle catégorie**

1. Créez un sous-dossier dans `txt/` :
   ```bash
   mkdir ComfyUI_FMJ_LLMP/txt/Camera/
   ```

2. Ajoutez des fichiers `.txt` :
   ```bash
   echo "wide angle lens, 24mm, expansive view" > ComfyUI_FMJ_LLMP/txt/Camera/wide_angle.txt
   echo "telephoto compression, 85mm, shallow depth" > ComfyUI_FMJ_LLMP/txt/Camera/telephoto.txt
   ```

3. Redémarrez ComfyUI ou cliquez sur "Refresh" dans le Manager
4. Le nouveau dropdown `txt_Camera` apparaît automatiquement

### **Renommer un prompt**

Le nom affiché dans le dropdown correspond au **nom du fichier** (sans `.txt`).

Pour changer "golden_hour" en "Golden Hour" dans l'affichage :
- Renommez le fichier : `golden_hour.txt` → `Golden Hour.txt`

---

## 💡 Exemples d'utilisation

### **Exemple 1 : Prompt simple**

Configuration :
- `txt_Composition` : `rule_of_thirds`
- `txt_Lighting` : `golden_hour`
- `extra_prompt` : `a cat sitting on a fence`

**Résultat :**
```
rule of thirds composition, subject off-center, balanced negative space, warm golden hour lighting, soft orange glow, long shadows, sunset ambiance, a cat sitting on a fence
```

### **Exemple 2 : Interface épurée**

1. Activez `toggle_visibility` = `true`
2. Mettez les catégories inutilisées sur `disabled`
3. Seules les catégories actives restent visibles

### **Exemple 3 : Workflow modulaire**

Créez des presets en sauvegardant différents workflows :
- `portrait_workflow.json` → `txt_Lighting` = `studio_softbox`
- `landscape_workflow.json` → `txt_Lighting` = `golden_hour`
- `noir_workflow.json` → `txt_Lighting` = `chiaroscuro`

---

## 🐛 Débogage

### **Le node n'apparaît pas**
- Vérifiez que le dossier est dans `custom_nodes/`
- Regardez dans la console ComfyUI pour les erreurs Python
- Assurez-vous que le dossier s'appelle bien `ComfyUI_FMJ_LLMP`

### **Les catégories n'apparaissent pas**
- Vérifiez la structure : `txt/NomCategorie/fichier.txt`
- Les fichiers doivent avoir l'extension `.txt` (minuscule)
- Redémarrez ComfyUI

### **Le prompt est vide**
- Vérifiez que les catégories ne sont pas sur `disabled`
- Consultez la sortie `debug_info` pour voir ce qui est sélectionné
- Vérifiez que les fichiers `.txt` ne sont pas vides

### **Problèmes d'encodage**
- Utilisez l'encodage **UTF-8** pour tous les fichiers `.txt`
- Évitez les caractères spéciaux dans les noms de fichiers

---

## 📝 Bonnes pratiques

### **Nommage des fichiers**
- Utilisez des noms descriptifs : `cinematic_lighting` plutôt que `cl1`
- Séparez les mots par `_` ou espaces : `golden_hour` ou `Golden Hour`
- Évitez les caractères spéciaux : `@`, `#`, `$`, etc.

### **Organisation**
- Une idée par fichier
- Gardez les prompts concis (une phrase ou liste d'adjectifs)
- Groupez par thématique dans les sous-dossiers

### **Performance**
- Évitez d'avoir trop de fichiers dans une catégorie (>100 peut ralentir)
- Si vous avez beaucoup de prompts, créez plus de catégories

---

## 🔄 Mises à jour

### **Depuis l'ancienne version CSV**
- Les fichiers CSV sont remplacés par des fichiers TXT
- Un fichier TXT = un seul prompt (plus simple à éditer)
- Les catégories deviennent des sous-dossiers
- Plus de random/increment/decrement - sélection manuelle uniquement

### **Migration**
```bash
# Ancienne structure
txt/prompts.csv  # Multiple prompts par fichier

# Nouvelle structure  
txt/Categorie/prompt1.txt  # Un prompt par fichier
txt/Categorie/prompt2.txt
```

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier `LICENSE` pour plus de détails.

---

## 🤝 Contribution

Les contributions sont les bienvenues !
1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/bulldog68/ComfyUI_FMJ_LLMP/issues)
- **Discussions** : [GitHub Discussions](https://github.com/bulldog68/ComfyUI_FMJ_LLMP/discussions)

---

**Développé avec ❤️ pour la communauté ComfyUI**
