# Étape 1 : Utiliser l'image officielle Nginx
FROM nginx:alpine

# Étape 2 : Supprimer la configuration par défaut (optionnel)
RUN rm -rf /usr/share/nginx/html/*

# Étape 3 : Copier ton site dans le dossier Nginx
COPY . /usr/share/nginx/html

# Étape 4 : Exposer le port 80
EXPOSE 80

# Étape 5 : Lancer Nginx en mode foreground (nécessaire pour Docker)
CMD ["nginx", "-g", "daemon off;"]
