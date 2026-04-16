export interface UploadOptions {
  fieldName?: string;
  extraFields?: Record<string, string | Blob>;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

export interface UploadError extends Error {
  status?: number;
  response?: string;
}

export function uploadFiles<T = unknown>(
  path: string,
  files: File | File[] | FileList,
  options: UploadOptions = {}
): Promise<T> {
  const list = normalizeFiles(files);
  const fieldName = options.fieldName ?? (list.length > 1 ? 'files' : 'file');

  const form = new FormData();
  for (const file of list) {
    form.append(fieldName, file, file.name);
  }
  if (options.extraFields) {
    for (const [key, value] of Object.entries(options.extraFields)) {
      form.append(key, value);
    }
  }

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api${path}`);
    xhr.withCredentials = true;

    if (options.onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          options.onProgress!(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const contentType = xhr.getResponseHeader('content-type') ?? '';
        if (contentType.includes('application/json') && xhr.responseText) {
          try {
            resolve(JSON.parse(xhr.responseText) as T);
          } catch {
            resolve(undefined as T);
          }
        } else {
          resolve(undefined as T);
        }
      } else {
        const err: UploadError = Object.assign(
          new Error(xhr.responseText || `Upload failed with status ${xhr.status}`),
          { status: xhr.status, response: xhr.responseText }
        );
        reject(err);
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new DOMException('Upload aborted', 'AbortError'));
    });

    if (options.signal) {
      if (options.signal.aborted) {
        xhr.abort();
        return;
      }
      options.signal.addEventListener('abort', () => xhr.abort(), { once: true });
    }

    xhr.send(form);
  });
}

function normalizeFiles(files: File | File[] | FileList): File[] {
  if (files instanceof File) return [files];
  if (Array.isArray(files)) return files;
  return Array.from(files);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
