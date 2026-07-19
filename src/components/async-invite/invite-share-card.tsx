import { Clock3, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { formatInviteExpiry } from "@/lib/invite-sharing";

interface InviteShareCardProps {
  inviteUrl: string;
  hostName: string;
  expiresAt: number;
  displayDomain: string;
}

function ConvergingTrails() {
  return (
    <svg
      viewBox="0 0 260 58"
      className="h-12 w-full"
      role="img"
      aria-label="两条轨迹逐渐靠近"
    >
      <defs>
        <linearGradient id="share-trail-pink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dda9bc" stopOpacity="0.18" />
          <stop offset="1" stopColor="#9f456d" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="share-trail-purple" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c3aed0" stopOpacity="0.18" />
          <stop offset="1" stopColor="#80658f" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d="M4 10 C72 10 112 20 148 28 C184 36 211 32 256 29"
        fill="none"
        stroke="url(#share-trail-pink)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M4 48 C72 48 112 38 148 30 C184 22 211 26 256 29"
        fill="none"
        stroke="url(#share-trail-purple)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="11" r="4" fill="#b85f83" />
      <circle cx="12" cy="47" r="4" fill="#80658f" />
      <circle cx="240" cy="29" r="7" fill="#fff" stroke="#9f456d" strokeWidth="2" />
      <circle cx="240" cy="29" r="2.5" fill="#80658f" />
    </svg>
  );
}

export function InviteShareCard({
  inviteUrl,
  hostName,
  expiresAt,
  displayDomain,
}: InviteShareCardProps) {
  const senderName = hostName.trim() || "有人";
  const expiryText = formatInviteExpiry(expiresAt);

  return (
    <article
      className="relative aspect-[3/4] w-full max-w-[330px] overflow-hidden rounded-[2rem] border border-white bg-[linear-gradient(155deg,#fffdfb_0%,#fff5f8_48%,#f3edf7_100%)] p-5 text-left shadow-[0_24px_70px_rgba(84,55,76,0.16)]"
      aria-label="Date Box 心动邀请截图卡"
    >
      <div className="absolute -right-16 -top-16 size-40 rounded-full bg-pink-200/35 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-16 size-44 rounded-full bg-purple-200/30 blur-2xl" aria-hidden="true" />

      <div className="relative flex h-full flex-col">
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-[0.72rem_0.72rem_0.72rem_0.24rem] bg-text-primary text-[10px] font-bold tracking-[0.12em] text-white">
              DB
            </span>
            <div className="leading-tight">
              <p className="text-xs font-bold tracking-[0.14em] text-text-primary">DATE BOX</p>
              <p className="mt-0.5 text-[10px] text-text-muted">心动计划局</p>
            </div>
          </div>
          <span className="rounded-full border border-border-pink bg-white/70 px-2.5 py-1 text-[9px] font-semibold tracking-[0.12em] text-pink-600">
            INVITATION
          </span>
        </header>

        <div className="mt-3">
          <p className="text-[10px] font-semibold tracking-[0.13em] text-pink-600">
            一份来自
          </p>
          <h2 className="mt-1 line-clamp-2 break-words text-[22px] font-semibold leading-[1.18] tracking-[-0.035em] text-text-primary">
            “{senderName}”的心动邀请
          </h2>
          <p className="mt-1.5 text-[11px] leading-[1.55] text-text-secondary">
            TA已经先写下今晚的期待，<span className="font-semibold text-text-primary">现在轮到你了。</span>
          </p>
        </div>

        <ConvergingTrails />

        <div className="mt-0 grid flex-1 grid-cols-[minmax(0,1fr)_132px] items-center gap-3">
          <div className="min-w-0">
            <div className="space-y-2 text-[10px] font-medium text-text-secondary">
              <p className="flex items-center gap-1.5">
                <Clock3 aria-hidden="true" className="size-3.5 shrink-0 text-pink-600" />
                约2分钟
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0 text-purple-500" />
                不需要登录
              </p>
            </div>
            <p className="mt-3 text-[9px] leading-4 text-text-muted">
              邀请有效至
              <br />
              <span className="font-semibold text-text-secondary">{expiryText}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-[#ece7e9] bg-white p-1 shadow-[0_10px_28px_rgba(65,44,57,0.09)]">
            <QRCodeSVG
              value={inviteUrl}
              size={122}
              level="M"
              marginSize={4}
              bgColor="#FFFFFF"
              fgColor="#2F2430"
              title="扫描二维码打开完整心动邀请链接"
              className="block size-[122px]"
            />
          </div>
        </div>

        <footer className="mt-2 flex items-center justify-between gap-3 border-t border-border-soft pt-2">
          <p className="min-w-0 truncate font-mono text-[8px] tracking-[0.04em] text-text-muted">
            {displayDomain}
          </p>
          <p className="shrink-0 text-[9px] font-semibold text-text-secondary">扫码加入今晚</p>
        </footer>
      </div>
    </article>
  );
}
