"use client";

import { useState } from "react";

type Option = { value: string; label: string; hint: string };

export default function StatusFields({
  options,
  current,
  scheduleStatuses,
  defaultAt,
  defaultLocation,
}: {
  options: Option[];
  current: string;
  scheduleStatuses: string[];
  defaultAt: string;
  defaultLocation: string;
}) {
  const [status, setStatus] = useState(current);
  const needsSchedule = scheduleStatuses.includes(status);

  return (
    <>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-brand-heading">Move to</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer gap-3 rounded-sm border p-3 text-sm ${
                status === o.value ? "border-brand-green bg-brand-green/5" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="status"
                value={o.value}
                checked={status === o.value}
                onChange={() => setStatus(o.value)}
                className="mt-1 accent-brand-green"
              />
              <span>
                <span className="block font-semibold text-brand-heading">{o.label}</span>
                <span className="block text-xs text-gray-500">{o.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {needsSchedule && (
        <div className="grid gap-4 rounded-sm bg-gray-50 p-4 sm:grid-cols-2">
          <div>
            <label htmlFor="interview_at" className="mb-1 block text-sm font-semibold text-brand-heading">
              Date and time (UK) *
            </label>
            <input id="interview_at" name="interview_at" type="datetime-local" required defaultValue={defaultAt} className="field" />
          </div>
          <div>
            <label htmlFor="interview_location" className="mb-1 block text-sm font-semibold text-brand-heading">
              Where
            </label>
            <input
              id="interview_location"
              name="interview_location"
              defaultValue={defaultLocation}
              placeholder="e.g. #interviews voice channel, GBR Discord"
              className="field"
            />
          </div>
        </div>
      )}
    </>
  );
}
