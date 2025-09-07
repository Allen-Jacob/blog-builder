const editor = document.getElementById('editor');
const previewFrame = document.getElementById('previewFrame');
const htmlOutput = document.getElementById('htmlOutput');
const previewBtn = document.getElementById('previewBtn');
const saveBtn = document.getElementById('saveBtn');
const exportBtn = document.getElementById('exportBtn');
const copyBtn = document.getElementById('copyBtn');

const titleInput = document.getElementById('articleTitle');
const dateInput = document.getElementById('articleDate');
const readingTimeInput = document.getElementById('readingTime');
const introInput = document.getElementById('articleIntro');
const learningPointsInput = document.getElementById('learningPoints');

// Fonction pour traiter les blocs de code
function processCodeBlocks(text) {
    return text.replace(/\/code\s*([\s\S]*?)\/code/g, (_, code) => {
        return `<div class="code-block"><pre><code>${code.trim()}</code></pre></div>`;
    });
}

// Fonction pour convertir le Markdown en HTML avec l'introduction intégrée
function markdownToHTML(md, title, intro, learningPoints) {
    let html = `<h1 style="color:#ff6b9d;">${title}</h1>\n`;

// Ajout de l'introduction entre le titre et "Ce que vous apprenez"
if (intro) {
    // Conversion des retours à la ligne pour l'intro aussi
    const formattedIntro = intro.replace(/\n/g, '<br>');
    html += `<div class="intro-section"><p class="intro">${formattedIntro}</p></div>\n`;
}

// Ajout de la boîte "Ce que vous apprenez" avec gestion des retours à la ligne
if (learningPoints) {
    // Remplace tous les retours à la ligne (\n) par des <br> HTML
    const formattedLearningPoints = learningPoints.replace(/\n/g, '<br>');
    html += `<div class="highlight-box"><h4>🎯 Ce que vous apprendrez</h4><p>${formattedLearningPoints}</p></div>\n`;
}

    // Traitement du contenu Markdown
    const blocks = md.split(/\n\s*\n/);
    html += blocks.map(block => {
        block = processCodeBlocks(block);
        return block.split('\n').map(line => {
            if(line.startsWith('### ')) return `<h3 id="${line.slice(4).replace(/\s+/g,'-')}">${line.slice(4)}</h3>`;
            if(line.startsWith('## ')) return `<h2 id="${line.slice(3).replace(/\s+/g,'-')}">${line.slice(3)}</h2>`;
            if(line.startsWith('# ')) return `<h1 style="color:#ff6b9d;">${line.slice(2)}</h1>`;
            return line.trim() ? `<p>${line}</p>` : '';
        }).join('\n');
    }).join('\n');
    
    return html;
}

// Template d'article complet - utilise le CSS existant de blog.css
function getArticleTemplate(content, title, date, readingTime, intro, learningPoints) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} - Jacob Allen</title>
<link rel="stylesheet" href="../css/blog.css">
<style>
/* Styles pour les images */
.image-container {
    margin: 2rem 0;
    text-align: center;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.article-image {
    width: 100%;
    height: auto;
    max-width: 100%;
    border-radius: 8px;
    transition: transform 0.3s ease;
    cursor: pointer;
}

.article-image:hover {
    transform: scale(1.02);
}

.image-caption {
    background: rgba(255, 107, 157, 0.1);
    padding: 0.8rem;
    font-style: italic;
    color: #666;
    border-top: 2px solid rgba(255, 107, 157, 0.3);
    font-size: 0.9rem;
}

.image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
}

.gallery-item {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.gallery-item:hover {
    transform: translateY(-5px);
}

.gallery-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.gallery-image:hover {
    transform: scale(1.05);
}

/* Modal pour agrandir les images */
.image-modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.9);
    backdrop-filter: blur(5px);
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90%;
    max-height: 90%;
    border-radius: 12px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5);
}

.modal-image {
    width: 100%;
    height: auto;
    border-radius: 12px;
}

.close-modal {
    position: absolute;
    top: 20px;
    right: 30px;
    color: white;
    font-size: 40px;
    font-weight: bold;
    cursor: pointer;
    z-index: 1001;
    background: rgba(0,0,0,0.5);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
}

.close-modal:hover {
    background: rgba(255, 107, 157, 0.8);
}

@media (max-width: 768px) {
    .image-gallery {
        grid-template-columns: 1fr;
    }
    
    .gallery-image {
        height: 250px;
    }
}
</style>
</head>
<body>
<header>
<nav>
<a href="/" class="logo">Jacob Allen</a>
<div class="nav-center">${title}</div>
<a href="/blog/" class="back-btn">← Retour au blog</a>
</nav>
</header>
    <!-- BACKGROUND -->
    <div class="background"></div>
<div class="main-container">
<aside class="sidebar">
<div class="meta-box">
<h3>📝 Informations</h3>
<div class="meta-item">📅 ${date}</div>
<div class="meta-item">👤 Jacob Allen</div>
<div class="meta-item">⏱️ ${readingTime} min de lecture</div>
</div>
<div class="toc">
<h3>📋 Table des matières</h3>
<ul></ul>
</div>
</aside>
<article class="article">
${markdownToHTML(content, title, intro, learningPoints)}
</article>
</div>
<footer>
<p>&copy; 2025 Jacob Allen. Tous droits réservés.</p>
</footer>

<!-- Modal pour agrandir les images -->
<div id="imageModal" class="image-modal">
    <span class="close-modal" onclick="closeImageModal()">&times;</span>
    <div class="modal-content">
        <img id="modalImage" class="modal-image" src="" alt="">
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('h2[id], h3[id]');
    const tocUl = document.querySelector('.toc ul');
    let tocHTML = '';
    sections.forEach(section => {
        const id = section.id;
        const text = section.textContent;
        tocHTML += '<li><a href="#'+id+'">'+text+'</a></li>';
    });
    tocUl.innerHTML = tocHTML;
    
    // Clic sur les images pour les agrandir
    document.querySelectorAll('.article-image').forEach(img => {
        img.addEventListener('click', () => openImageModal(img.src));
    });
});

function openImageModal(src) {
    document.getElementById('imageModal').style.display = 'block';
    document.getElementById('modalImage').src = src;
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// Fermer le modal en cliquant à l'extérieur
document.getElementById('imageModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeImageModal();
    }
});
</script>
</body>
</html>`;
}

// Fonctions d'événements avec animations et feedbacks

// Aperçu avec animation
previewBtn.addEventListener('click', () => {
    // Animation du bouton
    previewBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        previewBtn.style.transform = 'scale(1)';
    }, 150);
    
    const html = getArticleTemplate(
        editor.value,
        titleInput.value || 'Titre de l\'article',
        dateInput.value || new Date().toLocaleDateString('fr-FR'),
        readingTimeInput.value || '5',
        introInput.value,
        learningPointsInput.value
    );
    previewFrame.srcdoc = html;
    htmlOutput.value = html;
    
    // Animation de succès
    previewBtn.innerHTML = '<span>✅</span> Généré !';
    setTimeout(() => {
        previewBtn.innerHTML = '<span>🌟</span> Aperçu';
    }, 2000);
});

// Copier HTML avec feedback visuel
copyBtn.addEventListener('click', () => {
    if (!htmlOutput.value) {
        // Animation d'erreur
        copyBtn.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
        copyBtn.innerHTML = '<span>⚠️</span> Générez d\'abord !';
        setTimeout(() => {
            copyBtn.style.background = 'linear-gradient(135deg, #ff6b9d, #c471ed)';
            copyBtn.innerHTML = '<span>📋</span> Copier HTML';
        }, 3000);
        return;
    }
    
    htmlOutput.select();
    document.execCommand('copy');
    
    // Animation de succès
    copyBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
    copyBtn.innerHTML = '<span>✅</span> Copié !';
    setTimeout(() => {
        copyBtn.style.background = 'linear-gradient(135deg, #ff6b9d, #c471ed)';
        copyBtn.innerHTML = '<span>📋</span> Copier HTML';
    }, 2000);
});

// Sauvegarde locale avec animation
saveBtn.addEventListener('click', () => {
    const contentData = {
        title: titleInput.value,
        date: dateInput.value,
        readingTime: readingTimeInput.value,
        intro: introInput.value,
        learningPoints: learningPointsInput.value,
        content: editor.value,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('builderContent', JSON.stringify(contentData));
    
    // Animation de succès
    saveBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
    saveBtn.innerHTML = '<span>✅</span> Sauvegardé !';
    setTimeout(() => {
        saveBtn.style.background = 'linear-gradient(135deg, #ff6b9d, #c471ed)';
        saveBtn.innerHTML = '<span>💾</span> Sauvegarder';
    }, 2000);
});

// Export HTML avec animation
exportBtn.addEventListener('click', () => {
    if (!htmlOutput.value) {
        // Animation d'erreur
        exportBtn.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
        exportBtn.innerHTML = '<span>⚠️</span> Générez d\'abord !';
        setTimeout(() => {
            exportBtn.style.background = 'linear-gradient(135deg, #ff6b9d, #c471ed)';
            exportBtn.innerHTML = '<span>🚀</span> Exporter';
        }, 3000);
        return;
    }
    
    const html = getArticleTemplate(
        editor.value,
        titleInput.value || 'article',
        dateInput.value || new Date().toLocaleDateString('fr-FR'),
        readingTimeInput.value || '5',
        introInput.value,
        learningPointsInput.value
    );
    
    const blob = new Blob([html], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Nom de fichier intelligent
    const fileName = (titleInput.value || 'article')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '.html';
    
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Animation de succès
    exportBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
    exportBtn.innerHTML = '<span>✅</span> Exporté !';
    setTimeout(() => {
        exportBtn.style.background = 'linear-gradient(135deg, #ff6b9d, #c471ed)';
        exportBtn.innerHTML = '<span>🚀</span> Exporter';
    }, 2000);
});

// Chargement du contenu sauvegardé au démarrage
window.addEventListener('load', () => {
    const saved = localStorage.getItem('builderContent');
    if(saved) {
        try {
            const data = JSON.parse(saved);
            titleInput.value = data.title || '';
            dateInput.value = data.date || '';
            readingTimeInput.value = data.readingTime || '';
            introInput.value = data.intro || '';
            learningPointsInput.value = data.learningPoints || '';
            editor.value = data.content || '';
            
            // Notification de chargement
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #00ff88, #00cc66);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                font-weight: 600;
                box-shadow: 0 4px 20px rgba(0,255,136,0.3);
                z-index: 1000;
                animation: slideIn 0.5s ease;
            `;
            notification.innerHTML = '✅ Contenu restauré !';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.5s ease forwards';
                setTimeout(() => notification.remove(), 500);
            }, 3000);
            
        } catch (e) {
            console.error('Erreur lors du chargement:', e);
        }
    }
    
    // Définir la date par défaut
    if (!dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
});

// Animations CSS dynamiques
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 107, 157, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(255, 107, 157, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 107, 157, 0); }
    }
`;
document.head.appendChild(style);

// Auto-sauvegarde toutes les 30 secondes
setInterval(() => {
    if (titleInput.value || editor.value) {
        const contentData = {
            title: titleInput.value,
            date: dateInput.value,
            readingTime: readingTimeInput.value,
            intro: introInput.value,
            learningPoints: learningPointsInput.value,
            content: editor.value,
            timestamp: new Date().toISOString(),
            autoSave: true
        };
        
        localStorage.setItem('builderContent', JSON.stringify(contentData));
    }
}, 30000);