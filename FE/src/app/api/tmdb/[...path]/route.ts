import type { NextRequest } from "next/server";

const moviePath = /^(movie\/(popular|[1-9][0-9]*)|search\/movie)$/;

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const endpoint = path.join("/");
  if (!moviePath.test(endpoint)) {
    return Response.json({ message: "지원하지 않는 영화 요청이에요." }, { status: 404 });
  }

  const baseUrl = process.env.TMDB_API_BASE_URL || process.env.VITE_TMDB_API_BASE_URL;
  const token = process.env.TMDB_ACCESS_TOKEN || process.env.VITE_TMDB_ACCESS_TOKEN;
  if (!baseUrl || !token) {
    return Response.json({ message: "TMDB 환경 설정이 필요해요." }, { status: 503 });
  }

  try {
    const url = new URL(`${baseUrl.replace(/\/$/, "")}/${endpoint}`);
    const query = request.nextUrl.searchParams;
    for (const name of ["query", "language", "include_adult", "page"]) {
      const value = query.get(name);
      if (value !== null) url.searchParams.set(name, value);
    }

    const upstream = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    return Response.json(await upstream.json(), { status: upstream.status });
  } catch {
    return Response.json({ message: "영화 정보를 불러오지 못했어요." }, { status: 502 });
  }
}
