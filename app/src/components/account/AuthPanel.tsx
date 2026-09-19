"use client";

import { useState } from "react";
import { signUp, signIn, requestPasswordReset, type ActionResult } from "@/lib/actions/auth";
import type { AgeGroup } from "@/lib/db/types";

const AGE_GROUPS: AgeGroup[] = ["10s", "20s", "30s", "40s", "50s", "60s+"];

function ResultMessage({ result }: { result: ActionResult<unknown> | null }) {
  if (!result) return null;
  if (result.ok) {
    return <p className="text-[14px] leading-[1.5] text-[#2A2A2E]">완료되었습니다.</p>;
  }
  return (
    <p role="alert" className="text-[14px] leading-[1.5] text-[#C1272D]">
      {result.error}
    </p>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-[#E3E1DC] bg-[#FFFFFF] p-6">
      <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function inputClass() {
  return "h-12 w-full rounded-lg border border-[#E3E1DC] px-3 text-[16px] text-[#2A2A2E] focus:border-2 focus:border-[#2A2A2E] focus:outline-none";
}

function SignUpCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("20s");
  const [result, setResult] = useState<ActionResult<{ emailConfirmationRequired: boolean }> | null>(null);
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const outcome = await signUp({ email, password, nickname, ageGroup });
    setResult(outcome);
    if (outcome.ok) {
      setConfirmationRequired(outcome.data?.emailConfirmationRequired ?? false);
    }
  }

  if (confirmationRequired) {
    return (
      <Card title="이메일 가입">
        <p className="text-[14px] leading-[1.6] text-[#47474D]">
          {email}로 인증 메일을 보냈습니다. 메일함에서 링크를 눌러 가입을 완료해 주세요.
        </p>
      </Card>
    );
  }

  return (
    <Card title="이메일 가입">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="이메일"
          required
          className={inputClass()}
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="비밀번호"
          minLength={8}
          required
          className={inputClass()}
        />
        <input
          type="text"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="닉네임"
          required
          className={inputClass()}
        />
        <select value={ageGroup} onChange={(event) => setAgeGroup(event.target.value as AgeGroup)} className={inputClass()}>
          {AGE_GROUPS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
        <p className="text-[13px] leading-[1.5] text-[#6E6E75]">
          가입하면 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주합니다.
        </p>
        <ResultMessage result={result} />
        <button
          type="submit"
          className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
        >
          가입하기
        </button>
      </form>
    </Card>
  );
}

function SignInCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<ActionResult | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const outcome = await signIn({ email, password });
    setResult(outcome);
  }

  return (
    <Card title="로그인">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="이메일"
          required
          className={inputClass()}
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="비밀번호"
          required
          className={inputClass()}
        />
        <ResultMessage result={result} />
        <button
          type="submit"
          className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
        >
          로그인
        </button>
      </form>
    </Card>
  );
}

function PasswordResetCard() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ActionResult | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const outcome = await requestPasswordReset(email);
    setResult(outcome);
  }

  return (
    <Card title="비밀번호 재설정">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="가입한 이메일"
          required
          className={inputClass()}
        />
        <ResultMessage result={result} />
        <button
          type="submit"
          className="rounded-lg border border-[#E3E1DC] px-6 py-3 text-base font-semibold leading-[1.25] text-[#2A2A2E] hover:bg-[#F7F6F3]"
        >
          재설정 메일 보내기
        </button>
      </form>
    </Card>
  );
}

export default function AuthPanel() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SignUpCard />
      <SignInCard />
      <PasswordResetCard />
    </div>
  );
}
