import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const PUERTO = Number(process.env.PORT) || 3000;

const clienteHttp = axios.create({
  baseURL: "https://newsapi.org/v2",
  headers: { "X-Api-Key": process.env.NEWSAPI_KEY ?? "" }
});

const aplicacion = express();

function responderError(res: Response, err: any) { //reenvía lo de NewsAPI si existe
  const status = err?.response?.status ?? 500;
  res.status(status).json(err?.response?.data ?? { error: "Error" });
}


aplicacion.get("/", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    usa: [
      "/sources?language=en",
      "/top-headlines?country=mx&pageSize=5",
      "/everything?q=javascript&language=en&pageSize=5"
    ]
  });
});


//sources category, language, country
aplicacion.get("/sources", async (req: Request, res: Response) => {
  if (!process.env.NEWSAPI_KEY) return res.status(500).json({ error: "Falta NEWSAPI_KEY en .env" });
  try {
    const { data } = await clienteHttp.get("/top-headlines/sources", {
      params: {
        category: req.query.category,
        language: req.query.language,
        country: req.query.country
      }
    });
    res.json(data);
  } catch (err) {
    responderError(res, err);
  }
});

//top-headlines  q, sources, category, country, pageSize, page
aplicacion.get("/top-headlines", async (req: Request, res: Response) => {
  if (!process.env.NEWSAPI_KEY) return res.status(500).json({ error: "Falta NEWSAPI_KEY en .env" });
  try {
    const params = {
      q: req.query.q,
      sources: req.query.sources,
      category: req.query.category,
      country: req.query.country,
      pageSize: req.query.pageSize,
      page: req.query.page
    } as any;

    const { data } = await clienteHttp.get("/top-headlines", { params });
    res.json(data);
  } catch (err) {
    responderError(res, err);
  }
});

//everything  requiere q
aplicacion.get("/everything", async (req: Request, res: Response) => {
  if (!process.env.NEWSAPI_KEY) return res.status(500).json({ error: "Falta NEWSAPI_KEY en .env" });
  const q = String(req.query.q ?? "");
  if (!q) return res.status(400).json({ error: "Falta parámetro requerido: q" });

  try {
    const params = {
      q,
      sources: req.query.sources,
      domains: req.query.domains,
      from: req.query.from,
      to: req.query.to,
      language: req.query.language,
      sortBy: req.query.sortBy,
      pageSize: req.query.pageSize,
      page: req.query.page
    } as any;

    const { data } = await clienteHttp.get("/everything", { params });
    res.json(data);
  } catch (err) {
    responderError(res, err);
  }
});


aplicacion.listen(PUERTO, () => {
  console.log(`[API] Servidor en http://localhost:${PUERTO}`);
});
