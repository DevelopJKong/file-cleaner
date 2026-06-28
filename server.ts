import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cleanFiles, DEFAULT_PATH } from './app';

const app = new Hono();

// 헬스 체크 / 기본 경로 확인
app.get('/', (c) =>
  c.json({
    status: 'ok',
    defaultPath: DEFAULT_PATH,
    usage: 'POST /clean { "path": "원하는 폴더 경로 (생략 시 기본값)" }',
  }),
);

/**
 * 파일 정리 실행
 * body 예시: { "path": "/Users/jeongbin/Desktop" }
 * path를 생략하면 DEFAULT_PATH(Downloads)에서 동작합니다.
 */
app.post('/clean', async (c) => {
  let body: { path?: string } = {};
  try {
    body = await c.req.json();
  } catch {
    // body가 비어있으면 기본 경로 사용
  }

  const targetPath = body.path?.trim() || DEFAULT_PATH;

  try {
    const result = await cleanFiles(targetPath);
    return c.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return c.json({ success: false, error: message }, 400);
  }
});

const port = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`file-cleaner API listening on http://localhost:${info.port}`);
});
