export const RESULT_SHARE_TITLE = "Date Box · 你们的心动结果";
export const RESULT_SHARE_TEXT = "两份期待已经一起揭晓，来看看我们今晚的共同计划。";

type ShareFunction = (data: ShareData) => Promise<void>;

export async function tryShareResult(
  share: ShareFunction | undefined,
  resultUrl: string,
): Promise<boolean> {
  if (!share) {
    return false;
  }

  try {
    await share({
      title: RESULT_SHARE_TITLE,
      text: RESULT_SHARE_TEXT,
      url: resultUrl,
    });
    return true;
  } catch {
    return false;
  }
}
