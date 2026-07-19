import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QRCodeSVG } from "qrcode.react";

import {
  INVITE_SHARE_TEXT,
  INVITE_SHARE_TITLE,
  formatInviteExpiry,
  getInviteDisplayDomain,
  isWeChatUserAgent,
  tryShareInvite,
} from "../src/lib/invite-sharing.ts";
import {
  RESULT_SHARE_TEXT,
  RESULT_SHARE_TITLE,
  tryShareResult,
} from "../src/lib/result-sharing.ts";

const inviteUrl = "https://date-box-123.tcloudbaseapp.com/#invite=v1.complete-payload";

assert.equal(isWeChatUserAgent("Mozilla/5.0 MicroMessenger/8.0.55"), true);
assert.equal(isWeChatUserAgent("Mozilla/5.0 Safari/605.1.15"), false);
assert.equal(
  getInviteDisplayDomain(inviteUrl),
  "date-box-123.tcloudbaseapp.com",
);
assert.equal(getInviteDisplayDomain("not-a-url"), "Date Box CloudBase");

let sharedData;
assert.equal(
  await tryShareInvite(async (data) => { sharedData = data; }, inviteUrl),
  true,
);
assert.deepEqual(sharedData, {
  title: INVITE_SHARE_TITLE,
  text: INVITE_SHARE_TEXT,
  url: inviteUrl,
});
assert.equal(
  await tryShareInvite(async () => Promise.reject(new Error("Share cancelled")), inviteUrl),
  false,
);
assert.equal(await tryShareInvite(undefined, inviteUrl), false);

const resultUrl = "https://date-box-123.tcloudbaseapp.com/#result=v1.complete-payload";
let sharedResultData;
assert.equal(
  await tryShareResult(async (data) => { sharedResultData = data; }, resultUrl),
  true,
);
assert.deepEqual(sharedResultData, {
  title: RESULT_SHARE_TITLE,
  text: RESULT_SHARE_TEXT,
  url: resultUrl,
});
assert.equal(
  await tryShareResult(async () => Promise.reject(new Error("Share cancelled")), resultUrl),
  false,
);
assert.equal(await tryShareResult(undefined, resultUrl), false);

const expiry = new Date(2026, 6, 20, 14, 5).getTime();
assert.equal(formatInviteExpiry(expiry), "07月20日 14:05");

const qrMarkup = renderToStaticMarkup(
  React.createElement(QRCodeSVG, {
    value: inviteUrl,
    size: 122,
    level: "M",
    marginSize: 4,
    bgColor: "#FFFFFF",
    fgColor: "#2F2430",
    title: "邀请二维码",
  }),
);
assert.match(qrMarkup, /^<svg/);
assert.match(qrMarkup, /邀请二维码/);
assert.match(qrMarkup, /#FFFFFF/i);
assert.match(qrMarkup, /#2F2430/i);
assert.match(qrMarkup, /<path/);

console.log("invite-sharing: 19 invite/result share, WeChat, domain and SVG QR checks passed");
