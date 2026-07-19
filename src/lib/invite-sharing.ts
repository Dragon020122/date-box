export const INVITE_SHARE_TITLE = "一份来自Date Box的心动邀请";
export const INVITE_SHARE_TEXT = "我已经偷偷写下今晚的期待，轮到你了。";

type ShareFunction = (data: ShareData) => Promise<void>;

export async function tryShareInvite(
  share: ShareFunction | undefined,
  inviteUrl: string,
): Promise<boolean> {
  if (!share) {
    return false;
  }

  try {
    await share({
      title: INVITE_SHARE_TITLE,
      text: INVITE_SHARE_TEXT,
      url: inviteUrl,
    });
    return true;
  } catch {
    return false;
  }
}

export function isWeChatUserAgent(userAgent: string): boolean {
  return /MicroMessenger/i.test(userAgent);
}

export function getInviteDisplayDomain(inviteUrl: string): string {
  try {
    return new URL(inviteUrl).hostname.replace(/^www\./i, "");
  } catch {
    return "Date Box CloudBase";
  }
}

export function formatInviteExpiry(expiresAt: number): string {
  const date = new Date(expiresAt);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}月${day}日 ${hours}:${minutes}`;
}
