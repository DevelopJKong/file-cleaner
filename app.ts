import { readdir, stat, copyFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import dayjs from 'dayjs';

export const DEFAULT_PATH = '/Users/jeongbin/Downloads';

const REGEX = Object.freeze({
  IMAGE_REGEX: /(\.jpg|\.jpeg|\.png|\.gif|\.svg|\.avif|\.webp)$/i,
  VIDEO_REGEX: /\.mp4$|\.avi$|\.mov$|\.wmv$|\.flv$/i,
  AUDIO_REGEX: /\.mp3$/i,
  FILE_REGEX:
    /\.pdf$|\.doc$|\.docx$|\.ppt$|\.pptx$|\.xls$|\.xlsx$|\.csv$|\.hwpx?$|\.txt$|\.md$|\.html?$|\.zip$|\.7z$|\.rar$|\.tar$|\.gz$|\.xd$|\.iso|\.ips|\.ipa|\.psd|\.ai|\.xd|\.kra|\.json/i,
  PDF_REGEX: /\.pdf$/i,
  XLS_REGEX: /\.xls$|\.xlsx$|\.csv$/i,
  ZIP_REGEX: /\.zip$|\.7z$|\.rar$|\.tar$|\.gz$|\.iso$/i,
  HWP_REGEX: /\.hwpx?$/i,
  MARKDOWN_REGEX: /\.md$/i,
  HTML_REGEX: /\.html?$/i,
  ANDROID_REGEX: /\.apk|\.aab$/i,
  IOS_REGEX: /\.ips|\.ipa$/i,
  PHOTO_SHOP_REGEX: /\.psd|\.ai|\.xd$|\.kra$/i,
  JSON_REGEX: /\.json$/i,
});

/** 분류 결과: 최상위 폴더(base)와 files 하위 폴더(sub) */
interface Category {
  base: string;
  sub?: string;
}

/**
 * * 파일 분류
 * @description 파일 이름을 보고 어떤 폴더로 옮길지 결정합니다. 대상이 없으면 null.
 */
const classify = (item: string): Category | null => {
  const {
    IMAGE_REGEX,
    VIDEO_REGEX,
    AUDIO_REGEX,
    FILE_REGEX,
    PDF_REGEX,
    XLS_REGEX,
    ZIP_REGEX,
    HWP_REGEX,
    MARKDOWN_REGEX,
    HTML_REGEX,
    ANDROID_REGEX,
    IOS_REGEX,
    PHOTO_SHOP_REGEX,
    JSON_REGEX,
  } = REGEX;

  if (IMAGE_REGEX.test(item)) return { base: '_day_images' };
  if (VIDEO_REGEX.test(item)) return { base: '_day_videos' };
  if (AUDIO_REGEX.test(item)) return { base: '_day_audios' };

  if (FILE_REGEX.test(item)) {
    if (PDF_REGEX.test(item)) return { base: '_day_files', sub: 'pdf' };
    if (XLS_REGEX.test(item)) return { base: '_day_files', sub: 'xls' };
    if (ZIP_REGEX.test(item)) return { base: '_day_files', sub: 'zip' };
    if (HWP_REGEX.test(item)) return { base: '_day_files', sub: 'hwp' };
    if (MARKDOWN_REGEX.test(item)) return { base: '_day_files', sub: 'markdown' };
    if (HTML_REGEX.test(item)) return { base: '_day_files', sub: 'html' };
    if (ANDROID_REGEX.test(item)) return { base: '_day_files', sub: 'android' };
    if (IOS_REGEX.test(item)) return { base: '_day_files', sub: 'ios' };
    if (PHOTO_SHOP_REGEX.test(item)) return { base: '_day_files', sub: 'photo-shop' };
    if (JSON_REGEX.test(item)) return { base: '_day_files', sub: 'json' };
    return { base: '_day_files', sub: 'all' };
  }

  return null;
};

/** 파일 정리 결과 요약 */
export interface CleanSummary {
  path: string;
  date: string;
  movedCount: number;
  skippedCount: number;
  /** key = 옮겨진 폴더(상대경로), value = 파일 이름 목록 */
  moved: Record<string, string[]>;
}

/**
 * * 파일 정리 (메인 로직)
 * @description 주어진 경로의 파일을 종류별/날짜별 폴더로 이동시키고 결과를 반환합니다.
 * @param targetPath - 정리할 폴더 경로 (기본값: Downloads)
 */
export const cleanFiles = async (targetPath: string = DEFAULT_PATH): Promise<CleanSummary> => {
  const root = path.resolve(targetPath);

  const rootStat = await stat(root).catch(() => {
    throw new Error(`경로를 찾을 수 없습니다: ${root}`);
  });
  if (!rootStat.isDirectory()) {
    throw new Error(`폴더가 아닙니다: ${root}`);
  }

  const date = dayjs().format('YYYY-MM-DD');
  const entries = await readdir(root);

  const moved: Record<string, string[]> = {};
  let skippedCount = 0;

  for (const item of entries) {
    const itemPath = path.join(root, item);

    // 폴더는 건너뛰기 (파일만 처리)
    let stats;
    try {
      stats = await stat(itemPath);
    } catch {
      console.log(`파일 정보를 읽을 수 없습니다: ${item}`);
      continue;
    }
    if (!stats.isFile()) continue;

    const category = classify(item);
    if (!category) {
      skippedCount += 1;
      continue;
    }

    const relParts = category.sub
      ? [category.base, date, category.sub]
      : [category.base, date];
    const destDir = path.join(root, ...relParts);

    await mkdir(destDir, { recursive: true });
    await copyFile(itemPath, path.join(destDir, item));
    await unlink(itemPath);

    const key = relParts.join('/');
    (moved[key] ??= []).push(item);
    console.log(`이동: ${item} -> ${key}`);
  }

  const movedCount = Object.values(moved).reduce((sum, list) => sum + list.length, 0);
  return { path: root, date, movedCount, skippedCount, moved };
};

// CLI로 직접 실행했을 때만 동작 (예: `tsx app.ts [경로]`)
const isMain =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const target = process.argv[2] || DEFAULT_PATH;
  cleanFiles(target)
    .then((result) => {
      console.log(`script done — ${result.movedCount}개 이동, ${result.skippedCount}개 건너뜀`);
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : err);
      process.exitCode = 1;
    });
}
