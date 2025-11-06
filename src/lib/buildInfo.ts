const buildSha = import.meta.env.VITE_BUILD_SHA ?? '';
const buildBranch = import.meta.env.VITE_BUILD_BRANCH ?? '';
const timestampIso = import.meta.env.VITE_BUILD_TIMESTAMP ?? '';

function formatTimestamp(value: string): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const offsetTotalMinutes = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(offsetTotalMinutes / 60)).padStart(2, '0');
  const offsetRemainingMinutes = String(offsetTotalMinutes % 60).padStart(2, '0');
  const offset = `${sign}${offsetHours}:${offsetRemainingMinutes}`;

  return `${year}-${month}-${day} ${hours}:${minutes} (${offset})`;
}

const formattedTimestamp = formatTimestamp(timestampIso);

const showBranch = buildBranch && buildBranch !== 'main';

export const buildInfo = {
  sha: buildSha || null,
  branch: buildBranch || null,
  timestampIso: timestampIso || null,
  formattedTimestamp,
  showBranch
};

export type BuildInfo = typeof buildInfo;
