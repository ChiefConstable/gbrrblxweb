import JobForm from "@/components/admin/JobForm";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewJobPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <>
      <h1 className="text-2xl">Add a job</h1>
      <JobForm error={error} />
    </>
  );
}
