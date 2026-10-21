import Link from "next/link";
import { STATUSES, STATUS_LABEL, STATUS_STYLE, formatReference, listAllApplications, type ApplicationStatus } from "@/lib/applications";

type Props = { searchParams: Promise<{ status?: string }> };

export default async function AdminApplicationsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const filter = STATUSES.includes(status as ApplicationStatus) ? (status as ApplicationStatus) : undefined;
  const [applications, all] = await Promise.all([listAllApplications(filter), filter ? listAllApplications() : null]);
  const counts = (all ?? applications).reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {});
  const total = (all ?? applications).length;

  return (
    <>
      <h1 className="text-2xl">Applications</h1>

      <div className="mt-6 flex flex-wrap gap-2" aria-label="Filter by status">
        <FilterChip href="/admin/applications" active={!filter} label={`All (${total})`} />
        {STATUSES.map((s) => (
          <FilterChip
            key={s}
            href={`/admin/applications?status=${s}`}
            active={filter === s}
            label={`${STATUS_LABEL[s]} (${counts[s] ?? 0})`}
          />
        ))}
      </div>

      {applications.length === 0 ? (
        <p className="mt-10 rounded-sm border border-dashed border-gray-300 p-10 text-center text-sm text-gray-600">
          No applications here yet.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-brand-dark text-xs text-brand-heading">
                <th className="px-3 py-2">Ref</th>
                <th className="px-3 py-2">Roblox username</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Applied</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={`/admin/applications/${a.id}`} className="font-bold text-brand-green hover:underline">
                      {formatReference(a.reference)}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    {[a.first_name, a.last_name].filter(Boolean).join(" ")}
                    <div className="text-xs text-gray-500">
                      signed in as {a.username} ({a.provider})
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {a.job_title}
                    <div className="text-xs text-gray-500">{a.job_location}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">{new Date(a.created_at).toLocaleDateString("en-GB")}</td>
                  <td className="px-3 py-3">
                    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[a.status]}`}>
                      {STATUS_LABEL[a.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        active ? "bg-brand-dark text-white" : "bg-gray-100 text-brand-heading hover:bg-gray-200"
      }`}
    >
      {label}
    </Link>
  );
}
