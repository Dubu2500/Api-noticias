# API de Noticias
Se suo Node + Express + TypeScript que hace proxy a NewsAPI (https://newsapi.org/) para consultar fuentes, titulares y búsquedas generales.

# Configuración 
1) Crea un `.env` en la raíz:
```
NEWSAPI_KEY=tu_api_key
PORT=3000
```

## ejecutar
```
npm install
npm run dev      


## Rutas
- GET `/sources` (category, language, country)
- GET `/top-headlines` (q, sources, category, country, pageSize, page)
- GET `/everything` (q requerido)

## ejemplos

http://localhost:3000/sources?language=en

http://localhost:3000/top-headlines?country=us&pageSize=5

http://localhost:3000/everything?q=javascript&language=en&pageSize=5


